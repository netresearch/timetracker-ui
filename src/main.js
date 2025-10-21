import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import Format from './plugins/format'
import { useConfigStore } from './stores/config'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/scss/app.scss'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Format)

// Global log helper
app.config.globalProperties.$log = (...values) => {
  console.log(...values)
  return values[0]
}

// Load config before mounting
const configStore = useConfigStore()
configStore.load().then(() => {
  app.mount('#app')
})
