import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { startServer } from './local-server/start-server'
import { autoUpdater } from 'electron-updater'
import { initShortcuts } from './shortcuts/init-shortcuts'
import { initUserSettings } from './user-settings/init-user-settings'
import { initDiceWindow } from './dice-window/init-dice-window'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

export const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(DIRNAME, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const IS_DEV = process.env.NODE_ENV === 'development'

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

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
      preload: path.join(DIRNAME, 'preload.mjs'),
    },
  })

  win.removeMenu()

  win.on('ready-to-show', () => {
    win?.show()
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('app-version', app.getVersion())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
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

  autoUpdater.checkForUpdatesAndNotify()

  initUserSettings()
  startServer().then(init).catch(console.log)
})

function init() {
  initShortcuts(win!).catch(console.log)
  initDiceWindow(win!)
}

autoUpdater.on('update-available', () => {
  autoUpdater.downloadUpdate()
})

autoUpdater.on('update-downloaded', () => {
  win?.webContents.send('update-ready')
})
