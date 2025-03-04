import { UserSettingsRepository } from './user-settings-repository'

export type UserSettingsIncomingData = {
  greenBg?: {
    width: number
    height: number
  }
}

export function getUserSettings() {
  const settingsRepo = new UserSettingsRepository()

  return settingsRepo.getSettings()
}

export function updateUserSettings(data: UserSettingsIncomingData) {
  const settingsRepo = new UserSettingsRepository()
  
  if (data.greenBg) {
    return settingsRepo.updateGreenBg(data.greenBg)
  }

  return Promise.resolve()
}
