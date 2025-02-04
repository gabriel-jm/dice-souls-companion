import './dice-button.css'
import { DataSignal, html, signal } from 'lithen-fns'
import { DieTypes } from '../main'
import { d20Icon } from '../common/icons'

type DiceButtonProps = {
  type: DieTypes | `${DieTypes}/${DieTypes}`
  initialQuantity?: number
  customQuantitySignal?: DataSignal<number>
  onClick?: (type: DieTypes, quantitySignal: DataSignal<number>) => void
  onContextMenu?: (type: DieTypes, quantitySignal: DataSignal<number>) => void
}

export function diceButton(props: DiceButtonProps) {
  const {
    type,
    initialQuantity,
    customQuantitySignal,
    onClick,
    onContextMenu
  } = props
  const diceQuantity = customQuantitySignal ?? signal(initialQuantity ?? 0)

  if (type.includes('/')) {
    const [leftType, rightType] = type.split('/') as [DieTypes, DieTypes]

    return html`
      <button
        class="dice-btn left ${leftType}"
        on-click=${onClick && (() => onClick(leftType, diceQuantity))}
        on-contextmenu=${onContextMenu && ((event: Event) => {
          event.preventDefault()
          onContextMenu(leftType, diceQuantity)
        })}
      >
        ${d20Icon()}
        <span>${diceQuantity}</span>
      </button>
      <button
        class="dice-btn right ${rightType}"
        on-click=${onClick && (() => onClick(rightType, diceQuantity))}
        on-contextmenu=${onContextMenu && (((event: Event) => {
          event.preventDefault()
          onContextMenu(leftType, diceQuantity)
        }))}
      >
        ${d20Icon()}
        <span>${diceQuantity}</span>
      </button>
    `
  }

  const t = type as DieTypes

  return html`
    <button
      class="dice-btn ${type}"
      on-click=${onClick && (() => onClick(t, diceQuantity))}
      on-contextmenu=${onContextMenu && (((event: Event) => {
        event.preventDefault()
        onContextMenu(t, diceQuantity)
      }))}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
  `
}
