import './shortcuts-settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'
import { SettingsDialogConfig } from '../settings-dialog'

export function shortcutsSettings(config: SettingsDialogConfig) {
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
        <div
          class="shortcut-item"
          on-click=${() => enableShortcutDetect('+1 Dado Vermelho')}
        >
          <p>+1 Dado Vermelho</p>
          <div>
            Clique para adicionar um atalho
          </div>
        </div>
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
