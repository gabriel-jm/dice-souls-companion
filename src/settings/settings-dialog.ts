import { DataSignal, el, ref, shell, signal } from 'lithen-fns'
import { greenBgSettings } from './green-bg/green-bg-settings'
import { shortcutsSettings } from './shortcuts/shortcuts-settings'

export function settingsDialog() {
  const dialogRef = ref<HTMLDialogElement>()
  const currentSetting = signal('main')

  const settings = new Map()
    .set('main', settingsMainMenu(currentSetting))
    .set('greenBg', greenBgSettings(currentSetting))
    .set('shortcuts', shortcutsSettings(currentSetting))

  const open = () => {
    dialogRef.el.classList.remove('close')
    dialogRef.el.show()
    dialogRef.el.focus()
  }
  const onFocusOut = (e: FocusEvent) => {
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
          const settingsEl = settings.get(settingKey)

          return settingsEl
        })}
      </div>
    </dialog>
  `

  return [dialog, open]
}

function settingsMainMenu(curSetting: DataSignal<string>) {
  let nextMenu = 'greenBg'
  const menuRef = ref()

  function nav(nextMenuName: string) {
    nextMenu = nextMenuName
    return () => menuRef.el.classList.add('slide')
  }

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-left') {
      menuRef.el.classList.remove('slide')
      curSetting.set(nextMenu)
    }
  }

  return el/*html*/`
    <ul
      class="main-menu"
      ref=${menuRef}
      on-animationend=${onAnimationEnd}
    >
      <li
        class="settings-title green-bg-title"
        on-click=${nav('greenBg')}
      >
        Fundo Verde
      </li>

      <li
        class="settings-title"
        on-click=${nav('shortcuts')}
      >
        Atalhos
      </li>
    </ul>
  `
}


