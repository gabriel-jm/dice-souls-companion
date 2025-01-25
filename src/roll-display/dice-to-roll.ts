import './dice-to-roll.css'
import { html } from 'lithen-fns'
import { d20Icon } from '../common/icons'
import { DieTypes } from '../main'

export type DiceToRollCardProps = {
  amount: string
  donateOwner?: string
  dice: {
    red: number
    blackOrBlue: number
  }
  rollDice(quantity: number, type: DieTypes): void
}

export function diceToRollCard(props: DiceToRollCardProps) {
  const { dice } = props
  
  return html`
    <div class="glass-container dice-to-roll-container">
      <span class="money-display">R$ ${props.amount}</span>
      
      ${props.donateOwner && html`
        <p title="${props.donateOwner}">
          ${props.donateOwner}
        </p>  
      `}

      <div class="dice-to-roll-dice-group">
        ${dice.red >= 1 && html`
          <button
            class="dice-to-roll-btn red"
            on-click=${() => props.rollDice(dice.red, 'red')}
          >
            ${d20Icon()}
            <span>${Math.floor(dice.red)}</span>
          </button>  
        `}

        ${dice.blackOrBlue >= 1 && html`
          <button
            class="dice-to-roll-btn"
            on-click=${() => props.rollDice(dice.blackOrBlue, 'black')}
          >
            ${d20Icon()}
            <span>${Math.floor(dice.blackOrBlue)}</span>
          </button>
          <button
            class="dice-to-roll-btn blue"
            on-click=${() => props.rollDice(dice.blackOrBlue, 'blue')}
          >
            ${d20Icon()}
            <span>${Math.floor(dice.blackOrBlue)}</span>
          </button>
        `}
      </div>
    </div>
  `
}
