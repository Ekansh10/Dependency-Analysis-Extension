"use strict";
// src/webviewPanel.ts
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
exports.createWebviewPanel = createWebviewPanel;
exports.getWebviewContent = getWebviewContent;
const vscode = __importStar(require("vscode"));
const selectFolder_1 = require("./selectFolder");
function createWebviewPanel(context) {
    const panel = vscode.window.createWebviewPanel('projectDetector', 'Project Detector', // Title of the panel
    vscode.ViewColumn.One, {
        enableScripts: true, // Enable JS in the webview
        localResourceRoots: [vscode.Uri.file(context.extensionPath)] // Restrict access to local resources
    });
    panel.webview.html = getWebviewContent();
    panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'dependency-analysis') {
            (0, selectFolder_1.selectRootFolder)();
        }
        else if (message.command === 'log') {
            console.log(message.message);
        }
    }, undefined, context.subscriptions);
}
function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Detector</title>
        </head>
        <body>
            <h1>Project Detector</h1>
            <button id="actionButton">Click Me</button>

            <script>
                const vscode = acquireVsCodeApi();

                document.getElementById('actionButton').addEventListener('click', () => {
                    vscode.postMessage({ command: 'buttonClicked' });
                });
            </script>
        </body>
        </html>
    `;
}
//# sourceMappingURL=webViewPanel.js.map