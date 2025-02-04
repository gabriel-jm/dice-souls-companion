import { el, ref } from 'lithen-fns'
import { DieTypes } from '../main'
import { xIcon } from '../common/icons'

export type RollResultItemProps = {
  type: DieTypes
  value: number
  effectsList: string[]
}

export function rollResultItem(props: RollResultItemProps) {
  const { type, value, effectsList } = props
  const effect = effectsList[value - 1]
  const itemRef = ref()
  const removeItem = () => itemRef.el.remove()

  return el/*html*/`
    <li
      class="roll-result ${type}"
      value="${value}"
      ref=${itemRef}
    >
      <div class="texts">
        <span class="number">
          ${String(value).padStart(2, '0')}
        </span>
        <span>${effect}</span>
      </div>
      <div class="actions">
        <span title="Remover" on-click=${removeItem}>
          ${xIcon()}
        </span>
      </div>
    </li>
  `
}
