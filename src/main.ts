import './style.css'
import './styles/logs.css'
import { signal } from 'lithen-fns'

export const isLocal = (
  location.hostname === 'localhost'
  || location.hostname === ''
)
export const isLocked = signal(false)
export const isDiceWindowOpen = signal(false)

import { addManualThrow } from './manual-throw/manual-throw'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { diceMaster } from './dice-master/dice-master'
import { addCloseEditDialogEvent } from './edit-result/edit-result-event'
import { addRerollAllResultsEvent } from './roll-results/reroll-all-results-event'
import { openDiceWindowEvent } from './dice-window/open-dice-window-event'

addGreenBackgroundEvent()
addManualThrow()
addCloseEditDialogEvent()
addRerollAllResultsEvent()
openDiceWindowEvent()

document.querySelector('.btn.clear-dice')?.addEventListener('click', () => {
  diceMaster.clear()
  window.ipcRenderer.send('roll-dice', 'red', 2)
})

if (window.ipcRenderer) {
  window.ipcRenderer.on('app-version', (_, version) => {
    document.querySelector('.version-tag')
      ?.append(`v${version}`)
  })
    
  window.ipcRenderer.on('dice-window-closed', () => isDiceWindowOpen.set(false))
}

diceMaster.init().catch(console.log)
