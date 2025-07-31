import { el, html, shell } from 'lithen-fns'
import { diceMaster } from '../dice-master/dice-master'

export function addEffectsDescription() {
  effectsDescriptionSlot.replaceChildren(...shell(() => {
    const profile = diceMaster.profile.get()

    return html`
      <div class="glass-container">
        <h3>
          <span>Efeitos</span>
          <small class="small-detail">
            (${profile.name})
          </small>
        </h3>
        <details>
          <summary>D20 Vermelho</summary>
          <ol>
            ${profile.redEffects.map(
              (effect) => el/*html*/`<li>${effect}</li>`
            )}
          </ol>
        </details>

        <details>
          <summary>D20 Preto</summary>
          <ol>
            ${profile.blackEffects.map(
              (effect) => el/*html*/`<li>${effect}</li>`
            )}
          </ol>
        </details>

        <details>
          <summary>D20 Azul</summary>
          <ul>
            ${profile.blueEffects.map(
              (effect) => el/*html*/`<li>${effect}</li>`
            )}
          </ul>
        </details>
      </div>  
    `
  }))
}
