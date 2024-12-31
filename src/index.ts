import { Command } from "commander";
import create_Vehicle from "./commands/createVehicle";

const program = new Command();
let address = "";

program
  .name("vehicle-cli")
  .description("CLI designed to help the client manage vehicles through the server")
  .version("1.0.0")
  .option('-a, --address <url>', 'specify the server address to use')
  .hook("preAction", (thisCommand) => {
    // Hook pour capturer l'option API URL avant toute commande
    address = thisCommand.opts().address;
    if (!address) {
      console.error("Error: --address is required");
      process.exit(1);
    }
  });


program.addCommand(create_Vehicle(address));
// here add later : program.addCommand(listVehicle);
program.parse(process.argv);


