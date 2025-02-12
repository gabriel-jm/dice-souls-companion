export function separateDiceRollerEvent() {
  const separatedWindowBtn = document.querySelector('#separatedWindowBtn')!

  separatedWindowBtn.addEventListener('click', () => {
    window.ipcRenderer.invoke('separate-dice-window')
  })
}
