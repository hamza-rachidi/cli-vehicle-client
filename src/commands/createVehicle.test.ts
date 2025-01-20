import { Command } from "commander";
import create_Vehicle from "../commands/createVehicle"; 

describe("create_Vehicle functionalities unit tests", () => {
  let program: Command;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    program = new Command();
    program.option("--address <string>");
    program.addCommand(create_Vehicle());
    global.fetch = jest.fn(); 
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it("should create a vehicle successfully if user writes a correct syntax", async () => {
    // Given: The server is running and responds successfully
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          vehicle: { id: "1", shortcode: "abcd", battery: 50, position: { longitude: 12.34, latitude: 56.78 } },
        }),
        { status: 200 }
      )
    );
    // When: The user provides a valid create-vehicle command
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    
    await program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcd", 
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ]);

    // Then: The command completes successfully and logs the result
    expect(consoleLogSpy).toHaveBeenCalledWith("Created vehicle 'abcd', with ID '1'");  
    consoleLogSpy.mockRestore();
  });

  it("should handle server is off for the adress ( host and port ) specified by user ", async () => {
    // Given: The server is not running on the host and port specified by user or the http request failed to fetch the server 
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("fetch failed"));

    // When: The user tries to create a vehicle in this case
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect ( program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcd", 
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ])).rejects.toThrow("process.exit called with code 1");

    // Then: An error message is logged and process.exit is called
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the server:", "fetch failed");
  
    consoleErrorSpy.mockRestore();
  });
  
  it("should handle bad request with invalid argument and reports the error from the server", async () => {
    // Given: The server returns a bad request response because of bad arguments written by the user 
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { 
            code: 400, 
            message: "Bad Request", 
            details: ["Shortcode must be only 4 characters long"] 
          },
        }),
        { status: 400 }
      )
    );

    // When: The user provides an invalid shortcode for example; It's just a single examples, many types of bad request exists
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    
    await expect ( program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcdef",  
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ])).rejects.toThrow("process.exit called with code 1");
  
    // Then: An appropriate error message is logged and captured by the CLI as sent by the server before being displayed to the user
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Could not create the vehicle"));
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Shortcode must be only 4 characters long"));
    
    consoleErrorSpy.mockRestore();
  });

  it("should handle missing address argument", async () => {
    // Given: The user does not provide the --address argument for example
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {
      // to silent the lint
    });
  
    // When: The user tries to create a vehicle without writing the address
    await expect(
      program.parseAsync([
        "node",
        "vehicle-cli",
        "create-vehicle",
        "--shortcode=abcd",
        "--battery=50",
        "--longitude=12.34",
        "--latitude=56.78",
      ])
    ).rejects.toThrow("process.exit called with code 1");

    // Then: An error message is logged and process.exit is called
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Server address (--address) is required");
  
    consoleErrorSpy.mockRestore();
  });
});
