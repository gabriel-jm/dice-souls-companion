import { diceMaster } from '../dice-master/dice-master'
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
    let target: Profile | undefined;

    if (window.ipcRenderer) {
      const profile: Profile = await window.ipcRenderer.invoke('get-active-profile')

      target = profile
    }

    const activeProfileId = localStorage.getItem('dsc::active-profile')

    if (activeProfileId) {
      const profiles = await this.getAll()
      const profile = profiles.find(p => p.id === activeProfileId)

      target = profile
    }

    if (target) {
      ProfileService.current = target
    }
  }

  async setActive(data: Profile) {
    diceMaster.clearResults()
    diceMaster.profile.set(data)

    if (window.ipcRenderer) {
      return await window.ipcRenderer.invoke('set-active-profile', data)   
    }

    localStorage.setItem('dsc::active-profile', data.id)
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

    return profiles
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

  async update(data: Partial<Profile>) {
    if (window.ipcRenderer) {
      return await window.ipcRenderer.invoke('update-profile', data)
    }

    const profiles = await this.getAll()
    const profile = profiles.find(p => p.id === data.id)

    if (!profile) {
      return console.error(`Profile (${data.id}) not found`)
    }

    Object.assign(profile, data)

    localStorage.setItem('dsc::profiles', JSON.stringify(profiles))
  }

  async delete(data: Profile) {
    if (window.ipcRenderer) {
      return await window.ipcRenderer.invoke('delete-profile', data)
    }

    const profiles = await this.getAll()
    const newList = profiles.filter(p => p.id !== data.id)

    localStorage.setItem(
      'dsc::profiles',
      JSON.stringify(newList)
    )
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
