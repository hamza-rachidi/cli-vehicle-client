import { Command } from "commander";
import create_Vehicle from "../commands/createVehicle"; 

describe("create_Vehicle", () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.option("--address <string>");
    program.addCommand(create_Vehicle());
    global.fetch = jest.fn(); // Assurez-vous que fetch est mocké globalement
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaure les mocks après chaque test
  });

  it("should create a vehicle successfully", async () => {
    // Simuler la réponse de l'API
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          vehicle: { id: "1", shortcode: "abcd", battery: 50, position: { longitude: 12.34, latitude: 56.78 } },
        }),
        { status: 200 }
      )
    );

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    
    // Exécuter la commande avec des options
    await program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcd", 
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ]);

    // Vérifier que le message de succès a bien été loggé
    expect(consoleLogSpy).toHaveBeenCalledWith("Created vehicle 'abcd', with ID '1'");
    
    // Restaure le spy
    consoleLogSpy.mockRestore();
  });

  /*it("should handle server not working", async () => {
    // Simuler une erreur de connexion (par exemple, problème réseau)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    
    // Exécuter la commande
    await program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcd", 
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ]);

    // Vérifier que l'erreur de connexion est bien loggée
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the server:", "Network Error");
    
    // Restaure le spy
    consoleErrorSpy.mockRestore();
  });

  it("should handle bad request", async () => {
    // Simuler une réponse d'erreur avec un mauvais shortcode
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: 400, message: "Bad Request", details: ["Shortcode must be exactly 4 characters long"] },
        }),
        { status: 400 }
      )
    );

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    
    // Exécuter la commande avec un shortcode invalide
    await program.parseAsync([
      "node", "vehicle-cli", 
      "--address", "http://localhost:8080", 
      "create-vehicle", 
      "--shortcode=abcedd", 
      "--battery=50", 
      "--longitude=12.34", 
      "--latitude=56.78"
    ]);

    // Vérifier que le message d'erreur est bien loggé
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Could not create the vehicle \n Error: 400 - Bad Request. Details: [\"Shortcode must be exactly 4 characters long\"]"
    );
    
    // Restaure le spy
    consoleErrorSpy.mockRestore();
  });*/
});
