import './shortcuts-settings.css'
import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'
import { SettingsDialogConfig } from '../settings-dialog'

export function shortcutsSettings(config: SettingsDialogConfig) {
  const containerRef = ref()

  const nav = () => containerRef.el.classList.add('slide')

  const listeningKeyPress = signal(false)
  const keyPressed = signal<string[]>([])

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      config.currentSetting.set('main')
    }
  }

  function enableShortcutDetect() {
    listeningKeyPress.set(true)
    config.keepOpen = true

    const handler = (e: KeyboardEvent) => {
      e.preventDefault()

      let key = ''

      if (e.ctrlKey) {
        key += 'Ctrl+'
      }

      if (e.shiftKey) {
        key += 'Shift+'
      }

      key += e.key

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
        <div class="shortcut-item" on-click=${enableShortcutDetect}>
          <p>+1 Dado Vermelho</p>
          <div>
            Clique para adicionar um atalho
          </div>
        </div>

        ${shell(() => {
          if (!listeningKeyPress.get()) {
            return
          }

          return html`
            <div class="shortcut-bubble">
              <p>Atalho para +1 Dado Vermelho</p>

              <p>
                <span>Key: </span>

                ${shell(() => {
                  const keys = keyPressed.get()
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
              <span
                on-click=${() => {
                  listeningKeyPress.set(false)
                  config.keepOpen = false
                }}
              >
                Fechar
              </span>
            </div>
          `
        })}
      </div>
    </div>
  `
}
