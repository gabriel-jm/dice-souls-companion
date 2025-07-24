import './profiles-dialog.css'
import { checkCircleIcon, copyIcon, d20Icon, trashIcon, xIcon } from '../../common/icons'
import { diceMaster, DieTypes } from '../../dice-master/dice-master'
import { Profile, ProfileService } from '../profile-service'
import { el, html, shell, signal, ref } from 'lithen-fns'

export function profilesDialog() {
  const loading = signal(true)
  const profiles = signal<Profile[]>([])
  const currentProfile = signal<Profile | null>(null)
  const actionName = signal('delete')
  const actionDialog = ref<HTMLDialogElement>()

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

  function deleteProfile() {
    actionName.set('delete')
    actionDialog.el.showModal()
  }

  function activateProfile() {
    actionName.set('activate')
    actionDialog.el.showModal()
  }

  function closeActionDialog() {
    actionDialog.el.close()
  }

  async function changeProfile() {
    const profile = currentProfile.data()!

    const profilesService = new ProfileService()
    await profilesService.setActive(profile)

    closeActionDialog()
  }

  async function confirmProfileDelete() {
    const current = currentProfile.data()!

    if (current.id === 'none') {
      return closeActionDialog()
    }

    const profilesService = new ProfileService()
    await profilesService.delete(current)

    profiles.set(list => list.filter(p => p.id !== current.id))
    currentProfile.set(profiles.data()[0])
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
          const activeProfile = diceMaster.profile.get()
          const profilesLinks = profilesList.map(prof => {
            const isOpen = prof.id === currentProf?.id
            const isActive = prof.id === activeProfile.id

            function onClick() {
              if (isOpen) return
              
              currentProfile.set(prof)
            }

            return html`
              <li
                class="profiles-list-item ${isOpen && 'open'} ${isActive && 'active'}"
                on-click=${onClick}
              >
                <span>${prof.name}</span>
              </li>
            `
          })

          const isActive = currentProf?.id === activeProfile.id

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

            <section class="profile-section">
              <header class="profile-header">
                <h4 class="profile-name" contenteditable>${currentProf?.name}</h4>
                <div class="profile-name-actions">
                  <span
                    class="${isActive && 'active'}"
                    title="Usar Perfil"
                    on-click=${activateProfile}
                  >
                    ${checkCircleIcon()}
                  </span>
                  <span title="Copiar" on-click=${copyProfile}>
                    ${copyIcon()}
                  </span>
                  <span title="Excluir" on-click=${deleteProfile}>
                    ${trashIcon()}
                  </span>
                </div>
                <dialog class="profile-action-dialog" ref=${actionDialog}>
                  ${shell(() => {
                    const current = currentProfile.get()
                    const action = actionName.get()
                    const activeProfile = diceMaster.profile.get()

                    if (action === 'activate') {
                      if (activeProfile.id === current?.id) {
                        return html`
                          <p>Este perfil já está em uso!</p>
                          <button on-click=${closeActionDialog}>Ok</button>
                        `
                      }

                      return html`
                        <p>Deseja usar o perfil "${current?.name}?"</p>
                        <p>Trocar de perfil irá limpar a lista de resultados!</p>
                        <button on-click=${changeProfile}>Sim</button>
                        <button on-click=${closeActionDialog}>Não</button>
                      `
                    }

                    if (action === 'delete') {
                      if (current?.id === 'none') {
                        return html`
                          <p>Este perfil "Padrão" não pode ser excluído</p>
                          <button on-click=${closeActionDialog}>Ok</button>
                        `
                      }

                      return html`
                        <p>Deseja excluir este perfil?</p>
                        <div>
                          <button on-click=${confirmProfileDelete}>
                            Sim
                          </button>
                          <button on-click=${closeActionDialog}>
                            Não
                          </button>
                        </div>
                      `
                    }
                  })}
                </dialog>
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
