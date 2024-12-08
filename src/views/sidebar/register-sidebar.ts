import {
    CancellationToken,
    commands,
    ExtensionContext,
    OutputChannel,
    Uri,
    Webview,
    WebviewView,
    WebviewViewProvider,
    WebviewViewResolveContext,
    window,
} from "vscode";
import path from "path";
import fs from "fs";


export function registerWebViewProvider(context: ExtensionContext, op: OutputChannel): SidebarWebViewProvider {
    const provider = new SidebarWebViewProvider(context.extensionUri, context);
    context.subscriptions.push(
        window.registerWebviewViewProvider("dependencies-sidebar-panel", provider)
    );
    return provider; // Return the provider to access later
}

export class SidebarWebViewProvider implements WebviewViewProvider {
    constructor(private readonly _extensionUri: Uri, private extensionContext: ExtensionContext) {}

    view?: WebviewView; // Keep a reference to the active webview view

    resolveWebviewView(
        webviewView: WebviewView,
        webViewContext: WebviewViewResolveContext,
        token: CancellationToken
    ) {
        this.view = webviewView; // Store the reference when resolved

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "start-btn": {
                    console.log("Button clicked - Start button action initiated");
                    await commands.executeCommand("selectRootProject", true);
                }
            }    
        });
    }

    private _getHtmlForWebview(webview: Webview) {
        const styleResetUri = webview.asWebviewUri(
            Uri.joinPath(this._extensionUri, "media", "css", "reset.css")
        );
        const scriptUri = webview.asWebviewUri(
            Uri.joinPath(this._extensionUri, "media", "js", "startbutton.js")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            Uri.joinPath(this._extensionUri, "media", "css", "vscode.css")
        );

        return `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Security-Policy" content="
                default-src 'none';
                img-src ${webview.cspSource} https:;
                script-src 'unsafe-inline' ${webview.cspSource};
                style-src ${webview.cspSource} 'unsafe-inline';">
              <link href="${styleResetUri}" rel="stylesheet">
              <link href="${styleVSCodeUri}" rel="stylesheet">
           </head>
           <body>
              <div>Action buttons:</div>
              <button type="button" class="start-btn">Start</button>
              <div id="tree-container"></div>
              <script src="${scriptUri}"></script>
           </body>
        </html>`;
    }
}
