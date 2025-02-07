import './style.css'

import { manualThrow } from './manual-throw/manual-throw'
import { signal } from 'lithen-fns'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { moneyFormEvents } from './donate-form/money-form-events'
import { diceMaster } from './dice-master/dice-master'
import { addCloseEditDialogEvent } from './edit-result/edit-result-event'

export const isLocal = location.hostname === 'localhost'
export const isLocked = signal(false)

addGreenBackgroundEvent()
moneyFormEvents()
ui.append(manualThrow())
addCloseEditDialogEvent()

document.querySelector('.btn.clear-dice')?.addEventListener('click', () => {
  diceMaster.clear()
})

diceMaster.init().catch(console.log)
