import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Element, Field, Method, Root } from './tokens/root';
export class ClassStructureProvider implements vscode.TreeDataProvider<StructureTreeItem<Field | Method>> {
    private _onDidChangeTreeData: vscode.EventEmitter<StructureTreeItem<Field | Method> | undefined | void>  = new vscode.EventEmitter<StructureTreeItem<Field|Method> | undefined | void>();
    
    constructor(
    ) {
        
    }

    private currentElement: Element | undefined;

    public refresh(element: Element | undefined): void {
        this.currentElement = element;
        this._onDidChangeTreeData.fire();
    }
    
    onDidChangeTreeData?: vscode.Event<void | StructureTreeItem<Field | Method> | StructureTreeItem<Field | Method>[] | null | undefined> | undefined = this._onDidChangeTreeData.event;
    
    
    getTreeItem(element: StructureTreeItem<Field | Method>): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    
    getChildren(element?: StructureTreeItem<Field | Method> | undefined): vscode.ProviderResult<StructureTreeItem<Field | Method>[]> {
        if(!this.currentElement) {
            return Promise.resolve([]);
        }

        if(!element) {
            const fields = this.currentElement.fields.map(field => 
                new StructureTreeItem<Field>(field, this.currentElement?.sourceFile!, this.currentElement?.name!, vscode.TreeItemCollapsibleState.None, 'field')
            );

            const methods = this.currentElement.methods.map(method => (
                new StructureTreeItem<Method>(method, this.currentElement?.sourceFile!, this.currentElement?.name!, vscode.TreeItemCollapsibleState.None, 'method')
            ));

            return Promise.resolve([...fields, ...methods]);
        } else {
            return Promise.resolve([]);
        }
    }
    
    
}





class StructureTreeItem<T> extends vscode.TreeItem {
    constructor(
        public readonly item: T,
        public readonly sourceFile: string,
        public readonly className: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'field' | 'method'
    ) {
        super(StructureTreeItem.getLabel(className, item, type), collapsibleState);
        this.tooltip = StructureTreeItem.getTooltip(item, type);
        this.iconPath = StructureTreeItem.getIconPath(item, type);

        this.command = {
            command: 'extension.navigateToDeclaration',
            title: 'Navigate to Declaration',
            arguments: [sourceFile, item, className]
        };
    }

    public static getLabel<T>(className: string, item: T, type: 'field' | 'method') : string {
        if(type === 'field') {
            const field = item as Field;
            return `${field.name}: ${formatName(field.type)}`;
        } else {
            const method = item as Method;

            let name: string;
            if(method.name === '<init>') {
                name = className.substring(className.lastIndexOf('.')+1);
            } else {
                name = method.name;
            }


            return `${name}(${method.parameters.join(', ')}): ${formatName(method.returnType)}`;
        }
    }

    public static getTooltip<T>(item: T, type: 'field' | 'method') : string {
        if (type === 'field') {
            const field = item as Field;
            return `${field.modifier} ${field.type} ${field.name}`;
        } else {
            const method = item as Method;
            return `${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters.join(', ')})`;
        }
    }

    public static getIconPath<T>(item: T, type: 'field' | 'method'): { light: string; dark: string } {
        const iconsFolderPath = path.join(__filename, '..', '..', 'resources', 'icons');
        let iconName = '';

        if (type === 'field') {
            const field = item as Field;
            iconName = field.static ? 'staticField' : 'field';
            iconName = field.final ? `${iconName}Final` : iconName;
        } else {
            const method = item as Method;
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

export const formatName = (str: string) : string => {
    if(str.startsWith('.')) {
        return str.substring(1);
    }

    if(str.indexOf('.') !== -1) {

        if(str.indexOf('<') !== -1) {
            let firstPart = str.substring(0, str.indexOf('<'));
            let genericPart = str.substring(str.indexOf('<')+1, str.indexOf('>'));

            let parts: string[] = firstPart.split('.');
            firstPart = parts[parts.length-1];
            parts = genericPart.split('.');
            genericPart = parts[parts.length-1];

            return firstPart + '<' + genericPart + '>';
        }

        const parts: string[] = str.split('.');
        return parts[parts.length - 1];
    }

    return str;
    
};