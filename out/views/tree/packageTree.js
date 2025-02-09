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
exports.PackageTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const classStructure_1 = require("./classStructure");
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
//# sourceMappingURL=packageTree.js.map