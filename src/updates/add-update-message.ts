import './update-message.css'
import { html } from 'lithen-fns'

export function addUpdateMessage() {
  if (!window.ipcRenderer) return

  window.ipcRenderer.on('update-ready', () => {
    ui.append(html`
      <div class="update-message">
        <p class="green">Update Disponível!</p>
        <p>Feche o app para instalar.</p>
      </div>
    `)
  })
}
