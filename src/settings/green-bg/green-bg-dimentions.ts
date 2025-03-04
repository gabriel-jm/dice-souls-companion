import { UserSettingsService } from '../services/user-settings-service'

export class GreenBgDimentions {
  diceRollerEl: HTMLDivElement
  width = Math.floor(screen.width / 2)
  height = Math.floor(screen.height / 2)
  settingsService = new UserSettingsService()
  
  constructor() {
    this.diceRollerEl = document.querySelector('#dice-roller')!
  }

  async init() {
    const { greenBg } = await this.settingsService.getUserSettings()

    if (greenBg.width && greenBg.height) {
      this.width = greenBg.width
      this.height = greenBg.height

      return this.set(greenBg.width, greenBg.height)
    }
  }

  set(width: number, height: number) {
    this.width = width
    this.height = height

    this.#setStyleProp('width', width)
    this.#setStyleProp('height', height)

    return this.settingsService.setGreenBgSettings({ width, height })
  }

  #setStyleProp(name: string, value: number) {
    this.diceRollerEl.style.setProperty(`--${name}`, `${value}px`)
  }
}
