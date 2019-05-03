<template>
  <div>
    <div style="margin-bottom: 30px;">
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/secure">Secure</nuxt-link>
      <nuxt-link to="/secure-2">Secure-2</nuxt-link>
      <nuxt-link 
        v-if="!$auth.$storage.state.loggedIn" 
        to="/register" >Register</nuxt-link>
      <nuxt-link 
        v-if="!$auth.$storage.state.loggedIn" 
        to="/login">Login</nuxt-link>
      
      <span
        v-if="$auth.$storage.state.loggedIn" 
        class="logout" 
        @click="logout">Logout</span>
    </div>
    
    <nuxt/>
    <debug/>
  </div>
</template>

<script>
import Debug from '~/components/Debug'
export default {
  components: {
    Debug
  },
  methods: {
    logout() {
      this.$auth.logout().then(() => console.log('logged out'))
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.logout {
  text-decoration: underline;
}
.logout:hover {
  cursor: pointer;
}
</style>
