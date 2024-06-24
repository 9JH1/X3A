const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const fs = require("fs");

function getData(endpoint) {
  return fetch(`http://127.0.0.1:22301${endpoint}`)
    .then((res) => res.text())
    .catch((error) => {});
}
async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableMainProcessInspector: true,
      contextIsolation: false,
      ipcMain: true,
    },
  });

  mainWindow.loadFile("assets/frontend/index.html");
}
app.whenReady().then(() => {
  (async () => {
    function mainApp() {
      startTime = Date.now();
      let child = execFile("assets/backend/main.py", {
        detached: true,
        stdio: "ignore",
      });
      child.unref();
      child.once("spawn", () => {
        const awaitServer = setInterval(() => {
          (async () => {
            appObj = await getData("");
            if (!appObj) {
              awaitServer.close();
              try {
                createWindow();
                console.log(
                  `server took ${(Date.now() - startTime) / 1000}s to launch`
                );
              } catch {
                console.log("massive error, i dunno how to fix it good luck");
                getData("/off");
                app.quit();
              }
            }
          })();
        }, 1000);
      });
      child.on("exit", () => {
        console.log("server crashed");
        app.quit();
      });
    }
    if (await getData("")) {
      console.log("server on");
      while (await getData("")) {
        getData("/off");
        console.log("turning off ");
      }
      mainApp();
    } else {
      mainApp();
    }
  })();
  app.on("before-quit", () => {
    getData("/off");
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.on("restart", () => {
  restartApp();
});
