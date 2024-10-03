import * as path from 'path';
import * as fs from 'fs';


export function isMavenProject(rootFolder:string):boolean{
    
    const isMaven= fs.existsSync(path.join(rootFolder,'pom.xml'));

    return isMaven;
}