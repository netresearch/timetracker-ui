import { defineStore } from 'pinia'
import { useConfigStore } from './config'

function isValidHours(hours) {
  return hours !== undefined && hours !== null
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    hoursPerDay: {}
  }),
  getters: {
    getHoursPerDay: (state) => {
      const configStore = useConfigStore()
      return (day) => {
        const hours = state.hoursPerDay['d_' + day]
        return isValidHours(hours) ? hours : configStore.defaultHoursPerDay
      }
    },
    hoursPerDayAll: (state) => {
      const configStore = useConfigStore()
      const hoursPerDay = {}
      for (let i = 1; i < 6; i++) {
        const hours = state.hoursPerDay['d_' + i]
        hoursPerDay['d_' + i] = isValidHours(hours) ? hours : configStore.defaultHoursPerDay
      }
      return hoursPerDay
    }
  },
  actions: {
    setHoursPerDay(hoursPerDay) {
      this.hoursPerDay = Object.keys(hoursPerDay).reduce((h, d) => {
        h[d] = parseInt(hoursPerDay[d])
        return h
      }, {})
    }
  },
  persist: {
    paths: ['hoursPerDay']
  }
})


