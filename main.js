const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const AutoLaunch = require('auto-launch');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: false,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.setSkipTaskbar(true);
  mainWindow.setResizable(false);
  mainWindow.setFullScreen(true);

  mainWindow.setAlwaysOnTop(false);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.handle('save-data', (event, data) => {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'habitTrackerData.json');
    fs.writeFileSync(filePath, JSON.stringify(data));
  });

  ipcMain.handle('load-data', (event) => {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'habitTrackerData.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  });
}

const autoLauncher = new AutoLaunch({
  name: 'Habit Tracker',
  path: app.getPath('exe'),
});

autoLauncher.isEnabled()
  .then((isEnabled) => {
    if (!isEnabled) return autoLauncher.enable();
  })
  .then(() => {
    console.log('Auto-launch is set up');
  })
  .catch((err) => {
    console.error('Failed to set up auto-launch:', err);
  });

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});