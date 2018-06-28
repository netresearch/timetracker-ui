import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

import config from './modules/config'
import user from './modules/user'
import holidays from './modules/holidays'
import interpretation from './modules/interpretation'
import settings from './modules/settings'

import * as shvl from 'shvl'

const modules = {
  config,
  user,
  holidays,
  interpretation,
  settings
}

const paths = []
const filters = {}
Object.keys(modules).forEach(name => {
  const module = modules[name]
  if (module.persist) {
    if (typeof module.persist === 'string' || Array.isArray(module.persist)) {
      (module.persist === '*' ? Object.keys(module.state) : module.persist).forEach(key => {
        paths.push(name + '.' + key)
      })
    } else {
      Object.keys(module.persist).forEach(key => {
        if (key === '*') {
          Object.keys(module.state).forEach(k => {
            filters[name + '.' + k] = (value, state) => module.persist[key]({rootState: state, state: state[name]}, value, k)
          })
        } else {
          filters[name + '.' + key] = (value, state) => module.persist[key]({rootState: state, state: state[name]}, value)
        }
      })
    }
  }
})
Object.keys(filters).forEach(path => {
  if (paths.indexOf(path) < 0) {
    paths.push(path)
  }
})

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const plugins = []
if (debug) {
  plugins.push(createLogger())
}
if (paths.length) {
  plugins.push(createPersistedState({
    paths,
    reducer: (state, paths) => paths.reduce((substate, path) => {
      const value = shvl.get(state, path)
      if (!filters[path] || filters[path](value, state)) {
        shvl.set(substate, path, value)
      }
      return substate
    }, {})
  }))
}

export default new Vuex.Store({
  modules,
  strict: debug,
  plugins
})
