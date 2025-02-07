import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { CurrentRollResult, DieTypes } from '../dice-master'

export class RollResultParser {
  constructor(public current: CurrentRollResult) {}

  parseResults(type: DieTypes, results: DiceGroupRollResult[]) {
    if (type === 'red') {
      return this.#parseRedDice(results)
    }
  
    if (type === 'black') {
      return this.#parseBlackDice(results)
    }
  
    this.#parseBlueDice(results)
  }

  parseReroll(type: DieTypes, currentValue: number, resultValue: number) {
    let listSignal = this.current.temporary
    
    if (type === 'red') {
      listSignal = this.current.activeEffects
      
      this.current.activeEffects.set(value => {
        return value.filter(n => n !== resultValue)
      })
    }

    const index = listSignal.data().findIndex(n => n === currentValue)

    if (index !== -1) {
      listSignal.set(value => {
        const newList = [...value]
        newList[index] = resultValue
        return newList
      })
    }
  }

  #parseRedDice(results: DiceGroupRollResult[]) {
    const resultValues = new Set<number>()

    for (const result of results) {
      if (resultValues.has(result.value)) {
        resultValues.delete(result.value)
        continue
      } 

      resultValues.add(result.value)
    }

    const listSignal = this.current.activeEffects
    const newResults: number[] = []
  
    for (const value of resultValues) {
      const hasItem = listSignal.data().find(n => n === value)

      if (hasItem) {
        this.current.activeEffects.set(list => {
          return list.filter(n => n !== value)
        })
        continue
      }

      newResults.push(value)
    }
  
    listSignal.set(list => [...list, ...newResults])
  }
  
  #parseBlackDice(results: DiceGroupRollResult[]) {
    const listSignal = this.current.temporary
    let newList = listSignal.data()

    if (newList.length === 2) {
      for (let i = 0; i<results.length; i++) {
        newList = newList.filter((_, index) => index !== 0)
      }
    }
  
    newList = [...newList, ...results.map(result => result.value)]
    listSignal.set(newList)
  }
  
  #parseBlueDice(results: DiceGroupRollResult[]) {
    let newList = this.current.activeEffects.data()

    for (const result of results) {
      newList = newList.filter(value => value !== result.value)
    }

    this.current.activeEffects.set(newList)
  }
}
