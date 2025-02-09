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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = showGraph;
const vscode = __importStar(require("vscode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const listClasses_1 = __importDefault(require("./listClasses"));
const mermaid_1 = __importDefault(require("./mermaid"));
async function showGraph(context, item) {
    const panel = vscode.window.createWebviewPanel('classDiagram', 'Class Diagram', vscode.ViewColumn.One, { enableScripts: true });
    const workspace = vscode.workspace.workspaceFolders;
    let rootPath = '.';
    if (workspace && workspace.length > 0) {
        rootPath = workspace[0].uri.fsPath;
    }
    const filePath = path_1.default.join(rootPath, '.vscode', 'dependencies.json');
    const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    const itemsList = (0, listClasses_1.default)(jsonData);
    console.log(`itemslist ${itemsList}`);
    const mermaidGraph = await (0, mermaid_1.default)(item, itemsList);
    const htmlFilePath = path_1.default.join(context.extensionPath, 'media', 'html', 'webview.html');
    let htmlContent = fs_1.default.readFileSync(htmlFilePath, 'utf8');
    htmlContent = htmlContent.replace('DIAGRAM_PLACEHOLDER', 'classDiagram\n' + mermaidGraph);
    console.log(htmlContent);
    panel.webview.html = htmlContent;
}
//# sourceMappingURL=showGraph.js.map