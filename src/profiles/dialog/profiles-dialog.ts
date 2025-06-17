import { d20Icon, editIcon, xIcon } from '../../common/icons'
import { diceMaster, DieTypes } from '../../dice-master/dice-master'
import './profiles-dialog.css'
import { el, html } from 'lithen-fns'

export function profilesDialog() {
  const { redEffects, blackEffects, blueEffects } = diceMaster.profile

  function closeDialog() {
    profileDialogEl.close()
  }

  return html`
    <dialog class="profiles-dialog" id="profileDialogEl">
      <div class="profiles-container">
        <h3 class="profiles-title">Perfis</h3>

        <button class="void-btn close-btn" on-click=${closeDialog}>
          ${xIcon()}
        </button>

        <div class="profiles-list">
          <ul>
            <li class="profiles-list-item active">Padrão</li>
            <li class="profiles-list-item">Perfil Grande</li>
            <li class="profiles-list-item">Perfil bem longo</li>
          </ul>
        </div>

        <section>
          <header class="profile-header">
            <h4 class="profile-name">Padrão</h4>
            <div>
              ${editIcon()}
              ${xIcon()}
            </div>
          </header>
          <div class="die-effects-list-container">
            ${[
              dieEffectsList({ type: 'red', effectsList: redEffects }),
              dieEffectsList({ type: 'black', effectsList: blackEffects }),
              dieEffectsList({ type: 'blue', effectsList: blueEffects })
            ]}
          </div>
        </section>
      </div>
    </dialog>
  `
}

export type DieEffectsListProps = {
  type: DieTypes
  effectsList: string[]
}

function dieEffectsList(props: DieEffectsListProps) {
  const typeName = {
    red: 'Vermelho',
    black: 'Preto',
    blue: 'Azul'
  }[props.type]

  return html`
    <div class="die-effect-container ${props.type}">
      <div class="die-header">
        <span class="die-icon">
          ${d20Icon()}
        </span>
        <h4 class="die-type">
          Dado ${typeName}
        </h4>
      </div>
      <ol>
        ${props.effectsList.map(effect => {
          return el/*html*/`
            <li>${effect}</li>
          `
        })}
      </ol>
    </div>
  `
}
