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
exports.selectRootFolder = selectRootFolder;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const projectDetector_1 = require("./projectTypes/projectDetector");
async function selectRootFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let rootFolder;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        const selectedFolder = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Folder'
        });
        if (!selectedFolder || selectedFolder.length === 0) {
            vscode.window.showErrorMessage('No folder selected');
            return;
        }
        rootFolder = selectedFolder[0].fsPath;
        vscode.window.showInformationMessage(`Selected folder: ${rootFolder}`);
    }
    else {
        rootFolder = workspaceFolders[0].uri.fsPath;
        vscode.window.showInformationMessage(`Using workspace folder: ${rootFolder}`);
    }
    console.log('Root folder:', rootFolder);
    const configPath = path.join(__dirname, '..', 'src', 'projectConfig.json');
    if (!fs.existsSync(configPath)) {
        vscode.window.showErrorMessage('Project configuration file not found.');
        return;
    }
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const projectConfig = JSON.parse(configContent);
    (0, projectDetector_1.projectDetector)(rootFolder, projectConfig);
}
//# sourceMappingURL=selectFolder.js.map