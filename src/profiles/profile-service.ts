import { defaultProfile } from './default-profile'

export type Profile = {
  id: string
  name: string
  redEffects: string[]
  blackEffects: string[]
  blueEffects: string[]
}

export class ProfileService {
  static current: Profile = defaultProfile

  async getActive() {
    if (window.ipcRenderer) {
      const profile: Profile = await window.ipcRenderer.invoke('get-active-profile')

      if (profile) {
        ProfileService.current = profile
      }
    }
  }

  async getAll(): Promise<Profile[]> {
    if (window.ipcRenderer) {
      return await window.ipcRenderer.invoke('get-profiles')
    }

    const profilesJson = localStorage.getItem('dsc::profiles')

    if (!profilesJson) {
      return [defaultProfile]
    }

    const profiles = JSON.parse(profilesJson)

    return [defaultProfile, ...profiles]
  }
}

export async function setProfile() {
  const service = new ProfileService()
  await service.getActive()
}
