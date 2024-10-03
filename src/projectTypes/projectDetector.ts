import * as vscode from 'vscode';
import { isAndroidProject } from './android';
import { isMavenProject } from './maven';
export function projectDetector(rootFolder:string){
    
    if(isAndroidProject(rootFolder)){
        vscode.window.showInformationMessage('Android Project Detected');
        return;
    }
    if(isMavenProject(rootFolder)){
        vscode.window.showInformationMessage('Maven Project Detected');
        return;
    }
    
    // nno project detected
    vscode.window.showInformationMessage('Unknown Project Type');
}