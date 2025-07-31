import { ipcMain } from 'electron'
import { profilesRepository } from './profiles-repository'
import { RollResultRepository } from '../roll-result/roll-result-repository'

export function initProfiles() {
  ipcMain.handle('get-profiles', () => profilesRepository.getAll())
  ipcMain.handle('get-active-profile', () => profilesRepository.getActive())
  ipcMain.handle('add-profile', (_, data) => profilesRepository.add(data))
  ipcMain.handle('set-active-profile', (_, data) => {
    profilesRepository.setActive(data.id)
    return new RollResultRepository().setCurrent({
      activeEffects: [],
      temporary: []
    })
  })
  ipcMain.handle('update-profile', (_, data) => profilesRepository.update(data))
  ipcMain.handle('delete-profile', (_, data) => profilesRepository.delete(data.id))
}
