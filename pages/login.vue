<template>
  <div style="padding-left: 20px;">
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
</template>

<script>
import { EventBus } from '~/event-bus'
export default {
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
    })
  },
  methods: {
    authenticate() {
      this.$auth
        .loginWith('strapi', {
          data: {
            identifier: this.$refs['identifier'].value,
            password: this.$refs['password'].value
          }
        })
        .then(() => console.log('logged in'))
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
