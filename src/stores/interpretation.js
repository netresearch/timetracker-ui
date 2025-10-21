import { defineStore } from 'pinia'
import { axiosInstance as request } from './request'
import { useUserStore } from './user'

export const useInterpretationStore = defineStore('interpretation', {
  actions: {
    async loadEntries(payload) {
      const userStore = useUserStore()
      const res = await request.get(`interpretation/entries?month=${payload.month}&year=${payload.year}&user=${userStore.id}`)
      return res.data.map(e => e.entry)
    },
    async loadTimes(payload) {
      const userStore = useUserStore()
      const res = await request.get(`interpretation/time?month=${payload.month}&year=${payload.year}&limit=100&user=${userStore.id}`)
      return res.data
    }
  }
})


