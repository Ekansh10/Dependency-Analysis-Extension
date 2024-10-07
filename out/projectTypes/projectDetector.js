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
exports.projectDetector = projectDetector;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
function projectDetector(rootFolder, projectConfig) {
    vscode.commands.executeCommand('start project detector');
    for (const [projectType, { requiredFiles, matchAny }] of Object.entries(projectConfig)) {
        let allFilesExist = false;
        if (matchAny) {
            // If matchAny is true, check if at least one of the required files exists
            allFilesExist = requiredFiles.some((file) => fs.existsSync(path.join(rootFolder, file)));
        }
        else {
            // If matchAny is false or not provided, check if all files exist
            allFilesExist = requiredFiles.every((file) => fs.existsSync(path.join(rootFolder, file)));
        }
        if (allFilesExist) {
            vscode.window.showInformationMessage(`This is a ${projectType} project.`);
            return;
        }
    }
    vscode.window.showInformationMessage('Unknown project type.');
}
//# sourceMappingURL=projectDetector.js.map