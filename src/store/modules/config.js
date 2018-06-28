import axios from 'axios'
import request from '../request'

export default {
  namespaced: true,
  state: {
    state: null,
    timetrackerUrl: null,
    defaultHoursPerDay: null
  },
  mutations: {
    config (state, config) {
      Object.assign(state, config)
      request.defaults.baseURL = config.timetrackerUrl.replace(/\/+$/, '') + '/'
    }
  },
  actions: {
    load ({commit}) {
      return axios.get('/static/config.json').then(res => {
        commit('config', typeof res.data === 'string' ? JSON.parse(res.data) : res.data)
      })
    }
  }
}
