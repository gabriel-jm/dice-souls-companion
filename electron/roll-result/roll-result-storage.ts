import { randomUUID } from 'node:crypto'

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

export class RollResultStorage {
  static instance: RollResultStorage
  storage: RollResultEntry[] = []
  current: RollResult | null = null

  constructor() {
    if (!RollResultStorage.instance) {
      RollResultStorage.instance = this
    }

    return RollResultStorage.instance
  }

  latest() {
    let result = null

    for (const roll of this.storage) {
      if (!result || roll.createdAt > result.createdAt) {
        result = roll
      }
    }

    return Promise.resolve(result)
  }

  insert(data: CreateRollResultData) {
    this.storage.push({
      ...data,
      id: randomUUID(),
      createdAt: new Date()
    })

    return Promise.resolve()
  }
}
