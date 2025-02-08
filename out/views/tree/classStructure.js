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
exports.formatName = exports.ClassStructureProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
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
//# sourceMappingURL=classStructure.js.map