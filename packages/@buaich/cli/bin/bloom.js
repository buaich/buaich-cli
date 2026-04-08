#!/usr/bin/env node
import { Command } from "commander";
import { registerCreateCommand } from "../commands/create.js";

const program = new Command();
program.version("1.0.0").description("Bloom CLI");

registerCreateCommand(program);

program.parse();
