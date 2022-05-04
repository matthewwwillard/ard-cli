export let commands:any={};
export function ArdCommand(){
    return (target:Function)=>{
        commands[target.name] = target.prototype;
    }
}