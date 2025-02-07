import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getAppDataPath } from '../app-path/app-path'

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
  #current: RollResult = {
    activeEffects: [],
    temporary: []
  }

  constructor() {
    if (!RollResultStorage.instance) {
      RollResultStorage.instance = this
    }

    return RollResultStorage.instance
  }

  get current() {
    return this.#current
  }

  set current(value: RollResult) {
    this.#current = value

    writeFile(
      path.join(getAppDataPath(), 'current.json'),
      JSON.stringify(value)
    )
    .catch(() => null)
  }

  async init() {
    const current = await readFile(path.join(getAppDataPath(), 'current.json'))
      .catch(() => null)

    if (!current) return

    this.#current = JSON.parse(current.toString('utf-8'))
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
