// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import VueMoment from 'vue-moment'
import Format from './plugins/format'

Vue.use(BootstrapVue)
Vue.use(VueMoment)
Vue.use(Format)

Vue.config.productionTip = false
Vue.prototype.$log = (...values) => {
  console.log(...values)
  return values[0]
}

store.dispatch('config/load').then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
  })
})
