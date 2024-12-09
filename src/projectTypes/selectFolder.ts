import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { projectDetector } from './projectDetector';

export async function selectRootFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let rootFolder: string | undefined;

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
    } else {
        rootFolder = workspaceFolders[0].uri.fsPath;
        vscode.window.showInformationMessage(`Using workspace folder: ${rootFolder}`);
    }

    const configPath = path.join(__dirname, '..', 'src', 'projectTypes', 'projectConfig.json');
    if (!fs.existsSync(configPath)) {
        vscode.window.showErrorMessage('Project configuration file not found.');
        return;
    }

    const configContent = fs.readFileSync(configPath, 'utf-8');
    const projectConfig = JSON.parse(configContent);
    projectDetector(rootFolder, projectConfig);
}
