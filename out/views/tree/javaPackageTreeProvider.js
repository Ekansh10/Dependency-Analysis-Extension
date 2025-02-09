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
exports.JavaPackageTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JavaPackageTreeProvider {
    workspaceRoot;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    onDidChangeTreeData;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.workspaceRoot) {
            vscode.window.showErrorMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }
        if (element) {
            return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
        }
        else {
            const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
            }
            else {
                vscode.window.showErrorMessage('Workspace has no package.json');
                return Promise.resolve([]);
            }
        }
    }
    getDepsInPackageJson(packageJsonPath) {
        if (this.pathExists(packageJsonPath)) {
            const toDep = (moduleName, version) => {
                if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    return new JavaElement(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
                }
                else {
                    return new JavaElement(moduleName, version, vscode.TreeItemCollapsibleState.None);
                }
            };
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const deps = packageJson.dependencies ?
                Object.keys(packageJson.dependencies).map((dep => toDep(dep, packageJson.dependencies[dep])))
                : [];
            const devDeps = packageJson.devDependencies ?
                Object.keys(packageJson.devDependencies).map((dep) => toDep(dep, packageJson.devDependencies[dep]))
                : [];
            return deps.concat(devDeps);
        }
        else {
            return [];
        }
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.JavaPackageTreeProvider = JavaPackageTreeProvider;
class JavaElement extends vscode.TreeItem {
    label;
    version;
    collapsibleState;
    constructor(label, version, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }
}
//# sourceMappingURL=javaPackageTreeProvider.js.map