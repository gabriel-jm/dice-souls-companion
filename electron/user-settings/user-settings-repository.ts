import { sql } from '../database/connection'

type GreenBgSettingData = {
  width: number
  height: number
}

export class UserSettingsRepository {
  updateGreenBg(data: GreenBgSettingData) {
    return sql`
      update userConfig set greenBg = ${data};
    `
  }
}
