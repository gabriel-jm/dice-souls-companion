import './style.css'
import { signal } from 'lithen-fns'

export const isLocal = location.hostname === 'localhost'
export const isLocked = signal(false)

import { addManualThrow } from './manual-throw/manual-throw'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { moneyFormEvents } from './donate-form/money-form-events'
import { diceMaster } from './dice-master/dice-master'
import { addCloseEditDialogEvent } from './edit-result/edit-result-event'
import { addRerollAllResultsEvent } from './roll-results/reroll-all-results-event'

addGreenBackgroundEvent()
moneyFormEvents()
addManualThrow()
addCloseEditDialogEvent()
addRerollAllResultsEvent()

document.querySelector('.btn.clear-dice')?.addEventListener('click', () => {
  diceMaster.clear()
})

diceMaster.init().catch(console.log)
