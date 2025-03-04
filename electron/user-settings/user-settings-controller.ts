import { UserSettingsRepository } from './user-settings-repository'

export type UserSettingsData = {
  greenBg?: {
    width: number
    height: number
  }
}

export function updateUserSettings(data: UserSettingsData) {
  const settingsRepo = new UserSettingsRepository()
  
  if (data.greenBg) {
    return settingsRepo.updateGreenBg(data.greenBg)
  }

  return Promise.resolve()
}
