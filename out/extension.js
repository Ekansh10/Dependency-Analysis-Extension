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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const register_sidebar_1 = require("./views/register-sidebar");
const selectFolder_1 = require("./projectTypes/selectFolder");
const webview_1 = require("./views/webview");
const server_1 = require("./server");
function activate(context) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
    (0, register_sidebar_1.registerWebViewProvider)(context, op);
    // Command for selecting the root project
    const startCommand = vscode.commands.registerCommand('selectRootProject', async (flag) => {
        if (flag) {
            console.log('Start action logic implemented.');
            await (0, selectFolder_1.selectRootFolder)();
        }
        // Command to show the webview
        (0, webview_1.showWebview)(context);
        // Command to start the local server
        const startServerCommand = vscode.commands.registerCommand('startLocalServer', () => {
            (0, server_1.startLocalServer)(5000);
        });
        // Add commands to the subscriptions
        context.subscriptions.push(startCommand, startServerCommand);
    });
}
function deactivate() {
    // Cleanup if necessary
}
//# sourceMappingURL=extension.js.map