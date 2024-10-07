"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarWebViewProvider = void 0;
exports.registerWebViewProvider = registerWebViewProvider;
const vscode_1 = require("vscode");
function registerWebViewProvider(context, op) {
    const provider = new SidebarWebViewProvider(context.extensionUri, context);
    context.subscriptions.push(vscode_1.window.registerWebviewViewProvider('dependencies-sidebar-panel', provider));
}
class SidebarWebViewProvider {
    _extensionUri;
    extensionContext;
    constructor(_extensionUri, extensionContext) {
        this._extensionUri = _extensionUri;
        this.extensionContext = extensionContext;
    }
    view;
    resolveWebviewView(webviewView, webViewContext, token) {
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
                    vscode_1.commands.executeCommand('selectRootProject', true);
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        const styleResetUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "css", "reset.css"));
        const scriptUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "js", "startbutton.js"));
        const styleVSCodeUri = webview.asWebviewUri(vscode_1.Uri.joinPath(this._extensionUri, "media", "css", "vscode.css"));
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
exports.SidebarWebViewProvider = SidebarWebViewProvider;
//# sourceMappingURL=register-sidebar.js.map