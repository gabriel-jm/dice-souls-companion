import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { DieTypes } from '../dice-master'

type ElectronEventListener = (
  event: Electron.IpcRendererEvent,
  ...data: any[]
) => void

export class DiceEvents {
  emitRollDice(type: DieTypes, quantity: number) {
    return new Promise<DiceGroupRollResult[]>((resolve) => {
      this.#send('roll-dice', type, quantity)

      this.#once('roll-dice-result', (_, results: DiceGroupRollResult[]) => {
        resolve(results)
      })
    })
  }

  emitRollMany(diceQuantity: Partial<Record<DieTypes, number>>) {
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
