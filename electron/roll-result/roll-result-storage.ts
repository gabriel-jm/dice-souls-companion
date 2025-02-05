import { randomUUID } from 'node:crypto'

export type RollResult = {
  id: string
  activeEffects: DieEffect[]
  temporary: DieEffect[]
  createdAt: Date
}

export type DieEffect = {
  number: number
  text: string
}

export type CreateRollResultProps = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export class RollResultStorage {
  static instance: RollResultStorage
  storage: RollResult[] = []

  constructor() {
    if (!RollResultStorage.instance) {
      RollResultStorage.instance = this
    }

    return RollResultStorage.instance
  }

  insert(data: CreateRollResultProps) {
    console.log({ data })
    this.storage.push({
      ...data,
      id: randomUUID(),
      createdAt: new Date()
    })

    return Promise.resolve()
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
}
