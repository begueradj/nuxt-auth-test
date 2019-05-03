<template>
  <div class="jumbotron">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <div>
            
            <form @submit.prevent="handleSubmit">
              
              <div class="form-group">
                <label for="username">Username</label>
                <input 
                  id="username"
                  v-model="user.username"
                  :class="{ 'is-invalid': submitted && $v.user.username.$error }" 
                  type="text" 
                  name="username" 
                  class="form-control" 
                  @keyup="clearError" >
                <div 
                  v-if="submitted && !$v.user.username.required" 
                  class="invalid-feedback">Username is required</div>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  id="email" 
                  v-model="user.email" 
                  :class="{ 'is-invalid': submitted && $v.user.email.$error }" 
                  type="email" 
                  name="email" 
                  class="form-control"
                  @keyup="clearError" >
                <div 
                  v-if="submitted && $v.user.email.$error" 
                  class="invalid-feedback">
                  <span v-if="!$v.user.email.required">Email is required</span>
                  <span v-if="!$v.user.email.email">Email is invalid</span>
                </div>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  id="password" 
                  v-model="user.password" 
                  :class="{ 'is-invalid': submitted && $v.user.password.$error }" 
                  type="password" 
                  name="password" 
                  class="form-control"
                  @keyup="clearError" >
                <div 
                  v-if="submitted && $v.user.password.$error" 
                  class="invalid-feedback">
                  <span v-if="!$v.user.password.required">Password is required</span>
                  <span v-if="!$v.user.password.minLength">Password must be at least 6 characters</span>
                </div>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                  id="confirmPassword" 
                  v-model="user.confirmPassword" 
                  :class="{ 'is-invalid': submitted && $v.user.confirmPassword.$error }" 
                  type="password" 
                  name="confirmPassword" 
                  class="form-control"
                  @keyup="clearError" >
                <div 
                  v-if="submitted && $v.user.confirmPassword.$error" 
                  class="invalid-feedback">
                  <span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
                  <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
                </div>
              </div>
              <div class="form-group">
                <button 
                  :disabled="$v.$invalid" 
                  class="btn btn-primary">Register</button>
              </div>
            </form>
            <div class="invalid-feedback"> {{ msg }}</div>
            <div v-if="success">Registration successful. <nuxt-link to="/login">Please log in.</nuxt-link></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { EventBus } from '~/event-bus.js'
export default {
  name: 'App',
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      msg: '',
      submitted: false,
      success: false
    }
  },
  mounted() {
    EventBus.$on('error', msg => {
      this.msg = msg.data
    })
    if (this.$auth.loggedIn) {
      this.$auth.logout().then(() => console.log('logged out'))
    }
  },
  validations: {
    user: {
      username: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') }
    }
  },
  methods: {
    async handleSubmit(e) {
      this.submitted = true

      // stop here if form is invalid
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      delete this.user.confirmPassword

      try {
        const res = await this.$axios.post('/auth/local/register', this.user)
        this.success = true
        console.log(res.data)
        EventBus.$emit('debug', `register(): ${JSON.stringify(res.data)}`)
      } catch (e) {
        console.log(e)
        this.success = false
        EventBus.$emit('error', e.response)
        EventBus.$emit(
          'debug',
          `register() error: ${JSON.stringify(e.response.data)}`
        )
      }
    },
    clearError() {
      this.msg = ''
    }
  }
}
</script>

<style>
.invalid-feedback {
  color: red;
  font-size: 10px;
}
.form-group {
  margin-top: 10px;
  height: 35px;
}
</style>
