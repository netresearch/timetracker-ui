<template>
  <b-form class="login" @submit="login">
    <b-card header="Please login">
      <b-alert :show="wrong" fade variant="danger">
        Login failed - please check your credentials and try again
      </b-alert>
      <b-alert :show="failed" variant="danger">Oops - something went wrong during login</b-alert>

      <b-form-group label="User name:"
                    label-for="username">
        <b-form-input id="username"
                      type="text"
                      v-model="username"
                      required>
        </b-form-input>
      </b-form-group>

      <b-form-group label="Password:"
                    label-for="password">
        <b-form-input id="passsword"
                      type="password"
                      v-model="password"
                      required>
        </b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Login</b-button>
    </b-card>
  </b-form>
</template>

<style lang="scss">
  @import "~scss/components/login";
</style>

<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      loginCookie: 'on',
      failed: false,
      wrong: false
    }
  },
  methods: {
    login () {
      this.wrong = false
      this.failed = false
      this.$store.dispatch('user/login', this).then(
        () => {
          this.wrong = !this.$store.state.user.isLoggedIn
        },
        (error) => {
          console.error(error)
          this.failed = true
        }
      )
    }
  }
}
</script>
