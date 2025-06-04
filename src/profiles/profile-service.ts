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
    let profile: Profile = await window.ipcRenderer?.invoke('get-active-profile')

    ProfileService.current = profile
  }
}

export async function setProfile() {
  const service = new ProfileService()
  await service.getActive()
}
