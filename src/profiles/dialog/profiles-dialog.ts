import './profiles-dialog.css'
import { checkCircleIcon, copyIcon, d20Icon, trashIcon, xIcon } from '../../common/icons'
import { diceMaster, DieTypes } from '../../dice-master/dice-master'
import { Profile, ProfileService } from '../profile-service'
import { el, html, shell, signal, ref } from 'lithen-fns'

export function profilesDialog() {
  let activeProfileId = diceMaster.profile.data().id
  const loading = signal(true)
  const profiles = signal<Profile[]>([])
  const currentProfile = signal<Profile | null>(null)
  const actionName = signal('delete')
  const actionDialog = ref<HTMLDialogElement>()

  diceMaster.profile.onChange(value => {
    activeProfileId = value.id
  })

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
    currentProfile.update()

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

  function onInputProfileName(e: InputEvent) {
    if (e.inputType === 'insertLineBreak') {
      const target = e.target as HTMLElement
      target.innerText = target.innerText.trim().replace('\n', '')
      target.blur()
    }
  }

  async function onBlurProfileName(e: Event) {
    const current = currentProfile.data()

    const target = e.target as HTMLElement
    target.innerText = target.innerText.trim()
    const newText = target.innerText

    if (newText !== current?.name) {
      const profileService = new ProfileService()
      await profileService.update({
        id: current?.id,
        name: newText
      })
      const profile = profiles
        .data()
        .find(p => p.id === current?.id)
      profile!.name = newText
      profiles.update()
    }
  }

  async function onBlurEffect(type: string, effect: string, index: number) {
    const current = currentProfile.data()
    const listName = `${type}Effects`
    const effectsList = Reflect.get(current!, listName) as string[]
    const currentItem = effectsList[index]

    if (currentItem !== effect) {
      effectsList[index] = effect
      const profileService = new ProfileService()
      await profileService.update({
        id: current?.id,
        [listName]: [...effectsList]
      })
      profiles.update()
    }
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

          const profilesList = profiles.data()
          const currentProf = currentProfile.get()
          const profilesLinks = profilesList.map(prof => {
            const isOpen = prof.id === currentProf?.id
            const isActive = prof.id === activeProfileId

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

          const isActive = currentProf?.id === activeProfileId

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
                <h4
                  class="profile-name"
                  contenteditable="plaintext-only"
                  on-input=${onInputProfileName}
                  on-blur=${onBlurProfileName}
                >${currentProf?.name}</h4>
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

                    if (action === 'activate') {
                      if (activeProfileId === current?.id) {
                        return html`
                          <p>Este perfil já está em uso!</p>
                          <button
                            class="btn wide"
                            on-click=${closeActionDialog}
                          >
                            Ok
                          </button>
                        `
                      }

                      return html`
                        <p>Deseja usar o perfil "${current?.name}?"</p>
                        <p>Trocar de perfil irá limpar a lista de resultados!</p>
                        <div class="btn-group">
                          <button
                            class="btn wide"
                            on-click=${changeProfile}
                          >
                            Sim
                          </button>
                          <button
                            class="btn wide secondary"
                            on-click=${closeActionDialog}
                          >
                            Não
                          </button>
                        </div>
                      `
                    }

                    if (action === 'delete') {
                      if (current?.id === 'none') {
                        return html`
                          <p>Este perfil "${current?.name}" não pode ser excluído</p>
                          <button
                            class="btn wide"
                            on-click=${closeActionDialog}
                          >
                            Ok
                          </button>
                        `
                      }

                      return html`
                        <p>Deseja excluir este perfil?</p>
                        <div class="btn-group">
                          <button
                            class="btn wide"  
                            on-click=${confirmProfileDelete}
                          >
                            Sim
                          </button>
                          <button
                            class="btn wide secondary"
                            on-click=${closeActionDialog}
                          >
                            Não
                          </button>
                        </div>
                      `
                    }
                  })}
                </dialog>
              </header>
              <div key="${currentProf!.id}" class="die-effects-list-container">
                ${[
                  dieEffectsList(
                    currentProf!.id,
                    'red',
                    currentProf!.redEffects,
                    onBlurEffect
                  ),
                  dieEffectsList(
                    currentProf!.id,
                    'black',
                    currentProf!.blackEffects,
                    onBlurEffect
                  ),
                  dieEffectsList(
                    currentProf!.id,
                    'blue',
                    currentProf!.blueEffects,
                    onBlurEffect
                  )
                ]}
              </div>
            </section>
          `
        })}
      </div>
    </dialog>
  `
}

function dieEffectsList(
  id: string,
  type: DieTypes,
  effectsList: string[],
  onBlurEffect: (type: string, effect: string, index: number) => Promise<void>
) {
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
        ${effectsList.map((effect, index) => {
          if (type === 'blue') {
            return el/*html*/`
              <li class="effect-item blocked">
                ${effect}
              </li>
            `
          }

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
            
            onBlurEffect(type, target.innerText, index)
          }
          
          return el/*html*/`
            <li
              key="${id}-${index}"
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
