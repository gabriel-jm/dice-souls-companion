export function separateDiceRollerEvent() {
  const separatedWindowBtn = document.querySelector('#separatedWindowBtn')!

  separatedWindowBtn.addEventListener('click', () => {
    window.ipcRenderer.send('separate-dice-window')
  })
}
