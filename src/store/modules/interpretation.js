import request from '../request'

export default {
  namespaced: true,
  actions: {
    loadEntries ({rootState}, payload) {
      return request.get(`interpretation/entries?month=${payload.month}&year=${payload.year}&user=${rootState.user.id}`)
        .then(res => res.data.map(e => e.entry))
    }
  }
}
