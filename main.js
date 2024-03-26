const { app, BrowserWindow, Notification } = require('electron')
const path = require("path");
const { execFile } = require("child_process");
const { create } = require('domain');



let appObj = ""



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
function startServer() {
}
function createWindow() {
    startServer()
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        fullscreenable: false,
        maximizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            enableMainProcessInspector: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'assets/loader.js')
        },

        icon: path.join(__dirname, 'assets/icon.ico'),
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "black",
            symbolColor: "white",
        },
    })

    mainWindow.loadFile('assets/index.html')
}


app.whenReady().then(() => {

    let child = execFile(path.join(__dirname, "main.exe"), {
        detached: true,
        stdio: "ignore",
    })
    child.unref();
    child.once('spawn', () => {
        setTimeout(() => {
            (async () => {
                appObj = await getData("");
                console.log(appObj)
                if (appObj == undefined) {
                    console.log("error occurred")
                    const notification = new Notification({
                        title: 'error occurred!',
                        body: "something went wrong, the server couldn't start",
                        icon: "/assets/icon.ico"
                    });
                    notification.show();
                    app.quit();
                } else {
                    appObj = JSON.parse(appObj);
                    createWindow();
                }
            })();
        }, 2000)


    });
    app.on("before-quit", () => {
        getData("/off");
    });
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})