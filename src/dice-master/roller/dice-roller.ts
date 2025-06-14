import DiceBox from '@3d-dice/dice-box'
import { DieTypes } from '../dice-master'

const originPath = import.meta.env.PROD
  ? 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist'
  : location.origin

export class DiceRoller {
  diceBox: DiceBox
  diceColors: Record<DieTypes, string> = {
    black: '#242424',
    red: '#ad2510',
    blue: '#1a30a9'
  }
  timeoutId?: number

  constructor() {
    this.diceBox = new DiceBox({
      container: '#dice-roller',
      assetPath: '/assets/',
      origin: originPath,
      scale: 5,
      spinForce: 7,
      startingHeight: 10,
      throwForce: 6
    })
  }

  init() {
    return this.diceBox.init()
  }

  clear() {
    return this.diceBox.clear()
  }

  rollDice(type: DieTypes, quantity: number) {
    const diceCount = Math.floor(quantity)
    
    if (diceCount <= 0) {
      return Promise.resolve()
    }
      
    const results = this.diceBox.add(
      `${diceCount}d20`,
      { themeColor: this.diceColors[type] }
    )

    this.#addClearTimer()
  
    return results
  }

  async rollMany(quantity: Partial<Record<DieTypes, number>>) {
    const results = await Promise.all(
      Object.entries(quantity)
        .map(async ([key, value]) => {
          const type = key as DieTypes

          return [type, await this.rollDice(type, value)] as const
        })
    )

    return results
  }

  #addClearTimer() {
    window.clearTimeout(this.timeoutId)
    this.timeoutId = window
      .setTimeout(() => this.clear(), 8_000);
  }
}
