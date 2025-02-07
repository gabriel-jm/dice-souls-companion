import './edit-result-event.css'
import { el, html } from 'lithen-fns'
import { diceMaster, DieTypes } from '../dice-master/dice-master'

export function openEditResultDialog(type: DieTypes, currentValue: number) {
  if (editDialog.open) {
    editDialog.close()
    return
  }

  const effectsList = type === 'red'
    ? diceMaster.redDieEffects
    : diceMaster.blackDieEffects

  function editEffect(newValue: number) {
    return () => {
      diceMaster.changeResult(type, currentValue, newValue)
        .then(() => editDialog.close())
    }
  }
  
  editDialog.show()
  editDialog.append(html`
    <div class="effects-list">
      ${
        effectsList
          .filter((_, index) => index + 1 !== currentValue)
          .map((effect, index) => {
            const effectNumber = index + 1
            return el/*html*/`
              <p on-click=${editEffect(effectNumber)}>
                ${String(effectNumber).padStart(2, '0')} ${effect}
              </p>
            `
          })
      }
    </div>
  `)
}
