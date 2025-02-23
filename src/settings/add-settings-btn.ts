import './settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { settingsIcon } from '../common/icons'

export function addSettingsBtn() {
  const [dialog, open] = settingsDialog()
  
  ui.append(html`
    <button
      title="Configurações"
      class="void-btn settings-btn"
      on-click=${open}
    >
      ${settingsIcon()}
    </button>

    ${dialog}
  `)
}

function settingsDialog() {
  const settings = new Map()
    .set('main', settingsMainMenu)
    .set('greenBg', greenBgSettings)
  
  const dialogRef = ref<HTMLDialogElement>()
  const currentSetting = signal('main')

  const open = () => {
    dialogRef.el.show()
    dialogRef.el.focus()
  }
  const onFocusOut = (e: FocusEvent) => {
    const el = e.currentTarget as HTMLElement
    if (el.contains(e.relatedTarget as Node)) {
      return
    }
    
    currentSetting.set('main')
    dialogRef.el.close()
  }

  const dialog = el/*html*/`
    <dialog
      class="settings-dialog"
      ref=${dialogRef}
      on-focusout=${onFocusOut}
    >
      <div>
        <h4 class="title">Configurações</h4>

        ${shell(() => {
          const settingKey = currentSetting.get()
          const settingFn = settings.get(settingKey)

          return settingFn(currentSetting)
        })}
      </div>
    </dialog>
  `

  return [dialog, open]
}

function settingsMainMenu(curSetting: DataSignal<string>) {
  return html`
    <ul>
      <li on-click=${() => curSetting.set('greenBg')}>
        Fundo Verde
      </li>
    </ul>
  `
}

function greenBgSettings(curSetting: DataSignal<string>) {
  return html`
    <div>
      <h4>Fundo Verde</h4>
      <span on-click=${() => curSetting.set('main')}>
        Voltar
      </span>

      <form>
        <label>
          <span>Altura</span>
          <input type="number" />
        </label>

        <label>
          <span>Largura</span>
          <input type="number" />
        </label>
      </form>
    </div>
  `
}
