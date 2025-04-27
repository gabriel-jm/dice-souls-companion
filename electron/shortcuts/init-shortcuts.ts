import { BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { UserSettingsRepository } from '../user-settings/user-settings-repository'

export async function initShortcuts(win: BrowserWindow) {
  const userSettingsRepo = new UserSettingsRepository()

  ipcMain.handle('set-shortcuts', (_, data) => userSettingsRepo.updateShortcuts(data))

  const { shortcuts } = await userSettingsRepo.getSettings()

  for (const [key, value] of Object.entries(shortcuts)) {
    if (!value) continue

    globalShortcut.register(value, () => win.webContents.send(key))
  }

  ipcMain.handle('get-shorcuts', () => shortcuts)
}
