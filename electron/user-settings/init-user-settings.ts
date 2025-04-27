import { ipcMain } from 'electron'
import { getUserSettings, updateUserSettings } from './user-settings-controller'

export function initUserSettings() {
  ipcMain.handle('update-user-settings', (_, data) => updateUserSettings(data))
  ipcMain.handle('get-user-settings', getUserSettings)
}
