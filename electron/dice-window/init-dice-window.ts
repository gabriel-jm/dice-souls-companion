import { BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { DIRNAME, RENDERER_DIST, VITE_DEV_SERVER_URL } from '../main'

export function initDiceWindow(win?: BrowserWindow) {
  let diceWin: BrowserWindow | null = null

  win?.on('close', () => {
    if (!diceWin) return

    diceWin.close()
    diceWin = null
  })

  ipcMain.on('roll-dice', (_, type, quantity) => {
    diceWin?.webContents.send('roll-dice', type, quantity)
  })
  
  ipcMain.on('roll-dice-result', (_, results) => {
    win?.webContents.send('roll-dice-result', results)
  })
  
  ipcMain.on('roll-many', (_, quantityRecord) => {
    diceWin?.webContents.send('roll-many', quantityRecord)
  })
  
  ipcMain.on('roll-many-result', (_, results) => {
    win?.webContents.send('roll-many-result', results)
  })

  ipcMain.on('open-dice-window', () => {
    if (diceWin) {
      diceWin.focus()
      return
    }
    
    diceWin = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'img', 'd20.png'),
      width: 1000,
      height: 600,
      autoHideMenuBar: true,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(DIRNAME, 'preload.mjs'),
      },
    })
  
    diceWin.on('close', () => {
      diceWin = null
      win?.webContents.send('dice-window-closed')
    })
  
    if (VITE_DEV_SERVER_URL) {
      diceWin.loadURL(VITE_DEV_SERVER_URL + '/dice-window/index.html')
    } else {
      diceWin.loadFile(
        path.join(RENDERER_DIST, 'dice-window', 'index.html')
      )
    }
  })
}
