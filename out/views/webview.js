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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showWebview = showWebview;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mermaidGenerator_1 = __importDefault(require("../graphGeneration/mermaidGenerator"));
async function showWebview(context) {
    const panel = vscode.window.createWebviewPanel('webview', 'WebView Page', vscode.ViewColumn.One, {
        enableScripts: true
    });
    const htmlFilePath = path.join(context.extensionPath, 'media', 'html', 'webview.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const dependenciesFilePath = path.join(context.extensionPath, 'src', 'parser', 'dependencies.json');
    let dependenciesData;
    try {
        const dependenciesJson = fs.readFileSync(dependenciesFilePath, 'utf8');
        const rawData = JSON.parse(dependenciesJson);
        // Transform the data into the expected format
        dependenciesData = transformData(rawData);
        console.log('Transformed dependencies data:', dependenciesData);
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to load or transform dependencies.json: ' + error);
        return;
    }
    // Generate Mermaid code based on transformed dependenciesData
    const mermaidCode = await (0, mermaidGenerator_1.default)(dependenciesData);
    panel.webview.html = htmlContent.replace('<!-- Mermaid code will be inserted here -->', mermaidCode);
}
function transformData(rawData) {
    const result = [];
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
//# sourceMappingURL=webview.js.map