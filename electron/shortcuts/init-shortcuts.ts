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

  ipcMain.handle('add-shortcut', async (_, data) => {
    if (!availableShortcutNames.includes(data.name)) {
      return;
    }

    const shortcutInUse = await shorcutsRepository.getByCommand(data.command)

    if (shortcutInUse) {
      return 'Atalho já está em uso.'
    }
    
    await shorcutsRepository.add(data)

    if (data.oldCommand) {
      globalShortcut.unregister(data.oldCommand)
    }

    globalShortcut.register(data.command, () => win.webContents.send(data.name))
  })

  ipcMain.handle('remove-shortcut', async (_, data) => {
    await shorcutsRepository.remove(data.name)

    globalShortcut.unregister(data.command)
  })

  const shortcuts = await shorcutsRepository.getAll()

  ipcMain.handle('get-shortcuts', () => shortcuts)
  
  for (const { name, command } of shortcuts) {
    if (!command) continue

    globalShortcut.register(command, () => win.webContents.send(name))
  }
}
