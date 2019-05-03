<template>
  <div style="padding-left: 20px;">
    <div v-if="!$auth.$storage.state.loggedIn" >
      <!-- <a @click.prevent="authenticate">Login here</a> -->
      Username: <input 
        ref="identifier" 
        type="text"
        @keyup="clearError"><br>
      Password? <input 
        ref="password" 
        type="password">
      <br>
      <input 
        type="submit" 
        @click.prevent="authenticate">
      <div style="font-size: 12px; color: red; margin-top: 25px">{{ msg }}</div>
    </div>
    <div v-if="$auth.$storage.state.loggedIn">
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { EventBus } from '~/event-bus'
export default {
  name: 'Login',
  data() {
    return {
      msg: null
    }
  },
  created() {
    // this.$auth.logout().then(() => console.log('logged out'))
  },
  mounted() {
    EventBus.$on('error', msg => {
      this.msg = msg
      console.log('error: ', msg)
    })
  },
  methods: {
    authenticate() {
      this.$auth.loginWith('strapi', {
        data: {
          identifier: this.$refs['identifier'].value,
          password: this.$refs['password'].value
        }
      })
    },
    logout() {
      this.$auth.logout().then(() => console.log('logged out'))
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
