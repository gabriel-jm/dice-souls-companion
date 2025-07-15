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

  async addBlank() {
    const data: Profile = {
      id: crypto.randomUUID(),
      name: 'Novo',
      redEffects: Array.from({ length: 20 }).fill('Vazio') as string[],
      blackEffects: Array.from({ length: 20 }).fill('Vazio') as string[],
      blueEffects: [...defaultProfile.blueEffects]
    }

    return this.#add(data)
  }

  async copy(source: Profile) {
    const data = {
      id: crypto.randomUUID(),
      name: `${source.name} Cópia`,
      redEffects: source.redEffects,
      blackEffects: source.blackEffects,
      blueEffects: source.blueEffects
    }

    return this.#add(data)
  }

  async #add(data: Profile) {
    if (window.ipcRenderer) {
      await window.ipcRenderer.invoke('add-profile', data)
    } else {
      const profiles = await this.getAll()

      localStorage.setItem(
        'dsc::profiles',
        JSON.stringify([...profiles, data])
      )
    }

    return data
  }
}

export async function setProfile() {
  const service = new ProfileService()
  await service.getActive()
}
