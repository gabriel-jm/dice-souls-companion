import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { diceMaster, DieTypes } from '../dice-master'
import { rollResultItem } from '../../roll-results/roll-result-item'

export class RollResultParser {
  parseResults(type: DieTypes, results: DiceGroupRollResult[]) {
    if (type === 'red') {
      return this.#parseRedDice(results)
    }
  
    if (type === 'black') {
      return this.#parseBlackDice(results)
    }
  
    this.#parseBlueDice(results)
  }

  parseReroll(type: DieTypes, currentValue: number, result: DiceGroupRollResult) {
    let listElement = blackEffects
    
    if (type === 'red') {
      listElement = redEffects
      const duplicated = listElement
        .querySelector(`[value="${result.value}"]`)

      if (duplicated) {
        duplicated.remove()
        return
      }
    }

    const currentEl = listElement.querySelector(`[value="${currentValue}"]`)
    currentEl?.replaceWith(rollResultItem({
      type,
      effectsList: diceMaster.redDieEffects,
      value: result.value,
    }))
  }

  #parseRedDice(results: DiceGroupRollResult[]) {
    const resultValues = new Set(results.map(result => result.value))
    const newResults = []
  
    for (const value of resultValues) {
      const redEffectItem = redEffects.querySelector(`[value="${value}"]`)
  
      if (redEffectItem) {
        redEffectItem.remove()
        continue
      }
  
      newResults.push(rollResultItem({
        type: 'red',
        value,
        effectsList: diceMaster.redDieEffects,
      }))    
    }
  
    redEffects.append(...newResults)
  }
  
  #parseBlackDice(results: DiceGroupRollResult[]) {
    if (blackEffects.children.length == 2) {
      for (let i = 0; i<results.length; i++) {
        blackEffects.firstChild?.remove()
      }
    }
  
    const newResults = results.map(result => rollResultItem({
      type: 'black',
      value: result.value,
      effectsList: diceMaster.blackDieEffects
    }))
  
    blackEffects.append(...newResults)
  }
  
  #parseBlueDice(results: DiceGroupRollResult[]) {
    for (const result of results) {
      const redEffectItem = redEffects.querySelector(`[value="${result.value}"]`)
  
      if (redEffectItem) redEffectItem.remove()
    }
  }
}
