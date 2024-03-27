
function parseCSSVariables(cssString) {
    const variableRegex = /--[\w-]+:[^;]+;/g;
    const variables = cssString.match(variableRegex);

    if (!variables) {
        return {};
    }

    const result = {};

    variables.forEach((variable) => {
        const [name, value] = variable.split(":");
        result[name.trim()] = value.trim();
    });

    return result;
}
function getData(endpoint) {
    return fetch(`http://127.0.0.1:22301${endpoint}`)
        .then((res) => res.text())
        .catch((error) => { });
}


(async () => {
    let dataObj = await getData("");
    dataObj = JSON.parse(dataObj);
    document.getElementById("username").innerText = dataObj["computer"]["username"];
    document.documentElement.style.setProperty('--accent', dataObj["theme"]["raw"]);
    if (dataObj["theme"]["mode"] == "light") {
        document.documentElement.style.setProperty('--color-on-accent', "black");
    } else {
        document.documentElement.style.setProperty('--color-on-accent', "white");
    }
})();

document.getElementById("export").addEventListener("click", () => {
    // Function to send the "restart" IPC command
    const sendRestartCommand = () => {
        // Check if we are running in Electron environment
        if (window.require) {
            const electron = window.require('electron');
            electron.ipcRenderer.send('restart'); // Send the "restart" command to main.js
        } else {
            document.body.innerHTML = ""
        }
    };


    // Add event listener to the button
    sendRestartCommand();
})