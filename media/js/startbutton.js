(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const vscode = acquireVsCodeApi(); // Initialize VS Code API
        const startBtn = document.querySelector('.start-btn');

        // Initialize button event listeners
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                vscode.postMessage({ type: 'start-btn' });
            });
        } else {
            console.error('Start button not found');
        }
    }       
)})();