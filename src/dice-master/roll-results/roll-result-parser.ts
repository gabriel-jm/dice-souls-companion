import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { CurrentRollResult, DieTypes } from '../dice-master'
import { diceLogger } from '../logger/dice-logger'

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
        return value.filter(n => {
          const bool = n !== resultValue

          if (!bool) {
            diceLogger.duplicatedDie(
              type,
              currentValue
            )
          }

          return bool
        })
      })
    }

    const index = listSignal.data().findIndex(n => n === currentValue)

    if (index !== -1) {
      listSignal.set(value => {
        const newList = [...value]
        newList[index] = resultValue
        return newList
      })
      diceLogger.dieRerolled(type, currentValue, resultValue)
    }
  }

  #parseRedDice(results: DiceGroupRollResult[]) {
    const resultValues = new Set<number>()

    for (const result of results) {
      if (resultValues.has(result.value)) {
        diceLogger.duplicatedDie('red', result.value)
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
          return list.filter(n => {
            const isNotEqual = n !== value

            if (!isNotEqual) {
              diceLogger.duplicatedDie('red', value)
            }

            return isNotEqual
          })
        })
        continue
      }

      diceLogger.dieAdded('red', value)
      newResults.push(value)
    }
  
    listSignal.set(list => [...list, ...newResults])
  }
  
  #parseBlackDice(results: DiceGroupRollResult[]) {
    const listSignal = this.current.temporary
    let currentList = listSignal.data()

    currentList = [
      ...currentList,
      ...results.map(result => {
        diceLogger.dieAdded('black', result.value)
        return result.value
      })
    ]

    if (currentList.length >= 2) {
      currentList = currentList.filter((value, index) => {
        const isLastTwo = index >= currentList.length - 2

        if (!isLastTwo) {
          diceLogger.dieRemoved('black', value)
        }

        return isLastTwo
      })
    }
  
    listSignal.set(currentList)
  }
  
  #parseBlueDice(results: DiceGroupRollResult[]) {
    let newList = this.current.activeEffects.data()

    for (const result of results) {
      let voidBlue = false

      newList = newList.filter(value => {
        const isNotEqual = value !== result.value

        if (!isNotEqual) {
          diceLogger.blueRemovedDie(result.value)
        } else {
          voidBlue = true
        }

        return isNotEqual
      })

      if (voidBlue) {
        diceLogger.voidBlueDie(result.value)
      }
    }

    this.current.activeEffects.set(newList)
  }
}
