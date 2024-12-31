import { Command } from "commander";
import fetch from "node-fetch";

type VehicleResponse = {
  id: string;
  shortcode: string;
  battery: number;
  longitude: number;
  latitude: number;
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
};

export default function create_Vehicle(address: string): Command {
const createVehicle = new Command("create-vehicle");

createVehicle
  .description("Creates a new vehicle with the properties chosen by the user and displays a message to validate the creation request otherwise displays the error as thrown by the server in case of invalid options")
  .requiredOption("-c,--shortcode <string>", "Shortcode (must be exactly 4 characters long)")
  .requiredOption("-b,--battery <integer>", "Battery level ranging from 0 to 100 %")
  .requiredOption("-l,--longitude <number>", "Longitude must be between -90 and 90")
  .requiredOption("-L,--latitude <number>", "Latitude must be between -90 and 90")
  .action(async (options) => {
    const payload = {
      shortcode: options.shortcode,
      battery: parseInt(options.battery,10),
      longitude: parseFloat(options.longitude),
      latitude: parseFloat(options.latitude),
    };

    try {
      const response = await fetch(`${address}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as VehicleResponse;

      if (!response.ok) {
        console.error(
          `Could not create the vehicle \n Error: ${responseData.error?.code} - ${responseData.error?.message}. Details: ${JSON.stringify(responseData.error?.details)}`
        );
        process.exit(1);
      }

      console.log(`Created vehicle '${responseData.shortcode}', with ID '${responseData.id}'`);
    } catch (error:any) {
      console.error("Error connecting to the server:", error.message);
      process.exit(1);
    }
  });
  return createVehicle;
}
