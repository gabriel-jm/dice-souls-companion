function addDie() {
  const audio = new Audio('/sfx/add-die.wav')
  audio.play()
}

function removeDie() {
  const audio = new Audio('/sfx/remove-die.wav')
  audio.volume = 0.8
  audio.play()
}

function throwDice() {
  const audio = new Audio('/sfx/throw-dice.wav')
  audio.volume = 0.8
  audio.play()
}

export const diceSfx = {
  addDie,
  removeDie,
  throwDice
}
