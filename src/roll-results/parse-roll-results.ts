import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { DieTypes } from '../main'
import { blackDieEffects, redDieEffects } from '../dice-effects/dice-effects'
import { rollResultItem } from './roll-result-item'

export function parseRollResults(type: DieTypes, results: DiceGroupRollResult[]) {
  if (type === 'red') {
    return parseRedDice(results)
  }

  if (type === 'black') {
    return parseBlackDice(results)
  }

  parseBlueDice(results)
}

function parseRedDice(results: DiceGroupRollResult[]) {
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
      effectsList: redDieEffects,
    }))    
  }

  redEffects.append(...newResults)
}

function parseBlackDice(results: DiceGroupRollResult[]) {
  if (blackEffects.children.length == 2) {
    for (let i = 0; i<results.length; i++) {
      blackEffects.firstChild?.remove()
    }
  }

  const newResults = results.map(result => rollResultItem({
    type: 'black',
    value: result.value,
    effectsList: blackDieEffects
  }))

  blackEffects.append(...newResults)
}

function parseBlueDice(results: DiceGroupRollResult[]) {
  for (const result of results) {
    const redEffectItem = redEffects.querySelector(`[value="${result.value}"]`)

    if (redEffectItem) redEffectItem.remove()
  }
}
