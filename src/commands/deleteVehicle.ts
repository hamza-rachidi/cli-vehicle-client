import { Command } from "commander";

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
}

export default function delete_Vehicle(): Command {
  const deleteVehicle = new Command("delete-vehicle");

  deleteVehicle
    .description("Deletes a vehicle by its ID from the server")
    .requiredOption("-i, --id <string>", "ID of the vehicle to delete")
    .action(async (options, command) => {
      const address = command.parent?.opts()?.address;
      if (!address) {
        console.error("Error: Server address (--address) is required");
        process.exit(1);
      }

      const vehicleId = options.id;

      try {
        const response = await fetch(`${address}/vehicles/${vehicleId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const responseData = (await response.json()) as DeleteResponse;

        if (!response.ok) {
          console.error(
            `Could not delete the vehicle. Error: ${responseData.error?.code} - ${responseData.error?.message}. Details: ${JSON.stringify(
              responseData.error?.details
            )}`
          );
          process.exit(1);
        }

        console.log(`Vehicle with ID '${vehicleId}' was successfully deleted.`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error connecting to the server:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        process.exit(1);
      }
    });

  return deleteVehicle;
}
