/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const selectFolder_1 = __webpack_require__(2);
const javaParser_1 = __webpack_require__(6);
const register_sidebar_1 = __webpack_require__(8);
const classStructure_1 = __webpack_require__(9);
const packageTree_1 = __webpack_require__(10);
const showGraph_1 = __importDefault(__webpack_require__(11));
function activate(context) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
    console.log("Welcome to my extension");
    (0, register_sidebar_1.registerWebViewProvider)(context, op);
    const structureProvider = new classStructure_1.ClassStructureProvider();
    const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : '.';
    const packageTreeProvider = new packageTree_1.PackageTreeProvider('./dependencies.json', rootPath);
    vscode.window.registerTreeDataProvider('dependencyView', packageTreeProvider);
    vscode.window.registerTreeDataProvider('classStructure', structureProvider);
    context.subscriptions.push(vscode.commands.registerCommand('selectRootProject', async (buttonClickedFlag) => {
        console.log("project started");
        if (buttonClickedFlag) {
            await (0, selectFolder_1.selectRootFolder)();
        }
    }));
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


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selectRootFolder = selectRootFolder;
const vscode = __importStar(__webpack_require__(1));
const fs = __importStar(__webpack_require__(3));
const path = __importStar(__webpack_require__(4));
const projectDetector_1 = __webpack_require__(5);
async function selectRootFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let rootFolder;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        const selectedFolder = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Folder'
        });
        if (!selectedFolder || selectedFolder.length === 0) {
            vscode.window.showErrorMessage('No folder selected');
            return;
        }
        rootFolder = selectedFolder[0].fsPath;
        vscode.window.showInformationMessage(`Selected folder: ${rootFolder}`);
    }
    else {
        rootFolder = workspaceFolders[0].uri.fsPath;
        vscode.window.showInformationMessage(`Using workspace folder: ${rootFolder}`);
    }
    const configPath = path.join(__dirname, '..', 'src', 'projectTypes', 'projectConfig.json');
    if (!fs.existsSync(configPath)) {
        vscode.window.showErrorMessage('Project configuration file not found.');
        return;
    }
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const projectConfig = JSON.parse(configContent);
    (0, projectDetector_1.projectDetector)(rootFolder, projectConfig);
}


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.projectDetector = projectDetector;
const fs = __importStar(__webpack_require__(3));
const path = __importStar(__webpack_require__(4));
const vscode = __importStar(__webpack_require__(1));
function projectDetector(rootFolder, projectConfig) {
    console.log("Project detector called");
    let detected = false;
    for (const [projectType, { requiredFiles, matchAny }] of Object.entries(projectConfig)) {
        if (detected) {
            break;
        }
        let allFilesExist = false;
        if (matchAny) {
            allFilesExist = requiredFiles.some((file) => fs.existsSync(path.join(rootFolder, file)));
        }
        else {
            allFilesExist = requiredFiles.every((file) => fs.existsSync(path.join(rootFolder, file)));
        }
        if (allFilesExist) {
            // vscode.window.showInformationMessage(`This is a ${projectType} project.`);
            detected = true;
            vscode.commands.executeCommand('extension.runParser', rootFolder, projectType)
                .then(() => {
                console.log("HELO WORLD");
                vscode.window.showInformationMessage(`Parser executed successfully for ${projectType} project.`);
                vscode.commands.executeCommand('extension.refreshPackageTree');
            });
        }
    }
}


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runJavaParser = runJavaParser;
const vscode = __importStar(__webpack_require__(1));
const cp = __importStar(__webpack_require__(7));
const path = __importStar(__webpack_require__(4));
const fs = __importStar(__webpack_require__(3));
// import { generateMappings } from '../graphGeneration/mappingsGeneration/mappingGenerator';
// This function runs the Java parser
async function runJavaParser(workspaceFolder, type) {
    try {
        const javaFilePath = path.join(__dirname, '..', 'src', 'parser', 'java', 'Java-parser.jar');
        const outputFileDir = path.join(workspaceFolder, '.vscode');
        const outputFilePath = path.join(outputFileDir, 'dependencies.json');
        // Check and delete the existing output file if it exists
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        if (type === "Android") {
            workspaceFolder = path.join(workspaceFolder, 'app');
        }
        console.log(workspaceFolder);
        const configPath = path.join(__dirname, '..', 'src', 'projectTypes', 'projectConfig.json');
        console.log(`Config path from javaparser ${configPath}`);
        if (!fs.existsSync(configPath)) {
            vscode.window.showErrorMessage('Project configuration file not found.');
            return;
        }
        console.log("javaFilePath: ", javaFilePath);
        console.log("outputFileDir: ", outputFileDir);
        const command = `java -jar "${javaFilePath}" "${workspaceFolder}" "${outputFilePath}"`;
        const options = { cwd: outputFileDir };
        if (!fs.existsSync(outputFileDir)) {
            fs.mkdirSync(outputFileDir);
        }
        vscode.window.showInformationMessage(`Running Java parser on folder: ${workspaceFolder}`);
        // Convert cp.exec to Promise-based execution
        await new Promise((resolve, reject) => {
            cp.exec(command, options, (error, stdout, stderr) => {
                console.log("Inside exec");
                if (error) {
                    console.log("Error: ", error);
                    vscode.window.showErrorMessage(`Error running Java parser: ${error.message}`);
                    reject(error);
                    return;
                }
                console.log("Mid way through if");
                if (stderr) {
                    console.log("stderr: ", stderr);
                    vscode.window.showErrorMessage(`Java parser error: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }
                console.log("Completed last if");
                vscode.window.showInformationMessage(`Java parser output: ${stdout}`);
                vscode.window.showInformationMessage(`JSON file generated at: ${outputFilePath}`);
                console.log("Completed execution");
                resolve();
            });
        });
        console.log("Parsing done");
    }
    catch (error) {
        console.error("Error in runJavaParser:", error);
        vscode.window.showErrorMessage(`Failed to run Java parser: ${error}`);
        throw error; // Re-throw if you want calling code to handle the error
    }
}


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SidebarWebViewProvider = void 0;
exports.registerWebViewProvider = registerWebViewProvider;
const vscode_1 = __webpack_require__(1);
function registerWebViewProvider(context, op) {
    const provider = new SidebarWebViewProvider(context.extensionUri, context);
    context.subscriptions.push(vscode_1.window.registerWebviewViewProvider("dependencies-sidebar-panel", provider));
    return provider; // Return the provider to access later
}
class SidebarWebViewProvider {
    _extensionUri;
    extensionContext;
    constructor(_extensionUri, extensionContext) {
        this._extensionUri = _extensionUri;
        this.extensionContext = extensionContext;
    }
    view; // Keep a reference to the active webview view
    resolveWebviewView(webviewView, webViewContext, token) {
        this.view = webviewView; // Store the reference when resolved
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "start-btn": {
                    console.log("Button clicked - Start button action initiated");
                    await vscode_1.commands.executeCommand("selectRootProject", true);
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        const styleResetUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "css", "reset.css"));
        const scriptUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "js", "startbutton.js"));
        const styleVSCodeUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "css", "vscode.css"));
        return `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Security-Policy" content="
                default-src 'none';
                img-src ${webview.cspSource} https:;
                script-src 'unsafe-inline' ${webview.cspSource};
                style-src ${webview.cspSource} 'unsafe-inline';">
              <link href="${styleResetUri}" rel="stylesheet">
              <link href="${styleVSCodeUri}" rel="stylesheet">
           </head>
           <body>
              <div>Action buttons:</div>
              <button type="button" class="start-btn">Start</button>
              <div id="tree-container"></div>
              <script src="${scriptUri}"></script>
           </body>
        </html>`;
    }
}
exports.SidebarWebViewProvider = SidebarWebViewProvider;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatName = exports.ClassStructureProvider = void 0;
const vscode = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(4));
class ClassStructureProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    constructor() {
    }
    currentElement;
    refresh(element) {
        this.currentElement = element;
        this._onDidChangeTreeData.fire();
    }
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.currentElement) {
            return Promise.resolve([]);
        }
        if (!element) {
            const fields = this.currentElement.fields.map(field => new StructureTreeItem(field, this.currentElement?.sourceFile, this.currentElement?.name, vscode.TreeItemCollapsibleState.None, 'field'));
            const methods = this.currentElement.methods.map(method => (new StructureTreeItem(method, this.currentElement?.sourceFile, this.currentElement?.name, vscode.TreeItemCollapsibleState.None, 'method')));
            return Promise.resolve([...fields, ...methods]);
        }
        else {
            return Promise.resolve([]);
        }
    }
}
exports.ClassStructureProvider = ClassStructureProvider;
class StructureTreeItem extends vscode.TreeItem {
    item;
    sourceFile;
    className;
    collapsibleState;
    type;
    constructor(item, sourceFile, className, collapsibleState, type) {
        super(StructureTreeItem.getLabel(className, item, type), collapsibleState);
        this.item = item;
        this.sourceFile = sourceFile;
        this.className = className;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.tooltip = StructureTreeItem.getTooltip(item, type);
        this.iconPath = StructureTreeItem.getIconPath(item, type);
        this.command = {
            command: 'extension.navigateToDeclaration',
            title: 'Navigate to Declaration',
            arguments: [sourceFile, item, className]
        };
    }
    static getLabel(className, item, type) {
        if (type === 'field') {
            const field = item;
            return `${field.name}: ${(0, exports.formatName)(field.type)}`;
        }
        else {
            const method = item;
            let name;
            if (method.name === '<init>') {
                name = className.substring(className.lastIndexOf('.') + 1);
            }
            else {
                name = method.name;
            }
            return `${name}(${method.parameters.join(', ')}): ${(0, exports.formatName)(method.returnType)}`;
        }
    }
    static getTooltip(item, type) {
        if (type === 'field') {
            const field = item;
            return `${field.modifier} ${field.type} ${field.name}`;
        }
        else {
            const method = item;
            return `${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters.join(', ')})`;
        }
    }
    static getIconPath(item, type) {
        const iconsFolderPath = path.join(__filename, '..', '..', 'resources', 'icons');
        let iconName = '';
        if (type === 'field') {
            const field = item;
            iconName = field.static ? 'staticField' : 'field';
            iconName = field.final ? `${iconName}Final` : iconName;
        }
        else {
            const method = item;
            iconName = method.static ? 'staticMethod' : 'method';
            iconName = method.abstract ? `${iconName}Abstract` : iconName;
            iconName = method.final ? `${iconName}Final` : iconName;
        }
        return {
            light: path.join(iconsFolderPath, 'light', `${iconName}.svg`),
            dark: path.join(iconsFolderPath, 'dark', `${iconName}.svg`)
        };
    }
}
const formatName = (str) => {
    if (str.startsWith('.')) {
        return str.substring(1);
    }
    if (str.indexOf('.') !== -1) {
        if (str.indexOf('<') !== -1) {
            let firstPart = str.substring(0, str.indexOf('<'));
            let genericPart = str.substring(str.indexOf('<') + 1, str.indexOf('>'));
            let parts = firstPart.split('.');
            firstPart = parts[parts.length - 1];
            parts = genericPart.split('.');
            genericPart = parts[parts.length - 1];
            return firstPart + '<' + genericPart + '>';
        }
        const parts = str.split('.');
        return parts[parts.length - 1];
    }
    return str;
};
exports.formatName = formatName;


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PackageTreeProvider = void 0;
const vscode = __importStar(__webpack_require__(1));
const fs = __importStar(__webpack_require__(3));
const path = __importStar(__webpack_require__(4));
const classStructure_1 = __webpack_require__(9);
class PackageTreeProvider {
    workSpaceRoot;
    _onDidChangeTreeData = new vscode.EventEmitter();
    jsonPath;
    constructor(jsonPath, workSpaceRoot) {
        this.workSpaceRoot = workSpaceRoot;
        this.jsonPath = jsonPath;
    }
    ;
    currentElement;
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        const dirPath = path.join(this.workSpaceRoot, '.vscode');
        const filePath = path.join(this.workSpaceRoot, '.vscode', 'dependencies.json');
        vscode.window.showInformationMessage(filePath);
        const root = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        vscode.window.showInformationMessage("Root Generated");
        console.log(root);
        if (!element) {
            return Promise.resolve([new ElementItem(root.name, root, vscode.TreeItemCollapsibleState.Collapsed)]);
        }
        else {
            return Promise.resolve(element.getChildren());
        }
    }
}
exports.PackageTreeProvider = PackageTreeProvider;
class ElementItem extends vscode.TreeItem {
    label;
    element;
    collapsibleState;
    constructor(label, element, collapsibleState) {
        super(element.name, collapsibleState);
        this.label = label;
        this.element = element;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.element.name}`;
        this.description = element.class ? 'Class' : 'Package';
        if (element.class) {
            this.command = {
                command: 'extension.showGraphStructure',
                title: 'Show Graph Structure',
                arguments: [element]
            };
        }
    }
    getChildren() {
        return this.element.elements.map((elem) => new ElementItem((0, classStructure_1.formatName)(elem.name), elem, elem.elements.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None));
    }
}


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = showGraph;
const vscode = __importStar(__webpack_require__(1));
const fs_1 = __importDefault(__webpack_require__(3));
const path_1 = __importDefault(__webpack_require__(4));
const listClasses_1 = __importDefault(__webpack_require__(12));
const mermaid_1 = __importDefault(__webpack_require__(13));
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


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = findElementsWithClassName;
// Function to recursively return elements with the index `className`
function findElementsWithClassName(element) {
    let classNameList = [];
    if (element.class && element.name) {
        classNameList.push(element);
    }
    if (element.elements) {
        for (const childElement of element.elements) {
            const elements = findElementsWithClassName(childElement);
            for (const elem of elements) {
                classNameList.push(elem);
            }
        }
    }
    return classNameList;
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = generateClassDiagram;
function generateClassDiagram(initialClass, itemsList) {
    let diagram = '';
    const processedClasses = new Set();
    const processedRelations = new Set();
    const classQueue = [initialClass];
    // Process all classes first
    while (classQueue.length > 0) {
        const classData = classQueue.shift();
        const className = cleanClassName(classData.name);
        // Skip if already processed
        if (processedClasses.has(className)) {
            continue;
        }
        processedClasses.add(className);
        // Generate class definition
        diagram += generateClassDefinition(classData);
        // Add dependencies to queue
        if (classData.outGoingDependencies) {
            for (const dep of classData.outGoingDependencies) {
                const item = itemsList.find((ele) => ele.name === dep);
                if (!dep.includes('$') && !dep.includes('lambda') && item && !processedClasses.has(cleanClassName(dep))) {
                    classQueue.push(item);
                }
            }
        }
    }
    // Process all relationships after classes are defined
    processedClasses.clear(); // Reset for relationship processing
    const relationshipQueue = [initialClass];
    while (relationshipQueue.length > 0) {
        const classData = relationshipQueue.shift();
        const className = cleanClassName(classData.name);
        if (processedClasses.has(className)) {
            continue;
        }
        processedClasses.add(className);
        // Add relationships
        diagram += generateRelationships(classData, itemsList, processedRelations);
        // Add dependencies to queue
        if (classData.outGoingDependencies) {
            for (const dep of classData.outGoingDependencies) {
                const item = itemsList.find((ele) => ele.name === dep);
                if (!dep.includes('$') && !dep.includes('lambda') && item && !processedClasses.has(cleanClassName(dep))) {
                    relationshipQueue.push(item);
                }
            }
        }
    }
    return diagram;
}
function generateClassDefinition(classData) {
    let definition = '';
    const className = cleanClassName(classData.name);
    definition += `    class ${className} {\n`;
    const stereotypes = [];
    if (classData.abstract)
        stereotypes.push('abstract');
    else if (classData.interface)
        stereotypes.push('interface');
    else if (classData.abstract && classData.interface)
        stereotypes.push('abstract');
    if (stereotypes.length > 0) {
        definition += `       <<«${stereotypes}»>>\n`;
    }
    // Fields
    classData.fields.forEach(field => {
        const modifier = formatAccessModifier(field.modifier.toLowerCase());
        const fieldType = cleanTypeName(field.type);
        const staticModifier = field.static ? 'static ' : '';
        const finalModifier = field.final ? 'final ' : '';
        definition += `        ${modifier}${staticModifier}${finalModifier}${fieldType} ${field.name}\n`;
    });
    // Constructors
    const constructors = classData.methods.filter(method => method.name === '<init>' || method.name === '<clinit>');
    constructors.forEach(constructor => {
        const modifier = formatAccessModifier(constructor.accessModifier.toLowerCase());
        definition += `        ${modifier}${className}(${formatParameters(constructor.parameters)})\n`;
    });
    // Methods
    const regularMethods = classData.methods.filter(method => method.name !== '<init>' && method.name !== '<clinit>');
    regularMethods.forEach(method => {
        const modifier = formatAccessModifier(method.accessModifier.toLowerCase());
        const staticModifier = method.static ? 'static ' : '';
        const finalModifier = method.final ? 'final ' : '';
        const abstractModifier = method.abstract ? 'abstract ' : '';
        const returnType = cleanTypeName(method.returnType);
        definition += `        ${modifier}${staticModifier}${finalModifier}${abstractModifier}${returnType} ${method.name}(${formatParameters(method.parameters)})\n`;
    });
    definition += '    }\n';
    return definition;
}
function generateRelationships(classData, itemsList, processedRelations) {
    let relationships = '';
    const className = cleanClassName(classData.name);
    // Add inheritance/interface relationships
    if (classData.superClassName) {
        const superClasses = Array.isArray(classData.superClassName)
            ? classData.superClassName
            : [classData.superClassName];
        superClasses.forEach(superClass => {
            if (superClass && superClass !== 'java.lang.Object') {
                const superClassName = cleanClassName(superClass);
                const relation = `${superClassName} <|-- ${className}`;
                if (!processedRelations.has(relation)) {
                    relationships += `    ${relation}\n`;
                    processedRelations.add(relation);
                }
            }
        });
    }
    // Add interface implementations
    if (classData.interfaces && classData.interfaces.length > 0) {
        classData.interfaces.forEach(interfaceName => {
            const cleanInterfaceName = cleanClassName(interfaceName);
            const relation = `${cleanInterfaceName} <|.. ${className}`;
            if (!processedRelations.has(relation)) {
                relationships += `    ${relation}\n`;
                processedRelations.add(relation);
            }
        });
    }
    // Add dependencies
    if (classData.outGoingDependencies) {
        for (const dep of classData.outGoingDependencies) {
            const item = itemsList.find((ele) => ele.name === dep);
            if (!dep.includes('$') && !dep.includes('lambda') && item) {
                const relation = `${cleanClassName(dep)} *-- ${className}`;
                if (!processedRelations.has(relation)) {
                    relationships += `    ${relation}\n`;
                    processedRelations.add(relation);
                }
            }
        }
    }
    return relationships;
}
// Utility functions remain the same
function cleanClassName(fullName) {
    if (!fullName)
        return '';
    const parts = fullName.split('.');
    const rawName = parts[parts.length - 1];
    if (rawName.includes('$') && (rawName.includes('lambda') || /\$\d+$/.test(rawName))) {
        return parts[parts.length - 2];
    }
    return rawName.replace(/\$.*$/, '');
}
function cleanTypeName(type) {
    if (!type)
        return '';
    // Handle generic types properly
    if (type.includes('<')) {
        const baseType = type.split('<')[0].split('.').pop();
        const genericType = type.split('<')[1].split('>')[0].split('.').pop();
        return `${baseType}~${genericType}~`; // Mermaid syntax for generics
    }
    return type
        .split('.').pop()
        .replace(/\$.*$/, '');
}
function formatParameters(params) {
    return params
        .map(param => cleanTypeName(param))
        .join(', ');
}
function formatAccessModifier(modifier) {
    switch (modifier) {
        case 'public': return '+';
        case 'private': return '-';
        case 'protected': return '#';
        default: return '~';
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map