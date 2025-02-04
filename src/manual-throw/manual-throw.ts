import './manual-throw.css'
import { diceButton } from '../dice-button/dice-button'
import { DataSignal, html, signalRecord } from 'lithen-fns'
import { diceBox, DieTypes, lock, rollDice } from '../main'
import { parseRollResults } from '../roll-results/parse-roll-results'

export function manualThrow() {
  const diceQuantities = signalRecord({
    red: 0,
    black: 0,
    blue: 0
  })

  function onClickDiceButton(_: unknown, quantity: DataSignal<number>) {
    quantity.set(value => Math.min(10, value + 1))
  }

  function onRightClickDiceButton(_: unknown, quantity: DataSignal<number>) {
    quantity.set(value => Math.max(0, value - 1))
  }

  function throwDice() {
    if (lock.data()) return

    lock.set(true)

    diceBox.clear()

    Promise.all(
      Object
        .entries(diceQuantities)
        .map(([key, value]) => {
          const type = key as DieTypes

          return rollDice(value.data(), type)
            ?.then(results => {
              value.set(0)
              parseRollResults(type, results)
            })
        })
    )
    .then(() => lock.set(false))
  }

  return html`
    <div class="glass-container manual-throw">
      <h4>Dados Manuais</h4>
      
      <div class="btn-group">
        <div class="dice-count">
          ${[
            diceButton({
              type: 'red',
              customQuantitySignal: diceQuantities.red,
              onClick: onClickDiceButton,
              onContextMenu: onRightClickDiceButton
            }),
            diceButton({
              type: 'black',
              customQuantitySignal: diceQuantities.black,
              onClick: onClickDiceButton,
              onContextMenu: onRightClickDiceButton
            }),
            diceButton({
              type: 'blue',
              customQuantitySignal: diceQuantities.blue,
              onClick: onClickDiceButton,
              onContextMenu: onRightClickDiceButton
            })
          ]}
        </div>
      </div>

      <button
        class="btn wide"
        .disabled=${lock}
        on-click=${throwDice}
      >
        Jogar
      </button>
    </div>
  `
}
