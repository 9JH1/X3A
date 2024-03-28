const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require("path");
const { execFile } = require("child_process");
const { create } = require('domain');
const fs = require('fs');

let startTime = null;
let appObj = "";
let jsonObj;
let jsonObjAccent = "";
let jsonData;


const restartApp = () => {
    app.relaunch()
    app.exit(0); // Exit the current instance of the app
    const errorMessage = new Notification({
        title: "restarting",
        body: "app restarting",
        icon: "icon.ico",
    })
    errorMessage.show()
};



function getData(endpoint) {
    return fetch(`http://127.0.0.1:22301${endpoint}`)
        .then((res) => res.text())
        .catch((error) => { });
}
async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        minHeight: 500,
        minWidth: 800,
        maxHeight: 500,
        maxWidth: 800,
        fullscreenable: false,
        maximizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            enableMainProcessInspector: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'assets/loader.js'),
            ipcMain: true
        },
        icon: path.join(__dirname, 'icon.ico'),
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: jsonObj["background"],
            symbolColor: jsonObjAccent,
        },
    })

    mainWindow.loadFile('assets/index.html')
}
app.setAppUserModelId("X3-Toolbox")
app.whenReady().then(() => {
    try {
        const data = fs.readFileSync('assets/theme.json', 'utf8');
        jsonData = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
    (async () => {
        function mainApp() {
            startTime = Date.now();
            let child = execFile(path.join(__dirname, "main.exe"), {
                detached: true,
                stdio: "ignore",
            })
            child.unref();
            child.once('spawn', () => {
                const awaitServer = setInterval(() => {
                    (async () => {
                        appObj = await getData("");
                        if (appObj != undefined) {
                            awaitServer.close()
                            appObj = JSON.parse(appObj)
                            jsonObj = jsonData[jsonData["!selected"]];
                            if (jsonObj["accent-inline"]) {
                                jsonObjAccent = jsonObj["accent-inline"];
                            } else {
                                jsonObjAccent = appObj["theme"]["raw"]
                            }
                            createWindow()
                            console.log(`server took ${(Date.now() - startTime) / 1000}s to launch`);
                        }
                    })();
                }, 1000)
            });
            child.on("exit", () => {
                console.log("server crashed")
                app.quit()
            })
        }
        if (await getData("")) {
            console.log("server on")
            while (await getData("")) {
                getData("/off");
                console.log("turning off ")
            }
            mainApp()
        } else {
            mainApp()
        }
    })();
    app.on("before-quit", () => {
        getData("/off");
    });
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
ipcMain.on('restart', () => {
    restartApp();
});