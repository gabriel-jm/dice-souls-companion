import { sql } from '../database/connection'

type GreenBgSettingData = {
  width: number
  height: number
}

export type UserSettingsData = {
  greenBg: Partial<GreenBgSettingData>
}

export class UserSettingsRepository {

  async getSettings() {
    const [config] = await sql<UserSettingsData>`
      select * from userConfig;
    `

    return config
  }

  updateGreenBg(data: GreenBgSettingData) {
    return sql`
      update userConfig set greenBg = ${data};
    `
  }
}
