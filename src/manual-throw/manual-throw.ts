import './manual-throw.css'
import { diceButton } from '../common/dice-button/dice-button'
import { DataSignal, html, signalRecord } from 'lithen-fns'
import { isLocked } from '../main'
import { diceMaster, DieTypes } from '../dice-master/dice-master'
import { listenShortcuts } from './listen-shortcuts'

export function manualThrow() {
  const diceQuantities = signalRecord({
    red: 0,
    black: 0,
    blue: 0
  })

  function increaseDieCount(type: DieTypes, quantity: DataSignal<number>) {
    let minValue = 20

    if (type === 'black') {
      minValue = 2
    }

    quantity.set(value => Math.min(minValue, value + 1))
  }

  function decreaseDieCount(_: unknown, quantity: DataSignal<number>) {
    quantity.set(value => Math.max(0, value - 1))
  }

  function throwDice() {
    diceMaster.rollMany({
      red: diceQuantities.red.data(),
      black: diceQuantities.black.data(),
      blue: diceQuantities.blue.data()
    })
      .then(() => {
        diceQuantities.red.set(0)
        diceQuantities.black.set(0)
        diceQuantities.blue.set(0)
      })
  }

  listenShortcuts({
    increase: type => increaseDieCount(type, diceQuantities[type]),
    decrease: type => decreaseDieCount(type, diceQuantities[type]),
    throwDice
  })

  return html`
    <div class="glass-container manual-throw">      
      <div class="btn-group">
        <div class="dice-count">
          ${[
            diceButton({
              type: 'red',
              customQuantitySignal: diceQuantities.red,
              onClick: increaseDieCount,
              onContextMenu: decreaseDieCount
            }),
            diceButton({
              type: 'black',
              customQuantitySignal: diceQuantities.black,
              onClick: increaseDieCount,
              onContextMenu: decreaseDieCount
            }),
            diceButton({
              type: 'blue',
              customQuantitySignal: diceQuantities.blue,
              onClick: increaseDieCount,
              onContextMenu: decreaseDieCount
            })
          ]}
        </div>
      </div>

      <button
        class="btn wide"
        .disabled=${isLocked}
        on-click=${throwDice}
      >
        Jogar
      </button>
    </div>
  `
}

export function addManualThrow() {
  ui.append(manualThrow())
}
