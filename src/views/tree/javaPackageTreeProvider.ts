import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Element, Field, Method, Root } from './tokens/root';

export class JavaPackageTreeProvider implements vscode.TreeDataProvider<JavaElement> {
    constructor(private workspaceRoot: string) {}
    
    onDidChangeTreeData?: vscode.Event<void | JavaElement | JavaElement[] | null | undefined> | undefined;
    
    getTreeItem(element: JavaElement): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    getChildren(element?: JavaElement | undefined): vscode.ProviderResult<JavaElement[]> {
        if(!this.workspaceRoot) {
            vscode.window.showErrorMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if(element) {
            return Promise.resolve(
                this.getDepsInPackageJson(
                    path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
                )
            );
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
            if(this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
            } else {
                vscode.window.showErrorMessage('Workspace has no package.json');
                return Promise.resolve([]);
            }
        }
    }

    private getDepsInPackageJson(packageJsonPath: string): JavaElement[] {
        if(this.pathExists(packageJsonPath)) {
            const toDep = (moduleName: string, version: string) : JavaElement => {
                if(this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    return new JavaElement(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
                } else {
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
        } else {
            return [];
        }
    }

    private pathExists(p: string) : boolean {
        try {
            fs.accessSync(p);
        } catch(err) {
            return false;
        }
        return true;
    }

}

class JavaElement extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }
}