import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

// this whill check if the droot folder has basic android files and folder structure
//like build.gradle, src/main/java, src/main/res, src/main/AndroidManifest.xml

export function isAndroidProject(rootFolder:string):boolean{

    const isAndroidProject=fs.existsSync(path.join(rootFolder,'build.gradle')) && 
                        fs.existsSync(path.join(rootFolder,'app/src/main/AndroidManifest.xml'));
                           
    return isAndroidProject;
}