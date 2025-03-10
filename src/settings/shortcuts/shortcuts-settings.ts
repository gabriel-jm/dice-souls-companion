import './shortcuts-settings.css'
import { DataSignal, el, ref } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'

export function shortcutsSettings(curSetting: DataSignal<string>) {
  const containerRef = ref()

  const nav = () => containerRef.el.classList.add('slide')

  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      curSetting.set('main')
    }
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

      <div>
        Teste
      </div>
    </div>
  `
}
