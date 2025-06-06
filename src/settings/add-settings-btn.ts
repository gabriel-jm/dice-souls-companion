import './settings.css'
import { html } from 'lithen-fns'
import { settingsIcon } from '../common/icons'
import { settingsDialog } from './settings-dialog'
import { profilesDialog } from '../profiles/dialog/profiles-dialog'

export function addSettingsBtn() {
  const [dialog, open] = settingsDialog()
  
  ui.append(html`
    <button
      title="Configurações"
      class="void-btn open-settings-btn"
      on-click=${open}
    >
      ${settingsIcon()}
    </button>

    ${dialog}
    ${profilesDialog()}
  `)
}
