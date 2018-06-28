import Vue from 'vue'
import Router from 'vue-router'
import Month from '@/pages/Month'
import Settings from '@/pages/Settings'

Vue.use(Router)

export default new Router({
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
