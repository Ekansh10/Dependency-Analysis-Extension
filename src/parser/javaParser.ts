import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
// import { generateMappings } from '../graphGeneration/mappingsGeneration/mappingGenerator';


// This function runs the Java parser
export async function runJavaParser(workspaceFolder: string, type: string): Promise<void> {
    try {
        const javaFilePath = path.join(__dirname, '..', 'src', 'parser', 'java', 'Java-parser.jar');
        const outputFileDir = path.join(workspaceFolder, '.vscode');
        const outputFilePath = path.join(outputFileDir, 'dependencies.json');

        // Check and delete the existing output file if it exists
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }

        if (type === "Android") {
            workspaceFolder = path.join(workspaceFolder, 'app');
        }
        console.log(workspaceFolder);

        const configPath = path.join(__dirname, '..', 'src', 'projectTypes', 'projectConfig.json');
        console.log(`Config path from javaparser ${configPath}`);
        if (!fs.existsSync(configPath)) {
            vscode.window.showErrorMessage('Project configuration file not found.');
            return;
        }

        console.log("javaFilePath: ", javaFilePath);
        console.log("outputFileDir: ", outputFileDir);
        const command = `java -jar "${javaFilePath}" "${workspaceFolder}" "${outputFilePath}"`;
        const options = { cwd: outputFileDir };

        if (!fs.existsSync(outputFileDir)) {
            fs.mkdirSync(outputFileDir);
        }

        vscode.window.showInformationMessage(`Running Java parser on folder: ${workspaceFolder}`);

        // Convert cp.exec to Promise-based execution
        await new Promise<void>((resolve, reject) => {
            cp.exec(command, options, (error, stdout, stderr) => {
                console.log("Inside exec");
                
                if (error) {
                    console.log("Error: ", error);
                    vscode.window.showErrorMessage(`Error running Java parser: ${error.message}`);
                    reject(error);
                    return;
                }

                console.log("Mid way through if");
                
                if (stderr) {
                    console.log("stderr: ", stderr);
                    vscode.window.showErrorMessage(`Java parser error: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }

                console.log("Completed last if");
                vscode.window.showInformationMessage(`Java parser output: ${stdout}`);
                vscode.window.showInformationMessage(`JSON file generated at: ${outputFilePath}`);
                console.log("Completed execution");
                resolve();
            });
        });

        console.log("Parsing done");
        
    } catch (error) {
        console.error("Error in runJavaParser:", error);
        vscode.window.showErrorMessage(`Failed to run Java parser: ${error}`);
        throw error; // Re-throw if you want calling code to handle the error
    }
}


