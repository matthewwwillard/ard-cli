export let commands: any[] = [];
export function ArdCommand(target:any) {
    commands.push(target); 
}