import chalk from "chalk";
import { Command } from "commander";
import { CommandBase } from "./command.base";
import { exec } from "child_process";
import { mkdir } from "fs/promises";
const git = require('nodegit');

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
                console.log(chalk.hex('#F28C28')(`Making dir ${apiName} and cloning API Base!`));
                git.Clone("https://github.com/matthewwwillard/nestjs-api-base.git", './'+apiName).then(
                    (repo)=>{

                        console.log(chalk.hex('#F28C28')(`Installing Node Modules in Cloned Repo!`));

                        const changeAndInstall = exec(`cd ${apiName} && npm install`);

                        changeAndInstall.stdout.pipe(process.stdout);
                        changeAndInstall.on('close', (code)=>{
                            console.log(chalk.hex('#F28C28')('All set! Have fun!'));
                        });
                    }
                ).catch(
                    (e)=>{
                        console.error(chalk.red(e.message));
                    }
                )
            }
        ).catch((e)=>{
            console.log(chalk.red(e.message));
        })
        
    }
}