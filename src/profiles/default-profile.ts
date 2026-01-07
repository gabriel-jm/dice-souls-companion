import { blackDieEffects, redDieEffects } from '../dice-master/dice-effects'
import { Profile } from './profile-service'

export const defaultProfile: Profile = {
  id: 'none',
  name: 'Padrão',
  redEffects: { type: 'd20', effects: redDieEffects },
  blackEffects: { type: 'd20', effects: blackDieEffects },
  blueEffects: {
    type: 'd20',
    effects: ['Remove um Efeito PERMANENTE (D20 Vermelho) já ativo']
  }
}
