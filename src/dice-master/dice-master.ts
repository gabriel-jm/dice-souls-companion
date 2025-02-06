import DiceBox from '@3d-dice/dice-box'
import { blackDieEffects, redDieEffects } from './dice-effects'
import { isLocked } from '../main'
import { RollResultParser } from './roll-results/roll-result-parser'

export type DieTypes = 'black' | 'blue' | 'red'

class DiceMaster {
  diceBox: DiceBox

  redDieEffects = redDieEffects
  blackDieEffects = blackDieEffects

  diceColors: Record<DieTypes, string> = {
    black: '#242424',
    red: '#ad2510',
    blue: '#1a30a9'
  }

  rollParser = new RollResultParser()

  constructor() {
    this.diceBox = new DiceBox({
      assetPath: '/assets/',
      container: '#app',
      scale: 4,
    })
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
      }
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
}

export const diceMaster = new DiceMaster()
