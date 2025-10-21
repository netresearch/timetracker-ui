<template>
  <div id="app">
    <Login v-if="!userStore.isLoggedIn" />
    <template v-else-if="userStore.id">
      <nav class="navbar navbar-expand-md navbar-dark bg-info mb-4">
        <div class="container-fluid">
          <router-link
            class="navbar-brand"
            to="/"
          >
            TimeTracker Stats
          </router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div
            id="navbarNav"
            class="collapse navbar-collapse"
          >
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  to="/month"
                >
                  Month report
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  to="/settings"
                >
                  Settings
                </router-link>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="#"
                  @click.prevent="userStore.logout"
                >
                  Logout {{ userStore.info?.abbr }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Login from './components/Login.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.loadUser()
})
</script>

<style lang="scss">
@import "@/assets/scss/app";
</style>
