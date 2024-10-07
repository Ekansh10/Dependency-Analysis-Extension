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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAndroidProject = isAndroidProject;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
// this whill check if the droot folder has basic android files and folder structure
//like build.gradle, src/main/java, src/main/res, src/main/AndroidManifest.xml
function isAndroidProject(rootFolder) {
    vscode.commands.executeCommand('detect android project');
    const isAndroidProject = (fs.existsSync(path.join(rootFolder, 'build.gradle')) || fs.existsSync(path.join(rootFolder, 'build.gradle.kts'))) &&
        fs.existsSync(path.join(rootFolder, 'app/src/main/AndroidManifest.xml'));
    return isAndroidProject;
}
//# sourceMappingURL=android.js.map