import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import mermaidGenerator from '../graphGeneration/mermaidGenerator';


interface ProjectData {
    projectName: string;
    timestamp: string;
    packages: PackageData[];
}

interface PackageData {
    [packageName: string]: {
        classes: ClassInfo[];
    };
}

interface ClassInfo {
    name: string;
    qualifiedName: string;
    modifiers: string[];
    isInnerClass: boolean;
    typeParameters: string[];
    flags: {
        isAbstract: boolean;
        isStatic: boolean;
        isFinal: boolean;
        isInterface: boolean;
    };
    superclass: string;
    interfaces: string[];
    // Add other properties as needed
}

// Interface for the expected output
interface ClassData {
    packageName: string[];
    name: string;
    flags: {
        isAbstract: boolean;
        isStatic: boolean;
        isFinal: boolean;
        isInterface: boolean;
    };
    superclass: string | null;
    interfaces: string[];
}

export async function showWebview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'webview',
        'WebView Page',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    const htmlFilePath = path.join(context.extensionPath, 'media', 'html', 'webview.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    const dependenciesFilePath = path.join(context.extensionPath, 'src', 'parser', 'dependencies.json');

    let dependenciesData: ClassData[];
    try {
        const dependenciesJson = fs.readFileSync(dependenciesFilePath, 'utf8');
        const rawData: ProjectData = JSON.parse(dependenciesJson);

        // Transform the data into the expected format
        dependenciesData = transformData(rawData);

        console.log('Transformed dependencies data:', dependenciesData);

    } catch (error) {
        vscode.window.showErrorMessage('Failed to load or transform dependencies.json: ' + error);
        return;
    }

    // Generate Mermaid code based on transformed dependenciesData
    const mermaidCode = await mermaidGenerator(dependenciesData);

    panel.webview.html = htmlContent.replace(
        '<!-- Mermaid code will be inserted here -->',
        mermaidCode
    );
}

function transformData(rawData: ProjectData): ClassData[] {
    const result: ClassData[] = [];

    for (const packageObj of rawData.packages) {
        for (const [packageName, packageData] of Object.entries(packageObj)) {
            for (const classInfo of packageData.classes) {
                result.push({
                    packageName: packageName.split('.'),
                    name: classInfo.name,
                    flags: {
                        isAbstract: classInfo.flags.isAbstract,
                        isStatic: classInfo.flags.isStatic,
                        isFinal: classInfo.flags.isFinal,
                        isInterface: classInfo.flags.isInterface
                    },
                    superclass: classInfo.superclass,
                    interfaces: classInfo.interfaces
                });
            }
        }
    }

    return result;
}