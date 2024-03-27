const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require("path");
const { execFile } = require("child_process");
const { create } = require('domain');


let startTime = null;
let appObj = ""


const restartApp = () => {
    app.relaunch()
    app.exit(0); // Exit the current instance of the app
    const errorMessage = new Notification({
        title: "restarting",
        body: "app restarting",
        icon: "assets/icon.ico"
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
        icon: path.join(__dirname, 'assets/icon.ico'),
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "black",
            symbolColor: appObj["theme"]["raw"],
        },
    })

    mainWindow.loadFile('assets/index.html')
}
app.whenReady().then(() => {
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