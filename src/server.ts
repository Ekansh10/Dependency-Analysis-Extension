import express from 'express';
import * as path from 'path';

export function startLocalServer(port = 5000) {
    const app = express();

    // Serve static files (e.g., CSS, JS) from the 'media' directory
    app.use(express.static(path.join(__dirname, '..', 'media')));

    // Route for serving the HTML file
    app.get('/', (req, res) => {
        const htmlPath = path.join(__dirname, '..', 'media', 'html', 'webview.html');
        res.sendFile(htmlPath);
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Local server started at http://localhost:${port}`);
    });
}
