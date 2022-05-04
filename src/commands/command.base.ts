import chalk from "chalk";
import { Command } from "commander";

export class CommandBase {
    protected program:Command;

    constructor(program:Command){
        this.program = program;
        this.init();
    }

    protected init(){}
}