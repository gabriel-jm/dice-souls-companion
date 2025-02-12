import './style.css'
import { signal } from 'lithen-fns'

export const isLocal = (
  location.hostname === 'localhost'
  || location.hostname === ''
)
export const isLocked = signal(false)

import { addManualThrow } from './manual-throw/manual-throw'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { moneyFormEvents } from './donate-form/money-form-events'
import { diceMaster } from './dice-master/dice-master'
import { addCloseEditDialogEvent } from './edit-result/edit-result-event'
import { addRerollAllResultsEvent } from './roll-results/reroll-all-results-event'
import { separateDiceRollerEvent } from './separated-dice-roller/separate-dice-roller-event'

addGreenBackgroundEvent()
moneyFormEvents()
addManualThrow()
addCloseEditDialogEvent()
addRerollAllResultsEvent()
separateDiceRollerEvent()

document.querySelector('.btn.clear-dice')?.addEventListener('click', () => {
  diceMaster.clear()
  window.ipcRenderer.send('roll-dice', 'red', 2)
})

if (window.ipcRenderer) {
  window.ipcRenderer.on('app-version', (_, version) => {
    document.querySelector('.version-tag')?.append(
      `v${version}`
    )
  })
}

diceMaster.init().catch(console.log)
