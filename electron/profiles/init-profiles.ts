import { ipcMain } from 'electron'
import { profilesRepository } from './profiles-repository'

export function initProfiles() {
  ipcMain.handle('get-profiles', () => profilesRepository.getAll())
  ipcMain.handle('get-active-profile', () => profilesRepository.getActive())
}
