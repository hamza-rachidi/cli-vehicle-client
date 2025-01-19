import { Command } from "commander";
import create_Vehicle from "../commands/createVehicle"; 

describe("create_Vehicle functionalities unit tests", () => {
  let program: Command;
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
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          vehicle: { id: "1", shortcode: "abcd", battery: 50, position: { longitude: 12.34, latitude: 56.78 } },
        }),
        { status: 200 }
      )
    );

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

    
    expect(consoleLogSpy).toHaveBeenCalledWith("Created vehicle 'abcd', with ID '1'");
    
    
    consoleLogSpy.mockRestore();
  });

  it("should handle server not working", async () => {
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("fetch failed"));
  
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
  
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the server:", "fetch failed");
  
    consoleErrorSpy.mockRestore();
  });
  
  it("should handle bad request with invalid argument and reports the error from the server", async () => {
    
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
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Could not create the vehicle"));
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Shortcode must be only 4 characters long"));
    
    consoleErrorSpy.mockRestore();
  });

  it("should handle missing address argument", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
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
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Server address (--address) is required");
  
    consoleErrorSpy.mockRestore();
  });
  
});
