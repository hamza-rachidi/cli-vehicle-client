import { Command } from "commander";

interface Vehicle {
  id: string;
  shortcode: string;
  battery: number;
  position: {
    longitude: number;
    latitude: number;
  };
}

interface VehicleResponse {
  vehicles: Vehicle[];
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
}

export default function list_Vehicles(): Command {
  const listVehicles = new Command("list-vehicles");

  listVehicles
    .description("Lists all vehicles available on the server")
    .action(async (_, command) => {
      const address = command.parent?.opts()?.address;
      if (!address) {
        console.error("Error: Server address (--address) is required");
        process.exit(1);
      }

      try {
        const response = await fetch(`${address}/vehicles`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const responseData = (await response.json()) as VehicleResponse;

        if (!response.ok) {
          console.error(
            `Error fetching vehicles: ${responseData.error?.code} - ${responseData.error?.message}. Details: ${JSON.stringify(
              responseData.error?.details
            )}`
          );
          process.exit(1);
        }

        const vehicles = responseData.vehicles;

        if (!vehicles || vehicles.length === 0) {
          console.log("No vehicles found on the server.");
        } else {
          console.log("List of Vehicles:");
          vehicles.forEach((vehicle) => {
            console.log(
              `- ID: ${vehicle.id}, Shortcode: ${vehicle.shortcode}, Battery: ${vehicle.battery}%, Position: [Longitude: ${vehicle.position.longitude}, Latitude: ${vehicle.position.latitude}]`
            );
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error connecting to the server:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        process.exit(1);
      }
    });

  return listVehicles;
}

