import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { DieTypes } from '../dice-master'
import { RollManyRecord } from '../roller/dice-roller'

type ElectronEventListener = (
  event: Electron.IpcRendererEvent,
  ...data: any[]
) => void

export class DiceEvents {
  emitRollDice(type: DieTypes, size: string, quantity: number) {
    return new Promise<DiceGroupRollResult[]>((resolve) => {
      this.#send('roll-dice', type, size, quantity)

      this.#once('roll-dice-result', (_, results: DiceGroupRollResult[]) => {
        resolve(results)
      })
    })
  }

  emitRollMany(diceQuantity: RollManyRecord) {
    return new Promise<[DieTypes, DiceGroupRollResult[]]>((resolve) => {
      this.#send('roll-many', diceQuantity)

      this.#once('roll-many-result', (_, results: [DieTypes, DiceGroupRollResult[]]) => {
        resolve(results)
      })
    })
  }

  #once(name: string, listener: ElectronEventListener) {
    window.ipcRenderer.once(name, listener)
  }

  #send(name: string, ...data: unknown[]) {
    window.ipcRenderer.send(name, ...data)
  }
}
