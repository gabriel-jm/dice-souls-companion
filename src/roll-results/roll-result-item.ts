import './roll-results.css'
import { el, ref } from 'lithen-fns'
import { isLocked } from '../main'
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
  const removeItem = () => itemRef.el.remove()

  function reRoll() {
    if (isLocked.data()) return

    isLocked.set(true)
    diceMaster.clear()

    const promise = diceMaster.rollByType(1, type)

    if (promise) {
      promise.then(result => {
        isLocked.set(false)

        if (type === 'red') {
          const duplicated = redEffects
            .querySelector(`[value="${result[0].value}"]`)

          if (duplicated) {
            duplicated.remove()
            return
          }
        }

        itemRef.el.replaceWith(rollResultItem({
          type,
          effectsList,
          value: result[0].value,
        }))
      })
    } else {
      isLocked.set(false)
    }
  }

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
