import * as vscode from 'vscode';
import { registerWebViewProvider } from './views/register-sidebar';
import { selectRootFolder } from './projectTypes/selectFolder';

export function activate(context: vscode.ExtensionContext) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
    
    // Register the web view provider
    registerWebViewProvider(context, op);

    // Register the command that will be called from the webview
    const startCommand = vscode.commands.registerCommand('selectRootProject', async (flag: boolean) => {
        if (flag) {
            // Implement your logic here when the start button is clicked
            console.log('Start action logic implemented.');
            // Call the function to select the root folder
            await selectRootFolder();
        }
    });

    // Add the command to context subscriptions for proper cleanup
    context.subscriptions.push(startCommand);
}

export function deactivate() {
    // Cleanup if necessary
}
