import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { startServer } from './local-server/start-server'
import { autoUpdater } from 'electron-updater'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const IS_DEV = process.env.NODE_ENV === 'development'

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let diceWindow: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'img', 'd20.png'),
    width: 1300,
    height: 700,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.on('ready-to-show', () => {
    win?.show()
  })

  win.on('close', () => {
    if (!diceWindow) return

    diceWindow.close()
    diceWindow = null
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('app-version', app.getVersion())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  startServer()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()

  autoUpdater.checkForUpdates()
})

autoUpdater.on('update-available', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.on('roll-dice', (_, type, quantity) => {
  diceWindow?.webContents.send('roll-dice', type, quantity)
})

ipcMain.on('roll-many', (_, quantityRecord) => {
  diceWindow?.webContents.send('roll-many', quantityRecord)
})

ipcMain.on('open-dice-window', () => {
  if (diceWindow) {
    diceWindow.focus()
    return
  }
  
  diceWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'img', 'd20.png'),
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  diceWindow.on('close', () => {
    diceWindow = null
    win?.webContents.send('dice-window-closed')
  })

  if (VITE_DEV_SERVER_URL) {
    diceWindow.loadURL(VITE_DEV_SERVER_URL + '/dice-window/index.html')
  } else {
    diceWindow.loadFile(
      path.join(RENDERER_DIST, 'dice-window', 'index.html')
    )
  }
})
