import './manual-throw.css'
import { diceButton } from '../dice-button/dice-button'
import { DataSignal, html, signalRecord } from 'lithen-fns'
import { diceBox, DieTypes, isLocal, isLocked, rollDice } from '../main'
import { parseRollResults } from '../roll-results/parse-roll-results'
import { blackDieEffects, redDieEffects } from '../dice-effects/dice-effects'

export function manualThrow() {
  const diceQuantities = signalRecord({
    red: 0,
    black: 0,
    blue: 0
  })

  function onClickDiceButton(type: DieTypes, quantity: DataSignal<number>) {
    let minValue = 20

    if (type === 'black') {
      minValue = 2
    }

    quantity.set(value => Math.min(minValue, value + 1))
  }

  function onRightClickDiceButton(_: unknown, quantity: DataSignal<number>) {
    quantity.set(value => Math.max(0, value - 1))
  }

  function throwDice() {
    if (isLocked.data()) return

    isLocked.set(true)

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
              return [type, results] as const
            })
        })
    )
    .then(async (values) => {
      const data: CreateRollResultProps = {
        activeEffects: [],
        temporary: []
      }

      for (const value of values) {
        if (!value) continue
        
        const [key, results] = value

        if (key === 'red') {
          data.activeEffects = results.map(result => {
            return {
              number: result.value,
              text: redDieEffects[result.value - 1]
            }
          })
        }

        if (key === 'black') {
          data.temporary = results.map(result => {
            return {
              number: result.value,
              text: blackDieEffects[result.value - 1]
            }
          })
        }
      }

      if (isLocal) {
        await fetch('http://localhost:3500/results', {
          method: 'POST',
          body: JSON.stringify(data)
        })
      }

      isLocked.set(false)
    })
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
        .disabled=${isLocked}
        on-click=${throwDice}
      >
        Jogar
      </button>
    </div>
  `
}
