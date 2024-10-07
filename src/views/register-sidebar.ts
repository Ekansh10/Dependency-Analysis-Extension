import { CancellationToken, commands, ExtensionContext, OutputChannel, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";
import { selectRootFolder } from "../projectTypes/selectFolder";

export function registerWebViewProvider(context: ExtensionContext, op: OutputChannel) {
    const provider = new SidebarWebViewProvider(context.extensionUri, context);
    context.subscriptions.push(window.registerWebviewViewProvider('dependencies-sidebar-panel', provider));
}

export class SidebarWebViewProvider implements WebviewViewProvider {
    constructor(private readonly _extensionUri: Uri, private extensionContext: ExtensionContext) { }

    view?: WebviewView;

    resolveWebviewView(webviewView: WebviewView,
        webViewContext: WebviewViewResolveContext,
        token: CancellationToken) {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "start-btn": {
                    console.log('Button clicked - Start button action initiated');
                    commands.executeCommand('selectRootProject',true);
                }
            }
        });
        
    }

    private _getHtmlForWebview(webview: Webview) {
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css", "reset.css"));
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "js", "startbutton.js"));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css", "vscode.css"));

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
              <script src="${scriptUri}"></script>
           </body>
        </html>`;
    }
}
