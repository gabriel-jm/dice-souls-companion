import { ipcMain } from 'electron'
import { profilesRepository } from './profiles-repository'

export function initProfiles() {
  ipcMain.handle('get-profiles', () => profilesRepository.getAll())
  ipcMain.handle('get-active-profile', () => profilesRepository.getActive())
  ipcMain.handle('add-profile', (_, data) => profilesRepository.add(data))
  ipcMain.handle('set-active-profile', (_, data) => profilesRepository.setActive(data.id))
  ipcMain.handle('update-profile', (_, data) => profilesRepository.update(data))
  ipcMain.handle('delete-profile', (_, data) => profilesRepository.delete(data.id))
}
