import { html } from 'lithen-fns'
import { refreshIcon } from '../common/icons'
import { diceMaster } from '../dice-master/dice-master'

export function addRerollAllResultsEvent() {
  const rerollAll = () => diceMaster.rerollAll()

  rollResultActions.append(html`
    <span
      title="Rejogar Todos"
      class="reroll-all"
      on-click=${rerollAll}
    >
      ${refreshIcon()}
    </span>  
  `)
}
