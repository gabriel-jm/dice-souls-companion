import { html, shell, signal } from 'lithen-fns'
import { DieTypes } from '../dice-master'

type LogEntry = {
  action: string
  die: {
    type: DieTypes
    value: number
  }
}

class DiceLogger {
  logs = signal<LogEntry[]>([])

  init() {
    logsDiv.append(...shell(() => {
      return this.logs.get().map(entry => {
        const value = String(entry.die.value).padStart(2, '0')

        return html`
          <p>
            <span class="${entry.die.type}">
              [${value}]
            </span>
            <span>${entry.action}</span>
          </p>
        `
      })
    }))
  }

  dieAdded(type: DieTypes, value: number) {
    const entry = {
      action: 'Adicionado',
      die: { type, value }
    }

    this.log(entry)
  }

  log(entry: LogEntry) {
    this.logs.set(list => [...list, entry])
  }
}

export const diceLogger = new DiceLogger()
