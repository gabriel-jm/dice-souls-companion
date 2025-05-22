import { DataSignal, el, html, ref, shell, signal } from 'lithen-fns'
import { TargetShortcut } from './shortcuts-settings'
import { shortcutsService } from './shortcuts-service'

type ShortcutDetectorProps = {
  targetShortcut: TargetShortcut
  keyPressed: DataSignal<string[]>
  shortcutInfo: DataSignal<Record<string, { title: string, command: string | null }>>
  onClose(): void
}

export function shortcutDetector(props: ShortcutDetectorProps) {
  const { targetShortcut, keyPressed, shortcutInfo } = props
  const containerRef = ref()
  const feedbackMessage = signal<string| null>(null)

  function closeShortcut() {
    const currentCommand = targetShortcut!.command
    let command: string | null = keyPressed.data().join('+')

    if (!command) {
      command = null
    }

    let servicePromise: Promise<string | null>

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

    servicePromise.then((response) => {
      if (response) {
        feedbackMessage.set(response)
        return
      }

      shortcutInfo.set(map => {
        const key = targetShortcut!.name
        const info = Reflect.get(map, key)
        Reflect.set(map, key, {...info, command })
        return map
      })
      shortcutInfo.update()

      containerRef.el.classList.add('close')
    })
  }

  function close() {
    containerRef.el.classList.add('close')
  }

  function onCloseAnimation(e: AnimationEvent) {
    if (e.animationName === 'bubble-close') {
      props.onClose()
    }
  }

  return html`
    <div
      ref=${containerRef}
      class="shortcut-bubble"
      on-animationend=${onCloseAnimation}
    >
      <h3>Atalho para ${targetShortcut.title}</h3>
      <br/>

      <p>Precione uma tecla por vez</p>
      <br/>
      <p>Use [Backspace] para remover um comando</p>
      <br/>

      <div class="keys-container">
        ${shell(() => {
          const keys = keyPressed.get()

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

      <div class="feedback-container">
        ${shell(() => {
          const message = feedbackMessage.get()
          if (!message) {
            return
          }

          return html`
            <p
              class="msg"
              on-animationend=${() => feedbackMessage.set(null)}
            >${message}</p>
          `
        })}
      </div>

      <span
        class="settings-btn blue wide"
        on-click=${closeShortcut}
      >
        Salvar
      </span>
      <span
        class="settings-btn wide"
        on-click=${close}
      >
        Fechar
      </span>
    </div>
  `
}
