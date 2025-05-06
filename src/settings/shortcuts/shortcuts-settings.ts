import './shortcuts-settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'
import { SettingsDialogConfig } from '../settings-dialog'

export type Shortcuts = {
  addRedDie: string | null
  removeRedDie: string | null
  addBlackDie: string | null
  removeBlackDie: string | null
  addBlueDie: string | null
  removeBlueDie: string | null
  throwDice: string | null
}

async function getShortcuts(shortcutInfo: Map<string, { command: string | null }>) {
  const response = await window.ipcRenderer.invoke('get-user-settings')
  const shortcuts = response?.shortcuts as Shortcuts

  for (const [key, value] of Object.entries(shortcuts ?? {})) {
    const info = shortcutInfo.get(key)

    if (info && value) {
      info.command = value
    }
  }
}

export function shortcutsSettings(config: SettingsDialogConfig) {
  const shortcutInfo = signal(
    new Map()
      .set('addRedDie', {
        command: null,
        title: '+1 Dado Vermelho'
      })
      .set('removeRedDie', {
        command: null,
        title: '-1 Dado Vermelho'
      })
      .set('addBlackDie', {
        command: null,
        title: '+1 Dado Preto'
      })
      .set('removeBlackDie', {
        command: null,
        title: '-1 Dado Preto'
      })
      .set('addBlueDie', {
        command: null,
        title: '+1 Dado Azul'
      })
      .set('removeBlueDie', {
        command: null,
        title: '-1 Dado Azul'
      })
      .set('throwDice', {
        command: null,
        title: 'Jogar Dados'
      })
  )
  
  const containerRef = ref()

  const nav = () => containerRef.el.classList.add('slide')

  const listeningKeyPress = signal(false)
  const keyPressed = signal<string[]>([])
  let shortcutTargetTitle = ''

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      config.currentSetting.set('main')
    }
  }

  function enableShortcutDetect(title: string) {
    shortcutTargetTitle = title
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

  getShortcuts(shortcutInfo.data())
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
        <h4 class="settings-title">
          Atalhos
        </h4>
      </header>

      <div class="list">
        ${shell(() => {
          return [...shortcutInfo.get().entries()].map(([key, info]) => {
            return html`
              <div
                class="shortcut-item"
                key=${key}
                on-click=${() => enableShortcutDetect(info.title)}
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
          title: shortcutTargetTitle,
          keyPressed,
          onClose() {
            listeningKeyPress.set(false)
            config.keepOpen = false
          },
        })
      })}

      <button class="settings-btn">Salvar</button>
    </div>
  `
}

type ShortcutDetectorProps = {
  title: string
  keyPressed: DataSignal<string[]>
  onClose(): void
}

function shortcutDetector(props: ShortcutDetectorProps) {
  return html`
    <div class="shortcut-bubble">
      <h3>Atalho para ${props.title}</h3>
      <br/>

      <p>Precione uma tecla por vez</p>
      <br/>
      <p>Use [Backspace] para remover um comando</p>
      <br/>

      <p>
        <span>Key: </span>

        ${shell(() => {
          const keys = props.keyPressed.get()
          let keysText = ''

          if (!keys.length) {
            keysText = 'none'
          } else {
            keysText = keys.join('+')
          }

          return el/*html*/`
            <span>${keysText}</span>
          `
        })}
      </p>
      <span on-click=${props.onClose}>
        Fechar
      </span>
    </div>
  `
}
