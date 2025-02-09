"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJavaParser = runJavaParser;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// import { generateMappings } from '../graphGeneration/mappingsGeneration/mappingGenerator';
// This function runs the Java parser
async function runJavaParser(workspaceFolder, type) {
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
        await new Promise((resolve, reject) => {
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
    }
    catch (error) {
        console.error("Error in runJavaParser:", error);
        vscode.window.showErrorMessage(`Failed to run Java parser: ${error}`);
        throw error; // Re-throw if you want calling code to handle the error
    }
}
//# sourceMappingURL=javaParser.js.map