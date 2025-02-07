import DiceBox from '@3d-dice/dice-box'
import { blackDieEffects, redDieEffects } from './dice-effects'
import { isLocked } from '../main'
import { RollResultParser } from './roll-results/roll-result-parser'
import { RollResultService } from './roll-results/roll-results-service'
import { DataSignal, shell, signal } from 'lithen-fns'
import { rollResultItem } from '../roll-results/roll-result-item'

export type DieTypes = 'black' | 'blue' | 'red'

export type CurrentRollResult = {
  activeEffects: DataSignal<number[]>
  temporary: DataSignal<number[]>
}

class DiceMaster {
  diceBox: DiceBox
  rollParser: RollResultParser
  rollResultService = new RollResultService()

  currentResult: CurrentRollResult = {
    activeEffects: signal<number[]>([]),
    temporary: signal<number[]>([])
  }

  redDieEffects = redDieEffects
  blackDieEffects = blackDieEffects

  diceColors: Record<DieTypes, string> = {
    black: '#242424',
    red: '#ad2510',
    blue: '#1a30a9'
  }

  constructor() {
    this.diceBox = new DiceBox({
      assetPath: '/assets/',
      container: '#app',
      scale: 4,
    })
    this.rollParser = new RollResultParser(this.currentResult)

    this.#addEffectsList()
  }

  init() {
    return this.diceBox.init()
  }

  clear() {
    this.diceBox.clear()
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

  rollMany(quantity: Record<DieTypes, number>) {
    return this.#lockUntil(() => {
      Promise.all(
        Object.entries(quantity)
          .map(([key, value]) => {
            const type = key as DieTypes
  
            return this.#rollDice(type, value)
              .then(result => {
                if (!result) return

                this.rollParser.parseResults(type, result)
                return this.#updateServiceCurrent()
              })
          })
      )
    })
  }

  reroll(type: DieTypes, currentValue: number) {
    return this.#lockUntil(async () => {
      const results = await this.#rollDice(type, 1)

      if (results) {
        this.rollParser.parseReroll(type, currentValue, results[0])
        await this.#updateServiceCurrent()
      }
    })
  }

  remove(type: DieTypes, value: number) {
    return this.#lockUntil(() => {
      const listSignal = type === 'red'
        ? this.currentResult.activeEffects
        : this.currentResult.temporary

      listSignal.set(
        listSignal.data().filter(n => n !== value)
      )

      return this.#updateServiceCurrent()
    })
  }

  async #lockUntil(callback: Function) {
    if (isLocked.data()) return
    
    isLocked.set(true)
    this.clear()

    const results = await callback()

    isLocked.set(false)

    return results
  }

  #rollDice(type: DieTypes, quantity: number) {
    const diceCount = Math.floor(quantity)
    
    if (diceCount <= 0) {
      return Promise.resolve()
    }
      
    const results = this.diceBox.add(
      `${diceCount}d20`,
      { themeColor: this.diceColors[type] }
    )
  
    return results
  }

  #addEffectsList() {
    redEffectsListEl.append(...shell(() => {
      const effectsArray = [...this.currentResult.activeEffects.get()]
      return effectsArray.map(effectNumber => rollResultItem({
        type: 'red',
        effectsList: this.redDieEffects,
        value: effectNumber
      }))
    }))

    blackEffectsListEl.append(...shell(() => {
      const effectsArray = [...this.currentResult.temporary.get()]
      return effectsArray.map(effectNumber => rollResultItem({
        type: 'black',
        effectsList: this.blackDieEffects,
        value: effectNumber
      }))
    }))
  }

  #updateServiceCurrent() {
    const mapEffect = (key: 'activeEffects'|'temporary') => {
      return this.currentResult[key].data().map(value => {
        const effectList = key === 'activeEffects'
          ? this.redDieEffects
          : this.blackDieEffects

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
