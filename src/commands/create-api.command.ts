import chalk from "chalk";
import { Command } from "commander";
import { COLORS, CommandBase } from "./command.base";
import { exec } from "child_process";
import { mkdir } from "fs/promises";
import { ArdCommand } from "../utils/decorators/ard-command.decorator";
const git = require('nodegit');
@ArdCommand
export class CreateApiCommand extends CommandBase {

    constructor(program:Command)
    {
        super(program);
    }

    override init()
    {

        const createCommand = new Command('create')
            .description('Used to create an new API')
            .argument('<string>', 'Api Name')
            .action(this.createAction);
        
        this.program.command('api')
            .description('API stuff')
            .addCommand(createCommand);

    }

    private createAction(apiName:string, options:any) {
        //console.log(apiName, options);
        mkdir(apiName).then(
            ()=>{
                const spinner = super.getSpinner('Working...');
                super.print(`Making dir ${apiName} and cloning API Base!`);
                git.Clone("https://github.com/matthewwwillard/nestjs-api-base.git", './'+apiName).then(
                    (repo)=>{
                        super.print(`Installing Node Modules!`);
                        spinner.start();

                        const changeAndInstall = exec(`cd ${apiName} && npm install`);
                        changeAndInstall.on('close', (code)=>{
                            spinner.success({text:'Done!'});
                            super.print('All set! Have fun!');
                        });
                    }
                ).catch(
                    (e)=>{
                        spinner.error();
                        super.print('Error: ' + e.message, COLORS.RED);
                    }
                )
            }
        ).catch((e)=>{
            super.print('Error: ' + e.message, COLORS.RED);
        })
        
    }
}