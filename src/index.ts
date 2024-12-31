#!/usr/bin/env node

import { Command } from "commander";
import create_Vehicle from "./commands/createVehicle";

const program = new Command();


program
  .name("vehicle-cli")
  .description("CLI designed to help the client manage vehicles through the server")
  .version("1.0.0")
  .option('-a, --address <url>', 'specify the server address to use')
  .hook("preAction", (thisCommand) => {
    // Hook pour capturer l'option API URL avant toute commande
    const address = thisCommand.opts().address;
    if (!address) {
      console.error("Error: --address is required");
      process.exit(1);
    }
  });


  async function main() {
    program.addCommand(await create_Vehicle());
    // Add other commands later : program.addCommand(await listVehicle(address));
    program.parse(process.argv);
  }

  main().catch((error) => {
    console.error("Unexpected error:", error.message);
    process.exit(1);
  });



