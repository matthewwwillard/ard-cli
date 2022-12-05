import chalk from "chalk";
import { Command } from "commander";
import { Spinner, createSpinner } from "nanospinner";
import promptSync from 'prompt-sync';

export enum COLORS {
    RED="#FF0000",
    ORANGE="#F28C28"
}
export class CommandBase {
    protected program:Command;
    protected input = promptSync({sigint:true});

    constructor(program:Command){
        this.program = program;
        this.init();
    }

    protected init(){}

    public getSpinner(text:string) : Spinner
    {
        return createSpinner(text);
    }
    public print(text:string, color:COLORS = COLORS.ORANGE)
    {
        console.log(chalk.hex(color)(text));
    }
}