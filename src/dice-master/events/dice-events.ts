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

      this.#on('roll-dice-result', (_, results: DiceGroupRollResult[]) => {
        resolve(results)
      })
    })
  }

  emitRollMany(diceQuantity: Record<DieTypes, number>) {
    return new Promise<DiceGroupRollResult[][]>((resolve) => {
      this.#send('roll-many', diceQuantity)

      this.#on('roll-many-result', (_, results: DiceGroupRollResult[][]) => {
        resolve(results)
      })
    })
  }

  #on(name: string, listener: ElectronEventListener) {
    window.ipcRenderer.on(name, listener)
  }

  #send(name: string, ...data: unknown[]) {
    window.ipcRenderer.send(name, ...data)
  }
}
