import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';


interface ProjectTypeConfig {
    requiredFiles: string[];
    matchAny?: boolean;  // Optional
}

interface ProjectConfig {
    [key: string]: ProjectTypeConfig; 
}

export function projectDetector(rootFolder: string, projectConfig: ProjectConfig) {
    console.log("Project detector called");
    let detected = false;
 
    for (const [projectType, { requiredFiles, matchAny }] of Object.entries(projectConfig)) {
        if(detected) {
            break;
        }
        let allFilesExist = false;

        if (matchAny) {
            allFilesExist = requiredFiles.some((file: string) => 
                fs.existsSync(path.join(rootFolder, file))
            );
        } else {
            allFilesExist = requiredFiles.every((file: string) => 
                fs.existsSync(path.join(rootFolder, file))
            );
        }

        if (allFilesExist) {
            // vscode.window.showInformationMessage(`This is a ${projectType} project.`);
            detected = true;
            vscode.commands.executeCommand('extension.runParser', rootFolder,projectType)
            .then(() => {
                console.log("HELO WORLD");
                vscode.window.showInformationMessage(`Parser executed successfully for ${projectType} project.`);
                vscode.commands.executeCommand('extension.refreshPackageTree');
            });
        }
    }


    
}
