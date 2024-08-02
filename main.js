const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
  
    mainWindow.loadFile('index.html');
  
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
  }

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle data saving
ipcMain.on('save-data', (event, data) => {
  fs.writeFileSync(path.join(app.getPath('userData'), 'habits.json'), JSON.stringify(data));
});

// Handle data loading
ipcMain.handle('load-data', (event) => {
  try {
    const data = fs.readFileSync(path.join(app.getPath('userData'), 'habits.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
});