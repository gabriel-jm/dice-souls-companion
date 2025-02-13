import { el } from 'lithen-fns'
import { externalLinkIcon } from '../common/icons'
import { isDiceWindowOpen } from '../main'

export function openDiceWindowEvent() {
  function openDiceWindow() {
    if (!window.ipcRenderer) return

    window.ipcRenderer.send('open-dice-window')
    isDiceWindowOpen.set(true)
  }

  greenBackgroundBtn.parentElement?.append(el/*html*/`
    <button
      title="Projetar Dados"
      class="void-btn"
      on-click=${openDiceWindow}
    >
      ${externalLinkIcon()}
    </button>
  `)
}
