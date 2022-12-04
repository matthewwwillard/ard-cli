#!/usr/bin/env node

import { Command } from "commander";
import { commands } from "./utils/decorators/ard-command.decorator";

import glob from 'glob';

new Promise((resolve, reject) => {
    glob(__dirname + '/commands/*.command.js', function (err, res) {
        if (err) {
            reject(err)
        } else {
            Promise.all(
                res.map(file => {
                    return import(file.replace(__dirname, '.').replace('.js', ''))
                })
            ).then(()=>resolve([]));
        }
    })
}).then(() => {
    const program: Command = new Command();

    program
        .name('ard-cli')
        .description('A tool for a random developer');

    //Import all Commands

    for (let command of commands) {
        let c = new command(program)
    }

    program.parse();
}).catch((err)=>{
    return 'Unable to Init!';
})
