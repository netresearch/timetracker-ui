import { defineStore } from 'pinia'
import { axiosInstance as request } from './request'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null,
    id: null,
    isLoggedIn: true
  }),
  actions: {
    async loadUser() {
      const res = await request.get('getUsers')
      this.info = res.data[0].user
      this.id = res.data[0].user.id
      this.isLoggedIn = true
    },
    async login(userdata) {
      const form = new FormData()
      form.append('username', userdata.username)
      form.append('password', userdata.password)
      form.append('loginCookie', 'on')

      try {
        await request.post('login', form, {
          maxRedirects: 0,
          skipLoginInterceptor: true,
          validateStatus: (status) => status >= 200 && status < 400,
          headers: {
            Accept: 'text/html',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        await this.checkLogin()
        await this.loadUser()
      } catch (err) {
        console.error('Login error:', err.response && err.response.status, err.message)
        await this.checkLogin()
      }
    },
    async logout() {
      await request.get('logout')
      location.reload(true)
    },
    async checkLogin() {
      const res = await request.get('status/check', { skipLoginInterceptor: true })
      this.isLoggedIn = res.data.loginStatus
      if (!res.data.loginStatus) {
        this.info = null
        this.id = null
      }
    }
  },
  persist: {
    paths: ['info', 'id', 'isLoggedIn']
  }
})


