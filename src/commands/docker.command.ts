import { exec, execSync } from "child_process";
import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { ARDCliFile } from "../interfaces/ard-cli.interface";
import { ArdCommand } from "../utils/decorators/ard-command.decorator";
import { COLORS, CommandBase } from "./command.base";

@ArdCommand
export class DockerCommand extends CommandBase {
    constructor(program: Command) {
        super(program)
    }
    override init(): void {
        const buildCommand = new Command('build')
            .description('Used to build an image.')
            .option('--push', 'Push to repo immediately after build.')
            .action((arg, options) => this.buildAction(arg, options));

        const pushCommand = new Command('push')
            .description('Push to GitHub Container Registry')
            .action((arg, options) => this.pushAction(arg, options));

        this.program.command('docker')
            .description('Docker things')
            .addCommand(buildCommand)
            .addCommand(pushCommand)
    }

    private buildAction(arg: string, options: any) {
        const projectSettings: ARDCliFile = this.getProjectSettings();
        //Load docker file, 
        let dockerFile: string = null;
        let dockerFileName: string = projectSettings.dockerFile || 'dockerfile'

        try {
            this.print('Looking for dockerfile!');
            dockerFile = readFileSync(path.join(process.cwd(), dockerFileName), { encoding: 'utf-8' });
        }
        catch (e) {
            this.print('Unable to locate dockerfile!', COLORS.RED);
            return;
        }

        //Check for labels & Add if needed
        if (dockerFile.indexOf('LABEL') < 0) {
            this.print('This dockerfile is missing labels! Adding from settings!')
            let hosts: string = "";

            dockerFile += '\nLABEL traefik.enable="true"';

            if (projectSettings.url != null) {
                for (let domain of projectSettings.url) {
                    hosts += 'Host(`' + domain + '`) || ';
                }

                hosts = hosts.slice(0, -4);
                dockerFile += `\nLABEL traefik.http.routers.${projectSettings.imageName}.rule="${hosts}"`;
            }

            dockerFile += `\nLABEL traefik.http.routers.${projectSettings.imageName}.entrypoints="websecured"`;
            dockerFile += `\nLABEL traefik.http.routers.${projectSettings.imageName}.tls.certresolver="le"`;

            writeFileSync(path.join(process.cwd(), dockerFileName), dockerFile)
        }

        //Build image
        this.print('Building Image!')
        try {
            execSync(`docker build -t ghcr.io/arandomdeveloperllc/${projectSettings.imageName} .`, { stdio: 'inherit' })
        } catch (e) {
            this.print('Error building image: ' + e.message, COLORS.RED);
            return;
        }

        //Push option
        if (options.opts().push) {
            this.print('Pushing Image!')
            try {
                execSync(`docker push ghcr.io/arandomdeveloperllc/${projectSettings.imageName}:latest`, { stdio: 'inherit' })
            } catch (e) {
                this.print('Error building image: ' + e.message, COLORS.RED);
                return;
            }
        }
    }

    private pushAction(arg: string, options: any) {
        const projectSettings: ARDCliFile = this.getProjectSettings();
        this.print('Pushing Image!')
        try {
            execSync(`docker push ghcr.io/arandomdeveloperllc/${projectSettings.imageName}:latest`, { stdio: 'inherit' })
        } catch (e) {
            this.print('Error building image: ' + e.message, COLORS.RED);
            return;
        }
    }

    private getProjectSettings(): ARDCliFile {
        let cliFile: string = null;

        try {
            this.print('Looking for a .ard-cli file!');
            cliFile = readFileSync(path.join(process.cwd(), '.ard-cli'), { encoding: 'utf-8' });
        }
        catch (e) {
            this.print('Unable to find .ard-cli file! Please make sure this file exists!', COLORS.RED)
            return;
        }

        const projectSettings: ARDCliFile = JSON.parse(cliFile);
        projectSettings.imageName = projectSettings.imageName.length <= 0 ? projectSettings.name.toLocaleLowerCase().replace(
            / /g,
            ''
        ) : projectSettings.imageName;

        this.print('--------------------------------------------')
        this.print(`Here's what was in the CLI file : \n${cliFile}`);
        this.print(`This is the image name: ${projectSettings.imageName}`)
        this.print('--------------------------------------------')

        return projectSettings;
    }
}