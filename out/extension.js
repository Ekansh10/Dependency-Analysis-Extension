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
function activate(context) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
    // Register the web view provider
    (0, register_sidebar_1.registerWebViewProvider)(context, op);
    // Register the command that will be called from the webview
    const startCommand = vscode.commands.registerCommand('selectRootProject', async (flag) => {
        if (flag) {
            // Implement your logic here when the start button is clicked
            console.log('Start action logic implemented.');
            // Call the function to select the root folder
            await (0, selectFolder_1.selectRootFolder)();
        }
    });
    // Add the command to context subscriptions for proper cleanup
    context.subscriptions.push(startCommand);
}
function deactivate() {
    // Cleanup if necessary
}
//# sourceMappingURL=extension.js.map