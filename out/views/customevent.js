"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEvent = void 0;
const vscode_1 = require("vscode");
class CustomEvent {
    constructor() { }
    static customEvent = new CustomEvent();
    eventEmitter = new vscode_1.EventEmitter();
    subscribe = this.eventEmitter.event;
    publish(data) {
        this.eventEmitter.fire(data);
    }
}
exports.CustomEvent = CustomEvent;
//# sourceMappingURL=customevent.js.map