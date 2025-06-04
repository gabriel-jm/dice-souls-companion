import { blackDieEffects, redDieEffects } from '../dice-master/dice-effects'
import { Profile } from './profile-service'

export const defaultProfile: Profile = {
  id: 'none',
  name: 'Padrão',
  redEffects: redDieEffects,
  blackEffects: blackDieEffects,
  blueEffects: ['Remove um Efeito PERMANENTE (D20 Vermelho) já ativo']
}
