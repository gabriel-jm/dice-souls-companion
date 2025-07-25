import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { greenBgSettings } from './green-bg/green-bg-settings'
import { shortcutsSettings } from './shortcuts/shortcuts-settings'
import { keyboardIcon, profileIcon } from '../common/icons'

export type SettingsDialogConfig = {
  currentSetting: DataSignal<string>
  set keepOpen(value: boolean)
}

export function settingsDialog() {
  const dialogRef = ref<HTMLDialogElement>()
  const currentSetting = signal('main')
  let keepOpen = false

  const remoteConfig: SettingsDialogConfig = {
    currentSetting,
    set keepOpen(value: boolean) {
      keepOpen = value
    }
  }

  const settings = new Map()
    .set('main', settingsMainMenu)
    .set('greenBg', greenBgSettings)
    .set('shortcuts', shortcutsSettings)

  const open = () => {
    dialogRef.el.classList.remove('close')
    dialogRef.el.show()
    dialogRef.el.focus()
  }
  const onFocusOut = (e: FocusEvent) => {
    if (keepOpen) return

    const el = e.currentTarget as HTMLElement
    if (el.contains(e.relatedTarget as Node)) {
      return
    }
    
    dialogRef.el.classList.add('close')
  }

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'close') {
      currentSetting.set('main')
      dialogRef.el.classList.remove('close')
      dialogRef.el.close()
    }
  }

  const dialog = el/*html*/`
    <dialog
      class="settings-dialog"
      ref=${dialogRef}
      on-focusout=${onFocusOut}
      on-animationend=${onAnimationEnd}
    >
      <h4 class="title">Configurações</h4>
    
      <div class="content">
        ${shell(() => {
          const settingKey = currentSetting.get()
          const settingsElFn = settings.get(settingKey)

          return settingsElFn(remoteConfig)
        })}
      </div>
    </dialog>
  `

  return [dialog, open]
}

function settingsMainMenu(config: SettingsDialogConfig) {
  let nextMenu = 'greenBg'
  const menuRef = ref()

  function nav(nextMenuName: string) {
    return () => {
      nextMenu = nextMenuName
      menuRef.el.classList.add('slide')
    }
  }

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-left') {
      menuRef.el.classList.remove('slide')
      config.currentSetting.set(nextMenu)
    }
  }

  function openProfilesDialog() {
    profileDialogEl.showModal()
  }

  return el/*html*/`
    <ul
      class="main-menu"
      ref=${menuRef}
      on-animationend=${onAnimationEnd}
    >
      <li
        class="settings-title with-icon"
        on-click=${openProfilesDialog}
      >
        ${profileIcon()}
        Perfis
      </li>
      
      <li
        class="settings-title green-bg-title"
        on-click=${nav('greenBg')}
      >
        Fundo Verde
      </li>

      ${window.ipcRenderer && html`
        <li
          class="settings-title with-icon"
          on-click=${nav('shortcuts')}
        >
          ${keyboardIcon()}
          Atalhos
        </li>
      `}
    </ul>
  `
}


