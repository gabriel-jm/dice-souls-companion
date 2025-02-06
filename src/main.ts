import './style.css'

import { manualThrow } from './manual-throw/manual-throw'
import { signal } from 'lithen-fns'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { moneyFormEvents } from './donate-form/money-form-events'
import { diceMaster } from './dice-master/dice-master'

export const isLocal = location.hostname === 'localhost'
export const isLocked = signal(false)

addGreenBackgroundEvent()
moneyFormEvents()
ui.append(manualThrow())

diceMaster.init().catch(console.log)
