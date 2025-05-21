import './shortcuts-settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon, keyboardIcon } from '../../common/icons'
import { SettingsDialogConfig } from '../settings-dialog'
import { shortcutsService } from './shortcuts-service'
import { shortcutDetector } from './shortcut-detector'

type TargetShortcut = {
  name: string
  title: string
  command: string | null
}

export function shortcutsSettings(config: SettingsDialogConfig) {
  const shortcutInfo = signal(initShortcutMap())
  
  const containerRef = ref()

  const nav = () => containerRef.el.classList.add('slide')

  const listeningKeyPress = signal(false)
  const keyPressed = signal<string[]>([])
  let targetShortcut: TargetShortcut | null = null

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      config.currentSetting.set('main')
    }
  }

  function enableShortcutDetect(target: TargetShortcut) {
    if (target.command) {
      keyPressed.set(target.command.split('+'))
    }

    targetShortcut = target
    listeningKeyPress.set(true)
    config.keepOpen = true

    const handler = (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.key === 'Backspace') {
        keyPressed.set(value => {
          value.pop()
          return value
        })

        return
      }

      if (e.key === 'Escape') {
        return
      }

      const keyPressedData = keyPressed.data()

      if (keyPressedData.includes(e.key)) {
        return
      }

      keyPressed.set(l => [...l, e.key].sort((a, b) => {
        if (a.length > b.length) {
          return -1
        }

        return 1
      }))
    }

    document.addEventListener('keydown', handler)

    listeningKeyPress.onChange(value => {
      if (value === false) {
        document.removeEventListener('keydown', handler)

        return DataSignal.REMOVE
      }
    })
  }

  function onCloseShortcutDetector(shouldSave: boolean) {
    listeningKeyPress.set(false)
    config.keepOpen = false

    if (shouldSave) {
      const currentCommand = targetShortcut!.command
      let command: string | null = keyPressed.data().join('+')

      if (!command) {
        command = null
      }

      let servicePromise: Promise<void>

      if (currentCommand && !command) {
        servicePromise = shortcutsService.removeShortcut({
          name: targetShortcut!.name,
          command: currentCommand
        })
      } else {
        servicePromise = shortcutsService.addShortcut({
          name: targetShortcut!.name,
          oldCommand: currentCommand,
          command
        })
      }

      servicePromise.then(() => {
        shortcutInfo.set(map => {
          const key = targetShortcut!.name
          const info = Reflect.get(map, key)
          Reflect.set(map, key, {...info, command })
          return map
        })
        shortcutInfo.update()
      })
    }

    keyPressed.set([])
  }

  shortcutsService.getShortcuts(shortcutInfo.data())
    .then(() => shortcutInfo.update())

  return el/*html*/`
    <div
      ref=${containerRef}
      on-animationend=${onAnimationEnd}
      class="shortcuts-settings"
    >
      <header class="settings-header">
        <span class="void-btn" on-click=${nav}>
          ${chevronLeftIcon()}
        </span>
        <h4 class="settings-title with-icon">
          ${keyboardIcon()}
          Atalhos
        </h4>
      </header>

      <div class="list">
        ${shell(() => {
          const map = shortcutInfo.get()

          return [...Object.entries(map)].map(([key, info]) => {
            const commandPClassName = info.command
              ? 'command-p'
              : 'no-command-p'

            return html`
              <div
                class="shortcut-item"
                key=${key}
                on-click=${() => enableShortcutDetect({
                  name: key,
                  ...info
                })}
              >
                <p>${info.title}</p>
                <div>
                  <p class="${commandPClassName}">
                    ${info.command
                      ? `> ${info.command}`
                      : 'Clique para adicionar um atalho'
                    }
                  </p>
                </div>
              </div>
            `
          })
        })}
      </div>

      ${shell(() => {
        if (!listeningKeyPress.get()) {
          return
        }

        return shortcutDetector({
          title: targetShortcut!.title,
          keyPressed,
          onClose: onCloseShortcutDetector,
        })
      })}
    </div>
  `
}

function initShortcutMap() {
  return {
    addRedDie: {
      command: null,
      title: '+1 Dado Vermelho'
    },
    removeRedDie: {
      command: null,
      title: '-1 Dado Vermelho'
    },
    addBlackDie: {
      command: null,
      title: '+1 Dado Preto'
    },
    removeBlackDie: {
      command: null,
      title: '-1 Dado Preto'
    },
    addBlueDie: {
      command: null,
      title: '+1 Dado Azul'
    },
    removeBlueDie: {
      command: null,
      title: '-1 Dado Azul'
    },
    throwDice: {
      command: null,
      title: 'Jogar Dados'
    }
  }
}
