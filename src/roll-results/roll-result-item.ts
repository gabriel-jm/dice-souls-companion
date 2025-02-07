import './roll-results.css'
import { el, ref } from 'lithen-fns'
import { refreshIcon, xIcon } from '../common/icons'
import { diceMaster, DieTypes } from '../dice-master/dice-master'

export type RollResultItemProps = {
  type: DieTypes
  value: number
  effectsList: string[]
}

export function rollResultItem(props: RollResultItemProps) {
  const { type, value, effectsList } = props
  const effect = effectsList[value - 1]
  const itemRef = ref()
  const removeItem = () => diceMaster.remove(type, value)

  function reRoll() {
    diceMaster.reroll(type, value)
  }

  return el/*html*/`
    <li
      class="roll-result ${type}"
      key="${value}"
      ref=${itemRef}
    >
      <div class="texts">
        <span class="number">
          ${String(value).padStart(2, '0')}
        </span>
        <span>${effect}</span>
      </div>
      <div class="actions">
        <span title="Jogar Novamente" on-click=${reRoll}>
          ${refreshIcon()}
        </span>
        <span title="Remover" on-click=${removeItem}>
          ${xIcon()}
        </span>
      </div>
    </li>
  `
}
