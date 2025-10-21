import axios from 'axios'
import { useUserStore } from './user'

export const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.config?.skipLoginInterceptor) {
      return Promise.reject(error)
    }
    
    const userStore = useUserStore()
    await userStore.checkLogin()
    
    if (userStore.isLoggedIn) {
      // User is logged in - this is not a login related error
      return Promise.reject(error)
    }
    
    // Wait for login
    return new Promise(resolve => {
      userStore.isLoggedIn = false
      const unwatch = userStore.$subscribe((mutation, state) => {
        if (state.isLoggedIn) {
          unwatch()
          const config = {...error.response.config}
          // Keep the baseURL for retried requests
          axiosInstance.request(config).then(resolve)
        }
      })
    })
  }
)

export default axiosInstance


