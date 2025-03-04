import './green-bg-settings.css'
import { DataSignal, el, ref } from 'lithen-fns'
import { chevronLeftIcon } from '../../common/icons'
import { GreenBgDimentions } from './green-bg-dimentions'

export function greenBgSettings(curSetting: DataSignal<string>) {
  const containerRef = ref()
  const formRef = ref<HTMLFormElement>()
  const savedMessageRef = ref()
  const dimentions = new GreenBgDimentions()

  dimentions.init()
    .then(() => {
      formRef.el.width.value = dimentions.width
      formRef.el.height.value = dimentions.height
    })

  const nav = () => containerRef.el.classList.add('slide')
  
  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'slide-to-right') {
      containerRef.el.classList.remove('slide')
      curSetting.set('main')
    }
  }

  function onSavedMessageAnimationEnd(e: AnimationEvent) {
    if (e.animationName === 'fade') {
      savedMessageRef.el.classList.remove('show')
    }
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    const width = Number(formRef.el.width.value)
    const height = Number(formRef.el.height.value)

    await dimentions.set(width, height)

    savedMessageRef.el.classList.add('show')
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
        <h4 class="settings-title green-bg-title">
          Fundo Verde
        </h4>
      </header>

      <form
        ref=${formRef}
        class="green-bg-form"
        on-submit=${onSubmit}
      >
        <label>
          <span>Largura</span>
          <div>
            <input
              name="width"
              class="void"
              type="number"
              value=${dimentions.width}
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
              value=${dimentions.height}
              max="${screen.height}"
              min="0"
            />
            <span title="Pixels">px</span>
          </div>
        </label>

        <div class="to-right-container">
          <span
            ref=${savedMessageRef}
            class="saved-message"
            on-animationend=${onSavedMessageAnimationEnd}
          >
            Salvo!
          </span>
          <button class="settings-btn">
            Salvar
          </button>
        </div>
      </form>
    </div>
  `
}
