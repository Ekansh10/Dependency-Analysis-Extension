import * as vscode from 'vscode';
import { registerWebViewProvider } from './views/register-sidebar';
import { selectRootFolder } from './projectTypes/selectFolder';
import { showWebview } from './views/webview';
import { startLocalServer } from './server';

export function activate(context: vscode.ExtensionContext) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');

    registerWebViewProvider(context, op);
   
    // Command for selecting the root project
    const startCommand = vscode.commands.registerCommand('selectRootProject', async (flag: boolean) => {
        if (flag) {
            console.log('Start action logic implemented.');
            await selectRootFolder();
        }
    

    // Command to show the webview
    
        showWebview(context); 
    

    // Command to start the local server
    const startServerCommand = vscode.commands.registerCommand('startLocalServer', () => {
        startLocalServer(5000); 
    });

    // Add commands to the subscriptions
    context.subscriptions.push(startCommand, startServerCommand);});
}

export function deactivate() {
    // Cleanup if necessary
}
