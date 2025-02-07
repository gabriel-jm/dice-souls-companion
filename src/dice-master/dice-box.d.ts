declare module '@3d-dice/dice-box' {
  export type DiceBoxConfig = {
    assetPath: string

    /**
     * A query selector for the DOM element to place
     * the dice box canvas in.
     * 
     * @default `document.body`
     */
    container: string
    
    /** Sets the ID of the canvas element. @default 'dice-canvas' */
    id?: string

    /**
     * Sets the site origin used for constructing paths to assets.
     * 
     * @default location.origin
     */
    origin?: string

    /**
     * Too much gravity will cause the dice to jitter.
     * Too little and they take much longer to settle.
     * 
     * @default 1
     */
    gravity?: number

    /**
     * The mass of the dice.
     * Affects how forces act on the dice such as spin.
     * 
     * @default 1
     */
    mass?: number

    /**
     * The friction of the dice and the surface they roll on.
     * 
     * @default 0.8
     */
    friction?: number

    /** The bounciness of the dice. @default 0 */
    restitution?: number

    /**
     * Determines how quickly the dice lose their
     * spin (angular momentum).
     * 
     * @default 0.4
     */
    angularDamping?: number

    /**
     * Determines how quickly the dice lose their
     * linear momentum.
     * @default 0.4
     */
    linearDamping?: number

    /** The maximum amount of spin the dice may have. @default 4 */
    spinForce?: number

    /** The maximum amount of throwing force used. @default 5 */
    throwForce?: number

    /** The height at which the toss begins. @default 8 */
    startingHeight?: number

    /** Time in ms before a die is stopped from moving. @default 5000 */
    settleTimeout?: number

    /** If offscreenCanvas is available it will be used. @default true */
    offscreen?: boolean

    /**
     * The delay between dice being generate. If they're
     * all generated at the same time they instantly
     * collide with each other which doesn't look very
     * natural.
     * 
     * @default 10
     */
    delay?: number

    /** Global illumination levels. @default 1 */
    lightIntensity?: number

    /**
     * Do the dice cast a shadow?
     * Turn off for a performance bump.
     * 
     * @default true
     */
    enableShadows?: boolean

    /**
     * Set the transparency of the shadows cast by the dice.
     * 
     * @default 0.8
     */
    shadowTransparency?: number

    /**
     * @default 'default'
     */
    theme?: string

    /**
     * Some themes allow for a configurable
     * base color as a HEX value.
     * 
     * @default '#2e8555'
     */
    themeColor?: string

    /**
     * Options are best between 2-9. The higher the
     * number the larger the dice. Accepts decimal numbers.
     * 
     * @default 6
     */
    scale?: number
  }

  export type RollOptions = {
    theme?: string
    themeColor?: string
    newStartPoint?: boolean
  }

  export type DieRollResult = {
    groupId: number
    rollId: number
    sides: number
    theme: string
    themeColor: string
    value: number
  }

  export type DiceGroupRollResult = {
    id: number
    mods: unknown[]
    qty: number
    rolls: DieRollResult[]
    sides: number
    theme: string
    themeColor: string
    value: number
  }

  class DiceBox {
    constructor(config: DiceBoxConfig)
    init(): Promise<void>
    roll(diceString: string, options?: RollOptions): void
    add(diceString: string, options?: RollOptions): Promise<DiceGroupRollResult[]>
    clear(): void
  }
  
  export default DiceBox
}
