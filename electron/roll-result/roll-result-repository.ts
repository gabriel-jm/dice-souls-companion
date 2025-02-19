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

type Json = string

export type CurrentResultEntry = {
  value: Json
  updatedAt: Date
}

export class RollResultRepository {
  async getCurrent() {
    const currentData = await sql<CurrentResultEntry>`
      select * from currentResult;
    `

    if (!currentData) {
      return {
        activeEffects: [],
        temporary: []
      }
    }

    return JSON.parse(currentData.value) as RollResult
  }

  setCurrent(data: RollResult) {
    return sql`
      update currentResult
      set value = ${JSON.stringify(data)}, updatedAt = ${new Date()};
    `
  }
}
