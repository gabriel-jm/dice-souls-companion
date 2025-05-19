import './shortcuts-settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon, keyboardIcon } from '../../common/icons'
import { SettingsDialogConfig } from '../settings-dialog'
import { shortcutsService } from './shortcuts-service'

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

      if (
        e.key === 'Control' &&
        keyPressedData.includes('Control')
      ) {
        return
      }

      if (keyPressedData.includes(e.key)) {
        return
      }

      keyPressed.set(l => [...l, e.key])
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

      if (currentCommand && !command) {
        shortcutsService.removeShortcut({
          name: targetShortcut!.name,
          command: currentCommand
        })
          .then(() => {
            shortcutInfo.set(map => {
              const key = targetShortcut!.name
              const info = Reflect.get(map, key)
              Reflect.set(map, key, {...info, command })
              return map
            })
            shortcutInfo.update()
          })
      } else {
        shortcutsService.addShortcut({
          name: targetShortcut!.name,
          oldCommand: currentCommand,
          command
        })
          .then(() => {
            shortcutInfo.set(map => {
              const key = targetShortcut!.name
              const info = Reflect.get(map, key)
              Reflect.set(map, key, {...info, command })
              return map
            })
            shortcutInfo.update()
          })
      }
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
                  ${info.command || html`
                    <p class="no-command-p">
                      Clique para adicionar um atalho
                    </p>  
                  `}
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

type ShortcutDetectorProps = {
  title: string
  keyPressed: DataSignal<string[]>
  onClose(saved: boolean): void
}

function shortcutDetector(props: ShortcutDetectorProps) {
  let shouldSave = false
  const containerRef = ref()

  function closeShortcut(saved: boolean) {
    return () => {
      shouldSave = saved
      containerRef.el.classList.add('close')
    }
  }

  function onCloseAnimation(e: AnimationEvent) {
    if (e.animationName === 'bubble-close') {
      props.onClose(shouldSave)
    }
  }

  return html`
    <div
      ref=${containerRef}
      class="shortcut-bubble"
      on-animationend=${onCloseAnimation}
    >
      <h3>Atalho para ${props.title}</h3>
      <br/>

      <p>Precione uma tecla por vez</p>
      <br/>
      <p>Use [Backspace] para remover um comando</p>
      <br/>

      <div class="keys-container">
        ${shell(() => {
          const keys = props.keyPressed.get()

          if (!keys.length) {
            return el/*html*/`
              <span class="key">-</span>
            `
          }

          return keys.map((key, index) => {
            return html`
              <span class="key">${key}</span>
              ${
                index + 1 !== keys.length
                  && el/*html*/`<span class="plus">+</span>`
              }
            `
          })
        })}
      </div>

      <span
        class="settings-btn blue wide"
        on-click=${closeShortcut(true)}
      >
        Salvar
      </span>
      <span
        class="settings-btn wide"
        on-click=${closeShortcut(false)}
      >
        Fechar
      </span>
    </div>
  `
}
