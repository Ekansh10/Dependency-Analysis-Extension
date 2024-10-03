// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { projectDetector } from './projectTypes/projectDetector';


export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "dependency-analysis" is now active!');

	
	const disposable = vscode.commands.registerCommand('dependency-analysis.dependency-analysis', async () => {
		
		// vscode.window.showInformationMessage('Hello from Dependency Analysis!');

		const selectedFolder= await vscode.window.showOpenDialog({
			canSelectFiles:false,
			canSelectFolders:true,
			canSelectMany:false,
			openLabel:'Select Folder'
		});

		if(!selectedFolder || selectedFolder.length==0){
			vscode.window.showErrorMessage('No folder selected');
			return;
		}

		const rootFolder=selectedFolder[0].fsPath;
		vscode.window.showInformationMessage(`selected folder: ${rootFolder}`);
		

		projectDetector(rootFolder);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
