import axios from 'axios'
import {pad} from '../../plugins/format'

export default {
  namespaced: true,
  state: {
    holidays: {}
  },
  mutations: {
    holidays (state, payload) {
      state.holidays[payload.year] = payload.holidays
    }
  },
  actions: {
    load ({state, commit, rootState}, payload) {
      const year = payload.year || new Date().getFullYear()
      const st = rootState.config.state
      if (!st) {
        throw new Error('State needs to be configured')
      }
      if (!state.holidays[year]) {
        const holidays = new Holidays()
        commit('holidays', {
          year,
          holidays: axios.get(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${st.toUpperCase()}`).then(
            res => Object.keys(res.data).forEach(title => {
              const holiday = res.data[title]
              if (!holiday.hinweis) {
                holidays[holiday.datum] = title
              }
            }),
            ftaErr => axios.get(`https://ipty.de/feiertag/api.php?do=getFeiertage&loc=${st.toUpperCase()}&jahr=${year}&outformat=Y-m-d`).then(
              res => res.data.forEach(holiday => {
                holidays[holiday.date] = holiday.title
              }),
              iptyErr => console.error('Could not load holidays', ftaErr, iptyErr)
            )
          ).then(() => {
            commit('holidays', {year, holidays})
            return holidays
          })
        })
      }
      return state.holidays[year]
    }
  }
}

class Holidays {
  getHoliday (date) {
    if (date instanceof Date) {
      date = date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2)
    }
    return this[date]
  }

  isHoliday (date) {
    return !!this.getHoliday(date)
  }
}
