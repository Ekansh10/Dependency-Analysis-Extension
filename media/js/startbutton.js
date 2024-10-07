(function() {
    document.addEventListener('DOMContentLoaded', function () {
        const vscode = acquireVsCodeApi();
        const startbtn = document.querySelector('.start-btn');
        console.log('Script loaded and running');
        console.log('Start button found');

        if (startbtn) {
            startbtn.addEventListener('click', startbtnclicked);
        } else {
            console.error('Start button not found');
        }

        function startbtnclicked() {
            console.log('Start button clicked');
            vscode.postMessage({
                type: 'start-btn',
                value: 'started'
            });
        }
    });
})();
