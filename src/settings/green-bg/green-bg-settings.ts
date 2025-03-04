import './green-bg-settings.css'
import { DataSignal, el, ref, signalRecord } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'
import { UserSettingsService } from '../services/user-settings-service'

export function greenBgSettings(curSetting: DataSignal<string>) {
  const diceRollerEl = document.querySelector('#dice-roller')! as HTMLDivElement
  const dimentions = signalRecord({
    width: Math.floor(screen.width / 2),
    height: Math.floor(screen.height / 2)
  })

  const containerRef = ref()

  dimentions.width.onChange(v => {
    if (!containerRef.el.isConnected) {
      return DataSignal.REMOVE
    }
    
    diceRollerEl.style.setProperty('--width', `${v}px`)
  })

  dimentions.height.onChange(v => {
    if (!containerRef.el.isConnected) {
      return DataSignal.REMOVE
    }

    diceRollerEl.style.setProperty('--height', `${v}px`)
  })

  const nav = () => containerRef.el.classList.add('slide')
  
  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      curSetting.set('main')
    }
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const width = Number((form.elements.namedItem('width')as HTMLInputElement).value)
    const height = Number((form.elements.namedItem('height') as HTMLInputElement).value)

    dimentions.width.set(width)
    dimentions.height.set(height)

    const settingsService = new UserSettingsService()
    settingsService.setGreenBgSettings({
      width: dimentions.width.data(),
      height: dimentions.height.data()
    })
  }

  return el/*html*/`
    <div
      ref=${containerRef}
      on-animationend=${onAnimationEnd}
      class="green-bg-settings"
    >
      <header class="settings-header">
        <span class="void-btn" on-click=${nav}>
          ${chevronLeftIcon()}
        </span>
        <h4 class="settings-title">Fundo Verde</h4>
      </header>

      <form class="green-bg-form" on-submit=${onSubmit}>
        <label>
          <span>Largura</span>
          <div>
            <input
              name="width"
              class="void"
              type="number"
              .value=${dimentions.width}
              max="${screen.width}"
              min="0"
            />
            <span title="Pixels">px</span>
          </div>
        </label>

        <label>
          <span>Altura</span>
          <div>
            <input
              name="height"
              class="void"
              type="number"
              .value=${dimentions.height}
              max="${screen.height}"
              min="0"
            />
            <span title="Pixels">px</span>
          </div>
        </label>

        <div>
          <button class="settings-btn">
            Salvar
          </button>
        </div>
      </form>
    </div>
  `
}