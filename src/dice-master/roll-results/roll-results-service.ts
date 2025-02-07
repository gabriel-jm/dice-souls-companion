export type SetCurrentRollResultData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export class RollResultService {
  async setCurrent(data: SetCurrentRollResultData) {
    const response = await fetch('http://localhost:3500/current', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    return response.status < 300
  }
}
