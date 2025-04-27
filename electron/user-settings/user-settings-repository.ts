import { sql } from '../database/connection'

type GreenBgSettingData = {
  width: number
  height: number
}

export type UserSettingsData = {
  greenBg: Partial<GreenBgSettingData>
  shortcuts: Shortcuts
}

export type Shortcuts = {
  addRedDie: string | null
  removeRedDie: string | null
  addBlackDie: string | null
  removeBlackDie: string | null
  addBlueDie: string | null
  removeBlueDie: string | null
  throwDice: string | null
}

type AddShortcut = Partial<Shortcuts>

export class UserSettingsRepository {

  async getSettings() {
    const [config] = await sql<UserSettingsData>`
      select * from userConfig;
    `

    return config
  }

  async updateShortcuts(shortcut: AddShortcut) {
    const data = {
      addRedDie: shortcut.addRedDie || null,
      removeRedDie: shortcut.removeRedDie || null,
      addBlackDie: shortcut.addBlackDie || null,
      removeBlackDie: shortcut.removeBlackDie || null,
      addBlueDie: shortcut.addBlueDie || null,
      removeBlueDie: shortcut.removeBlueDie || null,
      throwDice: shortcut.throwDice || null
    }
    
    await sql`
      Insert Into userConfig (shortcuts)
      Values (${data});
    `
  }

  updateGreenBg(data: GreenBgSettingData) {
    return sql`
      update userConfig set greenBg = ${data};
    `
  }
}
