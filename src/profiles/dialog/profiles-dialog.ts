import { copyIcon, d20Icon, editIcon, xIcon } from '../../common/icons'
import { DieTypes } from '../../dice-master/dice-master'
import { Profile, ProfileService } from '../profile-service'
import './profiles-dialog.css'
import { el, html, shell, signal } from 'lithen-fns'

export function profilesDialog() {
  const loading = signal(true)
  const profiles = signal<Profile[]>([])
  const currentProfile = signal<Profile | null>(null)

  function closeDialog() {
    profileDialogEl.close()
  }

  async function addBlankProfile() {
    const profilesService = new ProfileService()
    const newProfile = await profilesService.addBlank()

    profiles.data().push(newProfile)
    profiles.update()
    currentProfile.set(newProfile)
  }

  async function copyProfile() {
    const profilesService = new ProfileService()
    const copy = await profilesService.copy(currentProfile.data()!)

    profiles.data().push(copy)
    profiles.update()
    currentProfile.set(copy)
  }

  function refresh() {
    loading.set(true)
    const profileService = new ProfileService()
    profileService.getAll()
      .then(data => {
        profiles.set(data)
        currentProfile.set(data[0])
        loading.set(false)
      })
  }

  refresh()

  return html`
    <dialog class="profiles-dialog" id="profileDialogEl">
      <div class="profiles-container">
        ${shell(() => {
          if (loading.get()) {
            return 'Carregando...'
          }

          const profilesList = profiles.get()
          const currentProf = currentProfile.get()
          const profilesLinks = profilesList.map(prof => {
            const isActive = prof.id === currentProf?.id

            function onClick() {
              if (isActive) return
              
              currentProfile.set(prof)
            }

            return html`
              <li
                class="profiles-list-item ${isActive && 'active'}"
                on-click=${onClick}
              >
                ${prof.name}
              </li>
            `
          })

          return html`
            <h3 class="profiles-title">Perfis</h3>

            <button class="void-btn close-btn" on-click=${closeDialog}>
              ${xIcon()}
            </button>

            <div class="profiles-list">
              <ul>
                ${profilesLinks}
                <li
                  class="profiles-list-item"
                  title="Adicionar novo"
                  on-click=${addBlankProfile}
                >+</li>
              </ul>
            </div>

            <section>
              <header class="profile-header">
                <h4 class="profile-name">${currentProf?.name}</h4>
                <div>
                  ${editIcon()}
                  <span on-click=${copyProfile}>
                    ${copyIcon()}
                  </span>
                  ${xIcon()}
                </div>
              </header>
              <div class="die-effects-list-container">
                ${[
                  dieEffectsList('red', currentProf!.redEffects),
                  dieEffectsList('black', currentProf!.blackEffects),
                  dieEffectsList('blue', currentProf!.blueEffects)
                ]}
              </div>
            </section>
          `
        })}
      </div>
    </dialog>
  `
}

function dieEffectsList(type: DieTypes, effectsList: string[]) {
  const typeName = {
    red: 'Vermelho',
    black: 'Preto',
    blue: 'Azul'
  }[type]

  return html`
    <div class="die-effect-container ${type}">
      <div class="die-header">
        <span class="die-icon">
          ${d20Icon()}
        </span>
        <h4 class="die-type">
          Dado ${typeName}
        </h4>
      </div>
      <ol class="effects-list">
        ${effectsList.map(effect => {
          function onInput(e: InputEvent) {
            if (e.inputType === 'insertLineBreak') {
              const target = e.target as HTMLElement
              target.innerText = target.innerText.trim().replace('\n', '')
              target.blur()
            }
          }

          function onBlur(e: Event) {
            const target = e.target as HTMLElement
            target.innerText = target.innerText.trim()
            console.log('blur', target.innerText, target.innerText === effect)
          }
          
          return el/*html*/`
            <li
              class="effect-item"
              contenteditable="plaintext-only"
              on-input=${onInput}
              on-blur=${onBlur}
            >${effect}</li>
          `
        })}
      </ol>
    </div>
  `
}
