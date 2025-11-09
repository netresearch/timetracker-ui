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
        <h1 class="h5 mb-0">
          Please login
        </h1>
      </div>
      <div class="card-body">
        <!-- Error alerts with proper ARIA roles -->
        <div 
          v-if="wrong" 
          class="alert alert-danger alert-dismissible fade show" 
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>Login failed</strong> - please check your credentials and try again
          <button 
            type="button" 
            class="btn-close" 
            aria-label="Close alert"
            @click="wrong = false"
          />
        </div>
        <div 
          v-if="failed" 
          class="alert alert-danger" 
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>Error:</strong> Something went wrong during login
        </div>

        <!-- Username field -->
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >
            User name <span
              class="text-danger"
              aria-label="required"
            >*</span>
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            name="username"
            autocomplete="username"
            aria-required="true"
            aria-describedby="username-help"
            required
            :aria-invalid="wrong ? 'true' : 'false'"
          >
          <div
            id="username-help"
            class="form-text visually-hidden"
          >
            Enter your timetracker username
          </div>
        </div>

        <!-- Password field -->
        <div class="mb-3">
          <label
            for="password"
            class="form-label"
          >
            Password <span
              class="text-danger"
              aria-label="required"
            >*</span>
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            name="password"
            autocomplete="current-password"
            aria-required="true"
            aria-describedby="password-help"
            required
            :aria-invalid="wrong ? 'true' : 'false'"
          >
          <div
            id="password-help"
            class="form-text visually-hidden"
          >
            Enter your timetracker password
          </div>
        </div>

        <!-- Submit button with proper labeling -->
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!username || !password"
          :aria-busy="isLoading ? 'true' : 'false'"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>
            <span
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Logging in...
          </span>
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
const isLoading = ref(false)

async function handleLogin() {
  wrong.value = false
  failed.value = false
  isLoading.value = true
  
  try {
    await userStore.login({ username: username.value, password: password.value })
    wrong.value = !userStore.isLoggedIn
  } catch (error) {
    console.error(error)
    failed.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/components/login";

// Ensure sufficient color contrast for WCAG AA
.alert {
  // Bootstrap 5 already meets WCAG AA contrast ratios
}

// Focus indicators for keyboard navigation
.form-control:focus,
.btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

// High contrast mode support
@media (prefers-contrast: high) {
  .btn-primary {
    border-width: 2px;
  }
}
</style>
