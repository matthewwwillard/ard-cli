#!/usr/bin/env node

import { Command } from "commander";
import { CreateApiCommand } from "./commands/CreateApi.command";
import { commands } from "./utils/decorators/ard-command.decorator";

const program:Command = new Command();

program
    .name('ard-cli')
    .description('A tool for a random developer');

//Import all Commands
new CreateApiCommand(program);

program.parse();
