export type GreenBgSettingData = {
  width: number
  height: number
}

export type UserSettingsData = {
  greenBg: Partial<GreenBgSettingData>
}

export class UserSettingsService {
  getUserSettings(): Promise<UserSettingsData> {
    return window.ipcRenderer?.invoke('get-user-settings')
  }

  setGreenBgSettings(data: GreenBgSettingData) {
    return window.ipcRenderer?.invoke('update-user-settings', {
      greenBg: data
    })
  }
}
