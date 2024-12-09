import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs'
import { selectRootFolder } from './projectTypes/selectFolder';
import { runJavaParser } from './parser/javaParser';
import { registerWebViewProvider } from './views/sidebar/register-sidebar';
import { JavaPackageTreeProvider } from './views/tree/javaPackageTreeProvider';
import { ClassStructureProvider } from './views/tree/classStructure';
import { PackageTreeProvider } from './views/tree/packageTree';
import { Element, Field, Method } from './views/tree/tokens/root';
import showGraph from './graphGeneration.ts/showGraph';
import { ElementItem } from './views/tree/item';

export function activate(context: vscode.ExtensionContext) {
    const op = vscode.window.createOutputChannel('Dependency Analysis');
   console.log("Welcome to my extension");

    registerWebViewProvider(context,op);

    const structureProvider = new ClassStructureProvider();
	const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : '.';
	const packageTreeProvider = new PackageTreeProvider('./dependencies.json',rootPath);
	vscode.window.registerTreeDataProvider('dependencyView', packageTreeProvider);
	vscode.window.registerTreeDataProvider('classStructure', structureProvider);
	
    
    context.subscriptions.push(
        vscode.commands.registerCommand('selectRootProject',async (buttonClickedFlag : boolean)=>{
			console.log("project started");
            if(buttonClickedFlag){
                await selectRootFolder();
            }
        })
    );

    context.subscriptions.push(vscode.commands.registerCommand('extension.runParser',async (workspaceFolder:string,type:string)=>{
        await runJavaParser(workspaceFolder,type);
		return Promise.resolve();
		
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.refreshStructure',(element:Element)=>{
        structureProvider.refresh(element);
    }));

	context.subscriptions.push(vscode.commands.registerCommand('extension.refreshPackageTree',()=>{
		console.log("refreshin package tree");
		packageTreeProvider.refresh();
	}));

    context.subscriptions.push(vscode.commands.registerCommand('extension.showClassStructure',(element)=>{
        vscode.commands.executeCommand('extension.refreshStructure',element)
    }));

    context.subscriptions.push(
		vscode.commands.registerCommand('extension.navigateToDeclaration', async (sourceFile: string, element: Field | Method, className: string) => {
			if(!element || !sourceFile) {
				vscode.window.showErrorMessage('Source file not found');
				return;
			}

			const files = await vscode.workspace.findFiles(`**/${sourceFile}`);

			if(files.length === 0) {
				vscode.window.showErrorMessage('file not found in workspace');
				return;
			}

			const document = await vscode.workspace.openTextDocument(files[0]);
			const editor = await vscode.window.showTextDocument(document);

			const text = document.getText();
			const name = element.name === '<init>' ? className.substring(className.lastIndexOf('.')+1): element.name;
			const index = text.indexOf(name);

			if(index === -1) {
				vscode.window.showErrorMessage('Declaration not found for ' + name + ' in sourcefile: '+ sourceFile);
				return;
			}

			const startPosition = document.positionAt(index);
			const endPosition = document.positionAt(index + element.name.length);
			const range = new vscode.Range(startPosition, endPosition);

			editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
			editor.selection = new vscode.Selection(startPosition, endPosition);
		})
	);

	context.subscriptions.push(vscode.commands.registerCommand('extension.generateGraph',async(item:Element)=>{
		showGraph(context,item);
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.showGraphStructure', (item: Element) => {
		console.log("generating graph")
		vscode.commands.executeCommand('extension.showClassStructure', item);
		vscode.commands.executeCommand('extension.generateGraph', item);
	}));
}

export function deactivate() {
}
