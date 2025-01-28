import './dice-to-roll.css'
import { html, signal } from 'lithen-fns'
import { d20Icon } from '../common/icons'
import { DieTypes, parseRollResults, stats } from '../main'
import { DiceGroupRollResult } from '@3d-dice/dice-box'

export type DiceToRollCardProps = {
  amount: string
  donateOwner?: string
  dice: {
    red: number
    blackOrBlue: number
  }
  rollDice(quantity: number, type: DieTypes): Promise<DiceGroupRollResult[]>
}

export function diceToRollCard(props: DiceToRollCardProps) {
  const { dice } = props
  
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
        <div>
          ${diceButton('red', dice.red, props.rollDice)}
        </div>

        <div class="dice-btn-group">
          ${diceButton('black/blue', dice.blackOrBlue, props.rollDice)}
        </div>
      </div>
    </div>
  `
}

function diceButton(
  type: 'red' | 'black/blue',
  quantity: number,
  rollDice: DiceToRollCardProps['rollDice']
) {
  if (quantity <= 0) return

  const diceQuantity = signal(quantity)
  
  if (type === 'red') {
    return html`
      <button
        class="dice-to-roll-btn ${type}"
        on-click=${() => {
          diceQuantity.set(0)
          stats.redDiceRolled += quantity
          rollDice(quantity, type)
            .then(results => parseRollResults('red', results))
        }}
      >
        ${d20Icon()}
        <span>${diceQuantity}</span>
      </button>
    `
  }
  
  return html`
    <button
      class="dice-to-roll-btn black"
      on-click=${() => {
        diceQuantity.set(0)
        rollDice(quantity, 'black')
          .then(results => parseRollResults('black', results))
      }}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
    <button
      class="dice-to-roll-btn blue"
      on-click=${() => {
        diceQuantity.set(0)
        rollDice(quantity, 'blue')
          .then(results => parseRollResults('blue', results))
      }}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
  `
}
