import { DieTypes } from '../dice-master/dice-master'

export interface DiceEventsHandler {
  increase(type: DieTypes): void
  decrease(type: DieTypes): void
  throwDice(): void
}

export function listenShortcuts(handler: DiceEventsHandler) {
  if (!window.ipcRenderer) return

  window.ipcRenderer.on('addRedDie', () => {
    handler.increase('red')
    new Audio('/sfx/long-pop.wav').play()
  })
  window.ipcRenderer.on('removeRedDie', () => handler.decrease('red'))
  window.ipcRenderer.on('addBlackDie', () => handler.increase('black'))
  window.ipcRenderer.on('removeBlackDie', () => handler.decrease('black'))
  window.ipcRenderer.on('addBlueDie', () => handler.increase('blue'))
  window.ipcRenderer.on('removeBlueDie', () => handler.decrease('blue'))
  window.ipcRenderer.on('throwDice', handler.throwDice)
}
