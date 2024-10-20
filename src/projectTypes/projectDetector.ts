import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

// Define the project configuration interface
interface ProjectTypeConfig {
    requiredFiles: string[];
    matchAny?: boolean;  // Optional
}

interface ProjectConfig {
    [key: string]: ProjectTypeConfig;  // Key is the project type (Android, Maven, etc.)
}

export function projectDetector(rootFolder: string, projectConfig: ProjectConfig) {
 
    for (const [projectType, { requiredFiles, matchAny }] of Object.entries(projectConfig)) {
        let allFilesExist = false;

        if (matchAny) {
            // If matchAny is true, check if at least one of the required files exists
            allFilesExist = requiredFiles.some((file: string) => 
                fs.existsSync(path.join(rootFolder, file))
            );
        } else {
            // If matchAny is false or not provided, check if all files exist
            allFilesExist = requiredFiles.every((file: string) => 
                fs.existsSync(path.join(rootFolder, file))
            );
        }

        if (allFilesExist) {
            vscode.window.showInformationMessage(`This is a ${projectType} project.`);
            return;
        }
    }

    vscode.window.showInformationMessage('Unknown project type.');
}
