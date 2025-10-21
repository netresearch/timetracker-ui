import axios from 'axios'
import store from '.'

const ttAxios = axios.create()

ttAxios.interceptors.response.use(res => res, error => {
  if (error.response.config.skipLoginInterceptor) {
    return Promise.reject(error)
  }
  return store.dispatch('user/checkLogin').then(() => {
    if (store.state.user.isLoggedIn) {
      // User is logged in - this is not a login related error
      return Promise.reject(error)
    }
    return new Promise(resolve => {
      store.commit('user/isLoggedIn', false)
      const unsubscribe = store.subscribe((mutation, state) => {
        if (state.user.isLoggedIn) {
          unsubscribe()
          const config = {...error.response.config}
          // Keep the baseURL so retried requests go to the right endpoint
          ttAxios.request(config).then(resolve)
        }
      })
    })
  })
})

export default ttAxios
