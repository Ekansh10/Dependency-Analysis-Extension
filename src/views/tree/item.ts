import * as vscode from 'vscode';
import { Element } from './tokens/root';
import { formatName } from './classStructure';


export class ElementItem extends vscode.TreeItem {
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