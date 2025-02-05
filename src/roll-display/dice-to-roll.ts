import './dice-to-roll.css'
import { DataSignal, html, signal } from 'lithen-fns'
import { DieTypes, isLocked } from '../main'
import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { parseRollResults } from '../roll-results/parse-roll-results'
import { diceButton } from '../dice-button/dice-button'

export type DiceToRollCardProps = {
  amount: string
  donateOwner?: string
  dice: {
    red: number
    blackOrBlue: number
  }
  rollDice(quantity: number, type: DieTypes): Promise<DiceGroupRollResult[]> | void
}

export function diceToRollCard(props: DiceToRollCardProps) {
  const { dice } = props
  const blackAndBlueQuantity = signal(dice.blackOrBlue)

  function onClick(type: DieTypes, quantity: DataSignal<number>) {
    isLocked.set(true)

    props.rollDice(quantity.data(), type)?.then((results) => {
      quantity.set(0)
      parseRollResults(type, results)
      isLocked.set(false)
    })
  }
  
  return html`
    <div class="glass-container dice-to-roll-container">
      <span class="money-display">
        R$ ${props.amount}
      </span>
      
      ${props.donateOwner && html`
        <p title="${props.donateOwner}">
          ${props.donateOwner}
        </p>  
      `}

      <div class="dice-to-roll-dice-btns">
        ${diceButton({
          type: 'red',
          initialQuantity: dice.red,
          onClick
        })}

        <div class="dice-btn-group">
          ${diceButton({
            type: 'black/blue',
            initialQuantity: dice.blackOrBlue,
            customQuantitySignal: blackAndBlueQuantity,
            onClick
          })}
        </div>
      </div>
    </div>
  `
}
