import { Command } from "commander";
import list_Vehicles from "../commands/listVehicles";

describe("list_Vehicles functionalities unit tests", () => {
  let program: Command;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    program = new Command();
    program.option("--address <string>");
    program.addCommand(list_Vehicles());
    global.fetch = jest.fn(); // Mock the global fetch function
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocked functions after each test
  });

  it("should display a table of vehicles when the server returns data", async () => {
    // Given: The server responds successfully with vehicle data
    const mockVehicles = [
      { id: "1", shortcode: "abcd", battery: 80, position: { longitude: 20.0, latitude: 30.0 } },
      { id: "2", shortcode: "efgh", battery: 60, position: { longitude: 25.0, latitude: 35.0 } },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ vehicles: mockVehicles }), { status: 200 })
    );

    // When: The user runs the list-vehicles command
    const consoleTableSpy = jest.spyOn(console, "table").mockImplementation();
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await program.parseAsync([
      "node",
      "vehicle-cli",
      "--address",
      "http://localhost:8080",
      "list-vehicles",
    ]);

    // Then: A table of vehicles is displayed
    expect(consoleLogSpy).toHaveBeenCalledWith("List of Vehicles:");
    expect(consoleTableSpy).toHaveBeenCalledWith([
      { ID: "1", Shortcode: "abcd", Battery: "80%", Longitude: 20.0, Latitude: 30.0 },
      { ID: "2", Shortcode: "efgh", Battery: "60%", Longitude: 25.0, Latitude: 35.0 },
    ]);

    consoleTableSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("should display a message when no vehicles are found", async () => {
    // Given: The server responds with no vehicles
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ vehicles: [] }), { status: 200 })
    );

    // When: The user runs the list-vehicles command
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await program.parseAsync([
      "node",
      "vehicle-cli",
      "--address",
      "http://localhost:8080",
      "list-vehicles",
    ]);

    // Then: A no-vehicles message is displayed
    expect(consoleLogSpy).toHaveBeenCalledWith("No vehicles found on the server.");

    consoleLogSpy.mockRestore();
  });

  it("should handle server errors and display error details", async () => {
    // Given: The server responds with an error
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: 500, message: "Internal Server Error", details: ["Unexpected database issue"] },
        }),
        { status: 500 }
      )
    );

    // When: The user runs the list-vehicles command
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      program.parseAsync(["node", "vehicle-cli", "--address", "http://localhost:8080", "list-vehicles"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: An appropriate error message is displayed
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error fetching vehicles: 500 - Internal Server Error")
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Unexpected database issue"));

    consoleErrorSpy.mockRestore();
  });

  it("should handle network errors gracefully", async () => {
    // Given: The fetch request fails due to a network issue
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // When: The user runs the list-vehicles command
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      program.parseAsync(["node", "vehicle-cli", "--address", "http://localhost:8080", "list-vehicles"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: A network error message is displayed
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the server:", "Network Error");

    consoleErrorSpy.mockRestore();
  });

  it("should handle missing address argument", async () => {
    // Given: The user does not provide the --address option
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // When: The user runs the list-vehicles command without an address
    await expect(
      program.parseAsync(["node", "vehicle-cli", "list-vehicles"])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: An error message is displayed
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Server address (--address) is required");

    consoleErrorSpy.mockRestore();
  });
});
