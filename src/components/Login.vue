<template>
  <form
    class="login container mt-5"
    @submit.prevent="handleLogin"
  >
    <div
      class="card mx-auto"
      style="max-width: 400px;"
    >
      <div class="card-header">
        Please login
      </div>
      <div class="card-body">
        <div
          v-if="wrong"
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Login failed - please check your credentials and try again
          <button
            type="button"
            class="btn-close"
            @click="wrong = false"
          />
        </div>
        <div
          v-if="failed"
          class="alert alert-danger"
          role="alert"
        >
          Oops - something went wrong during login
        </div>

        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >User name:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            required
          >
        </div>

        <div class="mb-3">
          <label
            for="password"
            class="form-label"
          >Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          >
        </div>

        <button
          type="submit"
          class="btn btn-primary"
        >
          Login
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const username = ref('')
const password = ref('')
const failed = ref(false)
const wrong = ref(false)

async function handleLogin() {
  wrong.value = false
  failed.value = false
  
  try {
    await userStore.login({ username: username.value, password: password.value })
    wrong.value = !userStore.isLoggedIn
  } catch (error) {
    console.error(error)
    failed.value = true
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/components/login";
</style>
