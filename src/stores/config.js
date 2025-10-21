import { defineStore } from 'pinia'
import axios from 'axios'
import { axiosInstance } from './request'

export const useConfigStore = defineStore('config', {
  state: () => ({
    state: null,
    timetrackerUrl: null,
    defaultHoursPerDay: null
  }),
  actions: {
    async load() {
      const res = await axios.get('/config.json')
      const config = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      this.state = config.state
      this.timetrackerUrl = config.timetrackerUrl
      this.defaultHoursPerDay = config.defaultHoursPerDay
      
      // Update axios baseURL
      axiosInstance.defaults.baseURL = config.timetrackerUrl.replace(/\/+$/, '') + '/'
    }
  }
})


