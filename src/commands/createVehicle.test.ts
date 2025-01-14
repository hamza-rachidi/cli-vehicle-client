
import { Command } from "commander";
import create_Vehicle from "./createVehicle";

global.fetch = jest.fn(); // Mock global fetch

describe("createVehicle command", () => {
  let command: Command;

  beforeEach(() => {
    // Initialiser la commande avec une option parent pour --address
    const parentCommand = new Command();
    parentCommand.option("-a, --address <url>", "specify server address");
    command = create_Vehicle();
    parentCommand.addCommand(command); // Ajoute la commande enfant au parent
    jest.clearAllMocks(); // Réinitialiser les mocks
  });

  test("should display an error when no server address is provided", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    await expect(
      command.parseAsync(["node", "create-vehicle", "-c", "abcd", "-b", "50", "-l", "12.34", "-L", "56.78"])
    ).rejects.toThrow("process.exit");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Server address (--address) is required");
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  test("should successfully create a vehicle with valid input", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        vehicle: {
          id: "123",
          shortcode: "abcd",
          battery: 50,
          position: {
            longitude: 12.34,
            latitude: 56.78,
          },
        },
      }),
    });

    await command.parseAsync([
      "node",
      "create-vehicle",
      "--address",
      "http://localhost:8080",
      "-c",
      "abcd",
      "-b",
      "50",
      "-l",
      "12.34",
      "-L",
      "56.78",
    ]);

    expect(consoleLogSpy).toHaveBeenCalledWith("Created vehicle 'abcd', with ID '123'");

    consoleLogSpy.mockRestore();
  });

  test("should display an error when the server returns an error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 400,
          message: "Invalid shortcode",
          details: ["Shortcode must be 4 characters long"],
        },
      }),
    });

    await expect(
      command.parseAsync([
        "node",
        "create-vehicle",
        "--address",
        "http://localhost:8080",
        "-c",
        "abc", // Invalid shortcode
        "-b",
        "50",
        "-l",
        "12.34",
        "-L",
        "56.78",
      ])
    ).rejects.toThrow("process.exit");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Could not create the vehicle \n Error: 400 - Invalid shortcode. Details: ["Shortcode must be 4 characters long"]`
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
