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
exports.startLocalServer = startLocalServer;
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
function startLocalServer(port = 5000) {
    const app = (0, express_1.default)();
    // Serve static files (e.g., CSS, JS) from the 'media' directory
    app.use(express_1.default.static(path.join(__dirname, '..', 'media')));
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
//# sourceMappingURL=server.js.map