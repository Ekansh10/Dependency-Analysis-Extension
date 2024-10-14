import * as vscode from 'vscode';
import { registerWebViewProvider } from './views/register-sidebar';
import { selectRootFolder } from './projectTypes/selectFolder';
import { showWebview } from './views/webview';

export function activate(context: vscode.ExtensionContext) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');

    registerWebViewProvider(context, op);
   
    const startCommand = vscode.commands.registerCommand('selectRootProject', async (flag: boolean) => {
        if (flag) {
            console.log('Start action logic implemented.');
            await selectRootFolder();
            showWebview();
        }
    });

    // Add the command to context subscriptions for proper cleanup
    context.subscriptions.push(startCommand);
}

export function deactivate() {
    // Cleanup if necessary
}
