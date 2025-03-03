import { DataSignal, el, ref, shell, signal, signalRecord } from 'lithen-fns'
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
  const diceRollerEl = document.querySelector('#dice-roller')! as HTMLDivElement
  const dimentions = signalRecord({
    width: Math.floor(screen.width / 2),
    height: Math.floor(screen.height / 2)
  })

  const containerRef = ref()

  dimentions.width.onChange(v => {
    if (!containerRef.el.isConnected) {
      return DataSignal.REMOVE
    }
    
    diceRollerEl.style.setProperty('--width', `${v}px`)
  })

  dimentions.height.onChange(v => {
    if (!containerRef.el.isConnected) {
      return DataSignal.REMOVE
    }

    diceRollerEl.style.setProperty('--height', `${v}px`)
  })
  
  const nav = () => containerRef.el.classList.add('slide')
  
  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      curSetting.set('main')
    }
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const width = Number((form.elements.namedItem('width')as HTMLInputElement).value)
    const height = Number((form.elements.namedItem('height') as HTMLInputElement).value)

    dimentions.width.set(width)
    dimentions.height.set(height)
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

      <form class="green-bg-form" on-submit=${onSubmit}>
        <label>
          <span>Largura</span>
          <div>
            <input
              name="width"
              class="void"
              type="number"
              .value=${dimentions.width}
              max="${screen.width}"
              min="0"
            />
            <span title="Pixels">px</span>
          </div>
        </label>

        <label>
          <span>Altura</span>
          <div>
            <input
              name="height"
              class="void"
              type="number"
              .value=${dimentions.height}
              max="${screen.height}"
              min="0"
            />
            <span title="Pixels">px</span>
          </div>
        </label>

        <div>
          <button class="settings-btn">
            Salvar
          </button>
        </div>
      </form>
    </div>
  `
}
