import './roll-results.css'
import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { DieTypes } from '../main'
import { blackDieEffects, redDieEffects } from '../dice-effects/dice-effects'
import { el, ref } from 'lithen-fns'
import { xIcon } from '../common/icons'

export function parseRollResults(type: DieTypes, results: DiceGroupRollResult[]) {
  let listElement = redEffects
  let effectsList = redDieEffects

  if (type !== 'red') {
    listElement = blackEffects
    effectsList = blackDieEffects

    if (listElement.children.length == 2) {
      for (let i = 0; i<results.length; i++) {
        listElement.firstChild?.remove()
      }
    }
  }

  const newResults = results
    .map(result => {
      const effect = effectsList[result.value - 1]
      const itemRef = ref<HTMLElement>()
      const removeItem = () => itemRef.el?.remove()

      return el/*html*/`
        <li
          class="roll-result ${type}"
          value="${result.value}"
          ref=${itemRef}
        >
          <div class="texts">
            <span class="number">
              ${String(result.value).padStart(2, '0')}
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
    })

  listElement.append(...newResults)
}
