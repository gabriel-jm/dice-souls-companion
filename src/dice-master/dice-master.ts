import DiceBox from '@3d-dice/dice-box'
import { blackDieEffects, redDieEffects } from './dice-effects'

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

  rollByType(quantity: number, type: DieTypes) {
    const diceCount = Math.floor(quantity)
    
    if (diceCount <= 0) return
  
    const results = this.diceBox.add(
      `${diceCount}d20`,
      { themeColor: this.diceColors[type] }
    )
  
    return results
  }

  rollMany(_quantity: Record<DieTypes, number>) {

  }
}

export const diceMaster = new DiceMaster()
