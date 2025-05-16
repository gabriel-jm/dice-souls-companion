import { BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { shorcutsRepository } from './shortcuts-repository'

export async function initShortcuts(win: BrowserWindow) {
  const availableShortcutNames = [
    'addRedDie',
    'removeRedDie',
    'addBlackDie',
    'removeBlackDie',
    'addBlueDie',
    'removeBlueDie',
    'throwDice'
  ]

  ipcMain.handle('add-shortcut', (_, data) => {
    if (!availableShortcutNames.includes(data.name)) {
      return;
    }
    
    return shorcutsRepository.add(data)
  })

  const shortcuts = await shorcutsRepository.getAll()

  for (const { name, command } of shortcuts) {
    if (!command) continue

    globalShortcut.register(name, () => win.webContents.send(command))
  }

  ipcMain.handle('get-shortcuts', () => shortcuts)
}
