const { app, BrowserWindow, dialog, ipcMain } = require("electron");

require("electron-reload")(__dirname);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // win.loadURL(`file://${__dirname}/renderer/index.html`);
  win.loadURL(`file://${__dirname}/renderer/index.html`);

  win.webContents.openDevTools();

  win.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (win === null) {
    createWindow();
  }
});
