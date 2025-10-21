import { defineStore } from 'pinia'
import axios from 'axios'
import { pad } from '../plugins/format'
import { useConfigStore } from './config'

class Holidays {
  getHoliday(date) {
    if (date instanceof Date) {
      date = date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2)
    }
    return this[date]
  }

  isHoliday(date) {
    return !!this.getHoliday(date)
  }
}

export const useHolidaysStore = defineStore('holidays', {
  state: () => ({
    holidays: {}
  }),
  actions: {
    async load(payload) {
      const configStore = useConfigStore()
      const year = payload.year || new Date().getFullYear()
      const st = configStore.state
      
      if (!st) {
        throw new Error('State needs to be configured')
      }
      
      if (!this.holidays[year]) {
        const holidays = new Holidays()
        
        try {
          const res = await axios.get(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${st.toUpperCase()}`)
          Object.keys(res.data).forEach(title => {
            const holiday = res.data[title]
            if (!holiday.hinweis) {
              holidays[holiday.datum] = title
            }
          })
        } catch (ftaErr) {
          try {
            const res = await axios.get(`https://ipty.de/feiertag/api.php?do=getFeiertage&loc=${st.toUpperCase()}&jahr=${year}&outformat=Y-m-d`)
            res.data.forEach(holiday => {
              holidays[holiday.date] = holiday.title
            })
          } catch (iptyErr) {
            console.error('Could not load holidays', ftaErr, iptyErr)
          }
        }
        
        this.holidays[year] = holidays
      }
      
      return this.holidays[year]
    }
  }
})


