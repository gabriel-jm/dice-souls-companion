import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { isDiceWindowOpen, isLocal, isLocked } from '../main'
import { RollResultParser } from './roll-results/roll-result-parser'
import { RollResultService } from './roll-results/roll-results-service'
import { DataSignal, shell, signal } from 'lithen-fns'
import { rollResultItem } from '../roll-results/roll-result-item'
import { diceLogger } from './logger/dice-logger'
import { DiceRoller } from './roller/dice-roller'
import { DiceEvents } from './events/dice-events'
import { Profile, ProfileService } from '../profiles/profile-service'

export type DieTypes = 'black' | 'blue' | 'red'

export type CurrentRollResult = {
  activeEffects: DataSignal<number[]>
  temporary: DataSignal<number[]>
}

class DiceMaster {
  profile!: DataSignal<Profile>
  diceRoller: DiceRoller
  rollParser: RollResultParser
  diceEvents = new DiceEvents()
  rollResultService = new RollResultService()

  currentResult: CurrentRollResult = {
    activeEffects: signal<number[]>([]),
    temporary: signal<number[]>([])
  }

  constructor() {
    this.profile = signal(ProfileService.current)
    this.diceRoller = new DiceRoller()
    this.rollParser = new RollResultParser(this.currentResult)
  }

  async init() {
    this.profile.set(ProfileService.current)

    this.#addEffectsList()

    return this.diceRoller.init()
  }

  clearBoard() {
    if (isLocked.data()) return this

    this.diceRoller.clear()
    return this
  }

  clearResults() {
    if (isLocked.data()) return this

    this.clearBoard()
    this.currentResult.activeEffects.set([])
    this.currentResult.temporary.set([])

    return this
  }

  rollByType(quantity: number, type: DieTypes): Promise<void> {
    return this.#lockUntil(async () => {
      const results = await this.#rollDice(type, quantity)

      if (results) {
        this.rollParser.parseResults(type, results)
        await this.#updateServiceCurrent()
      }
    })
  }

  rollMany(quantity: Partial<Record<DieTypes, number>>, afterRoll?: () => void) {
    return this.#lockUntil(async () => {
      const results = await this.#rollMany(quantity)

      afterRoll?.()

      for (const [t, result] of results) {
        if (!result) continue

        const type = t as DieTypes
        this.rollParser.parseResults(
          type,
          result as DiceGroupRollResult[]
        )
      }

      await this.#updateServiceCurrent()
    })
  }

  reroll(type: DieTypes, currentValue: number) {
    return this.#lockUntil(async () => {
      const results = await this.#rollDice(type, 1)

      if (results) {
        const newValue = results[0].value
        this.rollParser.parseReroll(type, currentValue, newValue)
        await this.#updateServiceCurrent()
      }
    })
  }

  rerollAll() {
    const quantity = {
      red: this.currentResult.activeEffects.data().length,
      black: this.currentResult.temporary.data().length
    }

    const promise = this.rollMany(quantity, () => {
      this.currentResult.activeEffects.set([])
      this.currentResult.temporary.set([])
    })

    return promise
  }

  changeResult(type: DieTypes, currentValue: number, newValue: number) {
    return this.#lockUntil(() => {
      this.rollParser.parseReroll(type, currentValue, newValue)

      return this.#updateServiceCurrent()
    })
  }

  remove(type: DieTypes, value: number) {
    return this.#lockUntil(() => {
      const listSignal = type === 'red'
        ? this.currentResult.activeEffects
        : this.currentResult.temporary

      listSignal.set(
        listSignal.data().filter(n => {
          const isNotEqual = n !== value
          
          if (!isNotEqual) {
            diceLogger.dieRemoved(type, value)
          }

          return isNotEqual
        })
      )

      return this.#updateServiceCurrent()
    })
  }

  async #lockUntil(callback: Function) {
    if (isLocked.data()) return
    
    isLocked.set(true)
    this.diceRoller.clear()

    const results = await callback()

    isLocked.set(false)

    return results
  }

  #rollDice(type: DieTypes, quantity: number) {
    if (isDiceWindowOpen.data()) {
      return this.diceEvents.emitRollDice(type, quantity)
    }

    return this.diceRoller.rollDice(type, quantity)
  }

  #rollMany(diceRecord: Partial<Record<DieTypes, number>>) {
    if (isDiceWindowOpen.data()) {
      return this.diceEvents.emitRollMany(diceRecord)
    }

    return this.diceRoller.rollMany(diceRecord)
  }

  async #addEffectsList() {
    const profile = this.profile.data()

    redEffectsListEl.append(...shell(() => {
      const effectsArray = [...this.currentResult.activeEffects.get()]
      return effectsArray.map(effectNumber => rollResultItem({
        type: 'red',
        effectsList: profile.redEffects,
        value: effectNumber
      }))
    }))

    blackEffectsListEl.append(...shell(() => {
      const effectsArray = [...this.currentResult.temporary.get()]
      return effectsArray.map(effectNumber => rollResultItem({
        type: 'black',
        effectsList: profile.blackEffects,
        value: effectNumber
      }))
    }))

    queueMicrotask(async () => {
      if (!isLocal) return
      
      const serverCurrentData = await this.rollResultService.getCurrent()

      if (serverCurrentData) {
        this.currentResult.activeEffects.set(() => {
          return serverCurrentData.activeEffects.map(effect => effect.number)
        })
        this.currentResult.temporary.set(() => {
          return serverCurrentData.temporary.map(effect => effect.number)
        })
      }
    })
  }

  #updateServiceCurrent() {
    if (!isLocal) return

    const profile = this.profile.data()

    const mapEffect = (key: 'activeEffects'|'temporary') => {
      return this.currentResult[key].data().map(value => {
        const effectList = key === 'activeEffects'
          ? profile.redEffects
          : profile.blackEffects

        return { number: value, text: effectList[value - 1] }
      })
    }

    const rollResultData = {
      activeEffects: mapEffect('activeEffects'),
      temporary: mapEffect('temporary')
    }

    return this.rollResultService.setCurrent(rollResultData)
  }
}

export const diceMaster = new DiceMaster()
