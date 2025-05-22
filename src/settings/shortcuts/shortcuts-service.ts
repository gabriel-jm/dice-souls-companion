export type Shortcut = {
  id: string
  name: string
  command: string | null
}

export type AddShortcut = {
  name: string
  oldCommand: string | null
  command: string | null
}

async function getShortcuts(shortcutInfo: Record<string, { command: string | null }>) {
  const response = await window.ipcRenderer.invoke('get-shortcuts')
  const shortcuts = response as Shortcut[]

  for (const { name, command } of shortcuts) {
    const info = Reflect.get(shortcutInfo, name)

    if (info && command) {
      info.command = command
    }
  }
}

function addShortcut(data: AddShortcut): Promise<string | null> {
  return window.ipcRenderer.invoke('add-shortcut', data)
}

function removeShortcut(data: Omit<Shortcut, 'id'>): Promise<string | null> {
  return window.ipcRenderer.invoke('remove-shortcut', data)
}

export const shortcutsService = {
  getShortcuts,
  addShortcut,
  removeShortcut
}
