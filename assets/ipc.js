const { ipcRenderer } = require('electron');

const sendRestartCommand = () => {
    ipcRenderer.send('restart');
};
sendRestartCommand();