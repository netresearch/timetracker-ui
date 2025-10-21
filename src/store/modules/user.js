import request from '../request'

export default {
  namespaced: true,
  state: {
    info: null,
    id: null,
    isLoggedIn: true
  },
  mutations: {
    user (state, user) {
      state.info = user
      state.id = user.id
      state.isLoggedIn = !!user
    },
    isLoggedIn (state, isLoggedIn) {
      state.isLoggedIn = !!isLoggedIn
      if (!isLoggedIn) {
        state.info = null
        state.id = null
      }
    }
  },
  actions: {
    loadUser ({commit}) {
      return request.get('getUsers').then(res => {
        commit('user', res.data[0].user)
      })
    },
    login ({dispatch}, userdata) {
      const form = new FormData()
      form.append('username', userdata.username)
      form.append('password', userdata.password)
      form.append('loginCookie', 'on')

      return request.post('login', form, {
        maxRedirects: 0,
        skipLoginInterceptor: true,
        validateStatus: (status) => status >= 200 && status < 400, // Accept redirects as success
        headers: {
          Accept: 'text/html',
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
        .then(() => dispatch('checkLogin'))
        .then(() => dispatch('loadUser')) // Load user data after successful login
        .catch((err) => {
          console.error('Login error:', err.response && err.response.status, err.message)
          return dispatch('checkLogin')
        })
    },
    logout () {
      request.get('logout').then(() => location.reload(true))
    },
    checkLogin ({commit}) {
      return request.get('status/check', {skipLoginInterceptor: true}).then(
        (res) => {
          commit('isLoggedIn', res.data.loginStatus)
        }
      )
    }
  }
}
