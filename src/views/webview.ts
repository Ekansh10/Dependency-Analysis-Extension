import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function showWebview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'webview',
        'WebView Page',
        vscode.ViewColumn.One,
        {
            enableScripts: true // Enable scripts to run in the webview
        }
    );

    // Get the path to the webview.html file
    const htmlFilePath = path.join(context.extensionPath, 'media', 'html', 'webview.html');

    // Read the HTML content from the file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    // Set the HTML content to the webview
    panel.webview.html = htmlContent;
}
