import './edit-result-event.css'
import { el, html } from 'lithen-fns'
import { diceMaster, DieTypes } from '../../dice-master/dice-master'

export function openEditResultDialog(type: DieTypes, currentValue: number) {
  if (editDialog.open) {
    editDialog.close()
    return
  }

  const effectsList = type === 'red'
    ? diceMaster.profile.redEffects
    : diceMaster.profile.blackEffects

  function editEffect(newValue: number) {
    return () => {
      diceMaster.changeResult(type, currentValue, newValue)
        .then(() => editDialog.close())
    }
  }
  
  editDialog.show()
  editDialog.focus()
  editDialog.replaceChildren(html`
    <div class="effects-list">
      ${
        effectsList
          .filter((_, index) => index + 1 !== currentValue)
          .map((effect, index) => {
            let effectNumber = index + 1

            if (effectNumber >= currentValue) {
              effectNumber++
            }

            return el/*html*/`
              <p on-click=${editEffect(effectNumber)}>
                <span class="number">
                  ${String(effectNumber).padStart(2, '0')}
                </span>
                <span>${effect}</span>
              </p>
            `
          })
      }
    </div>
  `)
}

export function addCloseEditDialogEvent() {
  editDialog.addEventListener('blur', () => editDialog.close())
}
