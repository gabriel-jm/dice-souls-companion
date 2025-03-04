export type GreenBgSettingData = {
  width: number
  height: number
}

export class UserSettingsService {
  setGreenBgSettings(data: GreenBgSettingData) {
    if (!window.ipcRenderer) return Promise.resolve()

    return window.ipcRenderer.invoke('update-user-settings', {
      greenBg: data
    })
  }
}
