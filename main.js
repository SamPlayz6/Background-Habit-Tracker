const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.setIgnoreMouseEvents(true);

  // Set the window as the desktop wallpaper
  exec('powershell.exe -command "& {$w=(New-Object -ComObject Shell.Application).Windows() | Where-Object { $_.Type -eq 2 }; $w.Document.ActiveView.Focus(); [void][System.Reflection.Assembly]::LoadWithPartialName(\'System.Windows.Forms\'); [System.Windows.Forms.SendKeys]::SendWait(\'^{ESCAPE}\')}"');

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