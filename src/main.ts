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
import { setRandomWallpaper } from './random-wallpaper/set-random-wallpaper'
import { openDiceWindowEvent } from './dice-window/open-dice-window-event'
import { addUpdateMessage } from './updates/add-update-message'

setRandomWallpaper()
addGreenBackgroundEvent()
addManualThrow()
addCloseEditDialogEvent()
addRerollAllResultsEvent()
openDiceWindowEvent()
addUpdateMessage()

document.querySelector('.btn.clear-dice')?.addEventListener('click', () => {
  diceMaster.clear()
})

if (window.ipcRenderer) {
  window.ipcRenderer.on('app-version', (_, version) => {
    document.querySelector('.version-tag')
      ?.append(`v${version}`)
  })
    
  window.ipcRenderer.on('dice-window-closed', () => isDiceWindowOpen.set(false))
}

diceMaster.init().catch(console.log)
