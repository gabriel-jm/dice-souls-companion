import { DataSignal, el, html, ref, shell } from 'lithen-fns'

type ShortcutDetectorProps = {
  title: string
  keyPressed: DataSignal<string[]>
  onClose(saved: boolean): void
}

export function shortcutDetector(props: ShortcutDetectorProps) {
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
