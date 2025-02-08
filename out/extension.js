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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const selectFolder_1 = require("./projectTypes/selectFolder");
const javaParser_1 = require("./parser/javaParser");
const classStructure_1 = require("./views/tree/classStructure");
const packageTree_1 = require("./views/tree/packageTree");
const showGraph_1 = __importDefault(require("./graphGeneration/showGraph"));
function activate(context) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
    console.log("Welcome to my extension");
    const structureProvider = new classStructure_1.ClassStructureProvider();
    const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : '.';
    const packageTreeProvider = new packageTree_1.PackageTreeProvider('./dependencies.json', rootPath);
    vscode.window.registerTreeDataProvider('dependencyView', packageTreeProvider);
    vscode.window.registerTreeDataProvider('classStructure', structureProvider);
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder to use this extension.');
        return;
    }
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const dependenciesPath = path.join(workspaceRoot, '.vscode', 'dependencies.json');
    context.subscriptions.push(vscode.commands.registerCommand('startProject', async () => {
        console.log("project started");
        if (!fs.existsSync(dependenciesPath)) {
            vscode.window.showInformationMessage('dependencies.json not found. Running the extension logic...');
            (0, selectFolder_1.selectRootFolder)();
        }
        else {
            vscode.window.showInformationMessage('dependencies.json exists.');
        }
    }));
    vscode.commands.executeCommand('startProject');
    const fileWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
        vscode.commands.executeCommand('extension.runParser', workspaceRoot);
        vscode.commands.executeCommand('extension.refreshPackageTree');
    });
    context.subscriptions.push(fileWatcher);
    context.subscriptions.push(vscode.commands.registerCommand('extension.runParser', async (workspaceFolder, type) => {
        await (0, javaParser_1.runJavaParser)(workspaceFolder, type);
        return Promise.resolve();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refreshStructure', (element) => {
        structureProvider.refresh(element);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refreshPackageTree', () => {
        console.log("refreshin package tree");
        packageTreeProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.showClassStructure', (element) => {
        vscode.commands.executeCommand('extension.refreshStructure', element);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.navigateToDeclaration', async (sourceFile, element, className) => {
        if (!element || !sourceFile) {
            vscode.window.showErrorMessage('Source file not found');
            return;
        }
        const files = await vscode.workspace.findFiles(`**/${sourceFile}`);
        if (files.length === 0) {
            vscode.window.showErrorMessage('file not found in workspace');
            return;
        }
        const document = await vscode.workspace.openTextDocument(files[0]);
        const editor = await vscode.window.showTextDocument(document);
        const text = document.getText();
        const name = element.name === '<init>' ? className.substring(className.lastIndexOf('.') + 1) : element.name;
        const index = text.indexOf(name);
        if (index === -1) {
            vscode.window.showErrorMessage('Declaration not found for ' + name + ' in sourcefile: ' + sourceFile);
            return;
        }
        const startPosition = document.positionAt(index);
        const endPosition = document.positionAt(index + element.name.length);
        const range = new vscode.Range(startPosition, endPosition);
        editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        editor.selection = new vscode.Selection(startPosition, endPosition);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateGraph', async (item) => {
        (0, showGraph_1.default)(context, item);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.showGraphStructure', (item) => {
        console.log("generating graph");
        vscode.commands.executeCommand('extension.showClassStructure', item);
        vscode.commands.executeCommand('extension.generateGraph', item);
    }));
}
function deactivate() {
}
//# sourceMappingURL=extension.js.map