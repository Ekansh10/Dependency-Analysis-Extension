import * as vscode from 'vscode';
export function showWebview(){
    const panel=vscode.window.createWebviewPanel(
        'webview','WebView Page',vscode.ViewColumn.One,{}
    );
    panel.webview.html=getWebView();
}

function getWebView():string{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dependency Analysis</title>
    </head>
    <body>
        <p>Dependency Analysis Tool</p>
    </body>
</html>`;
}
