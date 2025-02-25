import './dice-button.css'
import { DataSignal, html, signal } from 'lithen-fns'
import { isLocked } from '../../main'
import { d20Icon } from '../icons'
import { DieTypes } from '../../dice-master/dice-master'

type DiceButtonProps = {
  type: DieTypes | `${DieTypes}/${DieTypes}`
  initialQuantity?: number
  customQuantitySignal?: DataSignal<number>
  onClick?: (type: DieTypes, quantitySignal: DataSignal<number>) => void
  onContextMenu?: (type: DieTypes, quantitySignal: DataSignal<number>) => void
}

export function diceButton(props: DiceButtonProps) {
  if (props.type.includes('/')) {
    const [leftType, rightType] = props.type.split('/') as [DieTypes, DieTypes]

    return [
      singleDieButton({ ...props, type: leftType, side: 'left' }),
      singleDieButton({ ...props, type: rightType, side: 'right' })
    ]
  }

  return singleDieButton(props)
}

type SingleDieButtonProps = DiceButtonProps & {
  side?: 'left' | 'right'
}

function singleDieButton(props: SingleDieButtonProps) {
  const {
    type,
    side = '',
    initialQuantity,
    customQuantitySignal,
    onClick,
    onContextMenu
  } = props

  const diceQuantity = customQuantitySignal ?? signal(initialQuantity ?? 0)

  const clickEvent = () => !isLocked.data() && onClick?.(type as DieTypes, diceQuantity)
  const rightClickEvent = (event: Event) => {
    event.preventDefault()
    !isLocked.data() && onContextMenu?.(type as DieTypes, diceQuantity)
  }

  return html`
    <button
      class="dice-btn ${side} ${type}"
      .disabled=${isLocked}
      on-click=${onClick && clickEvent}
      on-contextmenu=${onContextMenu && rightClickEvent}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
  `
}
