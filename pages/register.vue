<template>
  <div>
    <h1>Register</h1>
    Username: <input 
      ref="username" 
      type="text"
      @keyup="clearError"><br>
    Email: <input 
      ref="email" 
      type="text"
      @keyup="clearError"
    ><br>
    Password: <input 
      ref="password" 
      type="password"
      @keyup="clearError">
    <br>
    Confirm password: <input 
      ref="password_confirm" 
      type="password"
      @keyup="clearError">
    <br>
    <input 
      :disabled="success"
      type="submit"
      @click.prevent="register">
    <div style="font-size: 12px; color: red; margin-top: 25px">{{ msg }}</div>
    <div 
      v-if="success" 
      style="margin-top: 25px; color: green">Registration successful. <nuxt-link to="/login">Please login.</nuxt-link></div>
  </div>
  
</template>

<script>
import { EventBus } from '~/event-bus'
export default {
  data() {
    return {
      msg: '',
      success: false
    }
  },
  mounted() {
    EventBus.$on('error', msg => {
      this.msg = msg.message
    })
    this.$auth.logout().then(() => console.log('logged out'))
  },
  methods: {
    async register() {
      const username = this.$refs['username'].value
      const email = this.$refs['email'].value
      const password = this.$refs['password'].value
      const password_confirm = this.$refs['password_confirm'].value
      console.log(username, email, password)
      if (password !== password_confirm) {
        this.msg = "Passwords don't match. Try again."
        return
      }
      const payload = {}
      payload.username = username
      payload.email = email
      payload.password = password
      try {
        const res = await this.$axios.post('/auth/local/register', payload)
        this.success = true
      } catch (e) {
        console.log(e.response)
        EventBus.$emit('error', e.response.data)
      }
    },
    clearError() {
      if (this.msg) {
        this.msg = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
