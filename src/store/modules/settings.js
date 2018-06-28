function isValidHours (hours) {
  return hours !== undefined && hours !== null
}

export default {
  namespaced: true,
  state: {
    hoursPerDay: {}
  },
  getters: {
    getHoursPerDay (state, getters, rootState) {
      return function (day) {
        const hours = state.hoursPerDay['d_' + day]
        return isValidHours(hours) ? hours : rootState.config.defaultHoursPerDay
      }
    },
    hoursPerDay (state, getters) {
      const getHoursPerDay = getters.getHoursPerDay
      const hoursPerDay = {}
      for (let i = 1; i < 6; i++) {
        hoursPerDay['d_' + i] = getHoursPerDay(i)
      }
      return hoursPerDay
    }
  },
  mutations: {
    hoursPerDay (state, hoursPerDay) {
      state.hoursPerDay = Object.keys(hoursPerDay).reduce((h, d) => {
        h[d] = parseInt(hoursPerDay[d])
        return h
      }, {})
    }
  },
  persist: [1, 2, 3, 4, 5].reduce(function (persisters, day) {
    persisters['hoursPerDay.d_' + day] = function ({state, rootState}, hours) {
      return isValidHours(hours) && hours !== rootState.config.defaultHoursPerDay
    }
    return persisters
  }, {})
}
