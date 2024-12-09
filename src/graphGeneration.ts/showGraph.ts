import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import { Element } from '../views/tree/tokens/root';
import findElementsWithClassName from './listClasses';
import generateClassDiagram from './mermaid';
 
export default async function showGraph(context:vscode.ExtensionContext,item:Element) {
    const panel = vscode.window.createWebviewPanel(
        'classDiagram',
        'Class Diagram',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const workspace = vscode.workspace.workspaceFolders;

    let rootPath: string = '.';
    if(workspace && workspace.length > 0) {
        rootPath = workspace[0].uri.fsPath;
    }


    const filePath = path.join(rootPath, '.vscode', 'dependencies.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Element;
    const itemsList=  findElementsWithClassName(jsonData);
    console.log(`itemslist ${itemsList}`);
    const mermaidGraph = await generateClassDiagram(item,itemsList);
    const htmlFilePath = path.join(context.extensionPath, 'media', 'html', 'webview.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    htmlContent = htmlContent.replace('DIAGRAM_PLACEHOLDER', 'classDiagram\n' + mermaidGraph);
    console.log(htmlContent);
    panel.webview.html = htmlContent;
}