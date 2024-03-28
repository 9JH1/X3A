
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
function renderThemes(themeName){ 
    import data from './data.json';
console.log(data);
}
renderThemes()
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
})();

document.getElementById("export").addEventListener("click", () => {
    const sendRestartCommand = () => {
        if (window.require) {
            const electron = window.require('electron');
            electron.ipcRenderer.send('restart'); // Send the "restart" command to main.js
        } else {
            document.body.innerHTML = "require commands only work in a compiled app and not in localhost :("
        }
    };
    sendRestartCommand();
})