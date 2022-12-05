import { Command } from "commander";
import { existsSync, writeFileSync } from "fs";
import path from "path";
import { ARDCliFile } from "../interfaces/ard-cli.interface";
import { ArdCommand } from "../utils/decorators/ard-command.decorator";
import { COLORS, CommandBase } from "./command.base";

@ArdCommand
export class InitCommand extends CommandBase {

    constructor(program: Command) {
        super(program);
    }

    protected init(): void {
        const initCliCommand = new Command('ard-cli')
            .description('Create new .ard-cli file!')
            .action((arg:string, options:any)=>this.initCliAction(arg, options))
        this.program.command('init')
            .description('Used to init stuff!')
            .addCommand(initCliCommand)
    }

    private initCliAction(arg: string, options: any) {
        //Make sure we don't already have a .ard-cli file
        const cliFileExists: boolean = existsSync(path.join(process.cwd(), '.ard-cli'))

        if (cliFileExists) {
            this.print('A .ard-cli file already exists!', COLORS.RED);
            return;
        }

        let completed: boolean = false;
        let projectSettings: ARDCliFile = {} as ARDCliFile;

        while (!completed) {

            try {
                let projectName: string = this.input(`Project Name: `)
                let urls: string = this.input(`Project Domains (space separated): `);

                projectSettings.name = projectName;
                projectSettings.imageName = projectName.toLowerCase().replace(/ /g, '');
                projectSettings.url = urls.split(' ')[0].length <= 0 ? [] : urls.split(' ');

                this.print('--------------------------------------------')
                this.print(`Here's what was in the CLI file : \n${JSON.stringify(projectSettings, null, 4)}`);
                this.print(`This is the image name: ${projectSettings.imageName}`)
                this.print('--------------------------------------------')

                const okResponse: string = this.input('Everything look good? (y/n): ', 'y').toLowerCase() || 'y';

                completed = okResponse == 'y'
            }
            catch(e)
            {
                this.print('There was an Error! ' + e, COLORS.RED);
            }
        }

        try {
            writeFileSync(path.join(process.cwd(), '.ard-cli'), JSON.stringify(projectSettings, null, 4));
        }
        catch (e) {
            this.print('Unable to save cli file! Error: ' + e.message, COLORS.RED);
        }
    }
}