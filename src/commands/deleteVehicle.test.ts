import { Command } from "commander";
import delete_Vehicle from "../commands/deleteVehicle";

describe("delete_Vehicle functionalities unit tests", () => {
  let program: Command;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    program = new Command();
    program.option("--address <string>");
    program.addCommand(delete_Vehicle());
    global.fetch = jest.fn(); // Mock the global fetch function
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocked functions after each test
  });

  it("should successfully delete a vehicle when a valid ID is provided", async () => {
    // Given: The server responds successfully to the DELETE request
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, message: "Vehicle deleted successfully" }),
        { status: 200 }
      )
    );

    // When: The user provides a valid delete-vehicle command
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await program.parseAsync([
      "node",
      "vehicle-cli",
      "--address",
      "http://localhost:8080",
      "delete-vehicle",
      "--id=1",
    ]);

    // Then: A success message is logged
    expect(consoleLogSpy).toHaveBeenCalledWith("Vehicle with ID '1' was successfully deleted.");

    consoleLogSpy.mockRestore();
  });

  it("should handle a server error when deleting a vehicle", async () => {
    // Given: The server returns an error response
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: 404, message: "Not Found", details: ["Vehicle ID does not exist"] },
        }),
        { status: 404 }
      )
    );

    // When: The user tries to delete a vehicle that does not exist
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      program.parseAsync(["node", "vehicle-cli", "--address", "http://localhost:8080", "delete-vehicle", "--id=999"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: An appropriate error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Could not delete the vehicle. Error: 404 - Not Found. Details: ["Vehicle ID does not exist"]`
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle network errors gracefully", async () => {
    // Given: The fetch request fails due to a network issue
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // When: The user tries to delete a vehicle but the server is unreachable
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      program.parseAsync(["node", "vehicle-cli", "--address", "http://localhost:8080", "delete-vehicle", "--id=1"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: A network error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the server:", "Network Error");

    consoleErrorSpy.mockRestore();
  });

  it("should handle missing address argument", async () => {
    // Given: The user does not provide the --address option
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // When: The user tries to delete a vehicle without specifying the address
    await expect(
      program.parseAsync(["node", "vehicle-cli", "delete-vehicle", "--id=1"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: An error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Server address (--address) is required");

    consoleErrorSpy.mockRestore();
  });

  it("should handle missing ID argument", async () => {
    // Given: The user does not provide the --id option
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
  
    // When: The user tries to delete a vehicle without specifying an ID
    await expect(
      program.parseAsync(["node", "vehicle-cli", "--address", "http://localhost:8080", "delete-vehicle"])
    ).rejects.toThrow("process.exit called with code 1");
  
    // Then: An error message is logged to stderr by commander
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("error: required option '-i, --id <string>' not specified"));
  
    stderrSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });


});
