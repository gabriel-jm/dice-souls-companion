import { sql } from '../database/connection'

export type RollResultEntry = {
  id: string
  activeEffects: DieEffect[]
  temporary: DieEffect[]
  createdAt: Date
}

export type RollResult = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export type DieEffect = {
  number: number
  text: string
}

export type CreateRollResultData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export type CurrentResultEntry = {
  value: RollResult
  updatedAt: Date
}

export class RollResultRepository {
  async getCurrent() {
    const [currentData] = await sql<CurrentResultEntry>`
      select * from currentResult;
    `
    
    if (!currentData) {
      const data = {
        activeEffects: [],
        temporary: []
      }

      await sql`
        insert into currentResult
        values (${data}, ${new Date()});
      `

      return data
    }

    return currentData.value
  }

  setCurrent(data: RollResult) {
    return sql`
      update currentResult
      set value = ${data}, updatedAt = ${new Date()};
    `
  }
}
