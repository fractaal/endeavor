'use strict'
declare const __static: string;

import { app, protocol, BrowserWindow, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater, UpdateInfo } from 'electron-updater';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: 950,
    minHeight: 840,
    width: 1600,
    height: 900,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    },
    frame: false,
    icon: path.join(__static, 'icon.png'),
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
    setTimeout(() => {
      // win.webContents.send("update-downloaded", {version: "69.420.1"});
    }, 2000);
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.removeMenu();
    win.setTitle(`Endeavor ${app.getVersion()}`)
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      win.webContents.send("update-downloaded", info);
      // dialog.showMessageBox({title: "Update available!", message: `Endeavor ${info.version} is available for download and will be installed automagically! 💖`});
    });
  }
  // Handle redirect function
  const handleRedirect = (e, url) => {
    if (url != win.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }
  win.webContents.on('will-navigate', handleRedirect);
  win.webContents.on('new-window', handleRedirect);
}



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
