import { DataSignal, el, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon } from '../common/icons'

export function settingsDialog() {
  const dialogRef = ref<HTMLDialogElement>()
  const currentSetting = signal('main')

  const settings = new Map()
    .set('main', settingsMainMenu(currentSetting))
    .set('greenBg', greenBgSettings(currentSetting))

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
  const menuRef = ref()

  const nav = () => menuRef.el.classList.add('slide')

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-left') {
      menuRef.el.classList.remove('slide')
      curSetting.set('greenBg')
    }
  }

  return el/*html*/`
    <ul
      class="main-menu"
      ref=${menuRef}
      on-animationend=${onAnimationEnd}
    >
      <li on-click=${nav}>
        Fundo Verde
      </li>
      <li on-click=${nav}>
        Fundo Verde
      </li>
      <li on-click=${nav}>
        Fundo Verde
      </li>
    </ul>
  `
}

function greenBgSettings(curSetting: DataSignal<string>) {
  const containerRef = ref()
  
  const nav = () => containerRef.el.classList.add('slide')
  
  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      curSetting.set('main')
    }
  }

  return el/*html*/`
    <div
      ref=${containerRef}
      on-animationend=${onAnimationEnd}
      class="green-bg-settings"
    >
      <header class="settings-header">
        <span class="void-btn" on-click=${nav}>
          ${chevronLeftIcon()}
        </span>
        <h4 class="settings-title">Fundo Verde</h4>
      </header>

      <form class="green-bg-form">
        <label>
          <span>Altura</span>
          <input type="text" />
        </label>

        <label>
          <span>Largura</span>
          <input type="text" />
        </label>
      </form>
    </div>
  `
}
