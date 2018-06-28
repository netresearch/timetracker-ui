<template>
  <div id="app">
    <login v-if="!isLoggedIn"></login>
    <template v-else-if="$store.state.user.id">
      <b-navbar class="mb-4" toggleable="md" type="dark" variant="info">
        <b-navbar-brand to="/">TimeTracker Stats</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item to="/month">Month report</b-nav-item>
          <b-nav-item to="/settings">Settings</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="$store.dispatch('user/logout')">Logout {{$store.state.user.info.abbr}}</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <router-view/>
    </template>
  </div>
</template>

<script>
import Login from './components/Login'
import {mapState} from 'vuex'

export default {
  components: {Login},
  computed: mapState('user', ['isLoggedIn']),
  created () {
    this.$store.dispatch('user/loadUser')
  }
}
</script>

<style lang="scss">
  @import "~scss/app";
</style>
