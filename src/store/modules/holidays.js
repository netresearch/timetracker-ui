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
        commit('holidays', {
          year,
          holidays: axios.get(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${st.toUpperCase()}`).then(
            res => {
              const holidays = {
                getHoliday (date) {
                  if (date instanceof Date) {
                    date = date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2)
                  }
                  return this[date]
                },
                isHoliday (date) {
                  return !!this.getHoliday(date)
                }
              }
              Object.keys(res.data).forEach(title => {
                const holiday = res.data[title]
                if (!holiday.hinweis) {
                  holidays[holiday.datum] = title
                }
              })
              commit('holidays', {year, holidays})
              return holidays
            }
          )
        })
      }
      return state.holidays[year]
    }
  }
}
