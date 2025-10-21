import { createRouter, createWebHashHistory } from 'vue-router'
import Month from '@/pages/Month.vue'
import Settings from '@/pages/Settings.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/month'
    },
    {
      path: '/month',
      name: 'month',
      component: Month
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router
