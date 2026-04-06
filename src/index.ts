import { program } from "commander";
import { registerCreateCommand } from "./commands/create.js";

registerCreateCommand(program);
program.parse();
