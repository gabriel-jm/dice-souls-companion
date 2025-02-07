type ServerRollResultData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export type SetCurrentRollResultData = ServerRollResultData

export class RollResultService {
  async getCurrent() {
    const response = await fetch('http://localhost:3500/current?type=json')

    if (response.status > 300) {
      return null
    }

    return response.json() as Promise<ServerRollResultData>
  }

  async setCurrent(data: SetCurrentRollResultData) {
    const response = await fetch('http://localhost:3500/current', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    return response.status < 300
  }
}
