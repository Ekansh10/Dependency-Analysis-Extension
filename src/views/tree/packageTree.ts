import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Element, Field, Method, Root } from './tokens/root';
import { formatName } from './classStructure';
export class PackageTreeProvider implements vscode.TreeDataProvider<ElementItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ElementItem | undefined | void>();
    
    private jsonPath: string;

    constructor(
        jsonPath: string,
        private workSpaceRoot: string
    ) {
        this.jsonPath = jsonPath;
    };

    private currentElement: ElementItem | undefined;

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    onDidChangeTreeData?: vscode.Event<void | ElementItem | ElementItem[] | null | undefined> | undefined= this._onDidChangeTreeData.event;

    
    getTreeItem(element: ElementItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    getChildren(element?: ElementItem | undefined): vscode.ProviderResult<ElementItem[]> {
        const dirPath =  path.join(this.workSpaceRoot, '.vscode');
        const filePath = path.join(this.workSpaceRoot, '.vscode', 'dependencies.json');
     
        vscode.window.showInformationMessage(filePath);
        
        
        const root: Element = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Element;
        vscode.window.showInformationMessage("Root Generated");
        console.log(root);
        
        if(!element) {
            return Promise.resolve([new ElementItem(root.name, root, vscode.TreeItemCollapsibleState.Collapsed)]);
        } else {
            return Promise.resolve(element.getChildren());
        }

    }

    

}

class ElementItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly element: Element,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(element.name, collapsibleState);
        this.tooltip = `${this.element.name}`;
        this.description = element.class ? 'Class' : 'Package';

        if(element.class) {
            this.command = {
                command: 'extension.showGraphStructure',
                title: 'Show Graph Structure',
                arguments: [element]
            };
        }
    }

    public getChildren() : ElementItem[] {
        return this.element.elements.map((elem) => 
            new ElementItem(formatName(elem.name), elem, elem.elements.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None)
        );
    }
}