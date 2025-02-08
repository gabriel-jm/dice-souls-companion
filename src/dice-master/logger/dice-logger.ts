import { DieTypes } from '../dice-master'
import { diceLog } from './dice-log'


class DiceLogger {
  dieAdded(type: DieTypes, value: number) {
    diceLog('Adicionado', { type, value })
  }

  dieRemoved(type: DieTypes, value: number) {
    diceLog('Removido', { type, value })
  }

  dieRerolled(type: DieTypes, currentValue: number, newValue: number) {
    diceLog(
      { type, value: currentValue },
      'substituido por',
      { type, value: newValue }
    )
  }

  duplicatedDie(type: DieTypes, value: number) {
    diceLog(
      { type, value },
      'duplicado e removido'
    )
  }

  voidBlueDie(value: number) {
    diceLog(
      'Dado',
      { type: 'blue', value },
      'não fez nada...'
    )
  }

  blueRemovedDie(value: number) {
    diceLog(
      'Dado',
      { type: 'blue', value },
      'removeu',
      { type: 'red', value }
    )
  }
}

export const diceLogger = new DiceLogger()
