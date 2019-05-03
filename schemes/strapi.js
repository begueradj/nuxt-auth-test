import { EventBus } from '~/event-bus'

export default class LocalScheme {
  constructor(auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
  }

  _setToken(token) {
    if (this.options.globalToken) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
      EventBus.$emit('debug', ` _setToken(): ${token}`)
    }
  }

  _clearToken() {
    if (this.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
      EventBus.$emit('debug', ` _clearToken(): ${this.options.tokenName}`)
    }
  }

  mounted() {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
      EventBus.$emit('debug', ` mounted() => this._setToken(${token})`)
    }
    EventBus.$emit('debug', ` mounted() => this.$auth.fetchUserOnce()`)
    return this.$auth.fetchUserOnce()
  }

  async login(endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()
    try {
      const result = await this.$auth.request(
        endpoint,
        this.options.endpoints.login
      )
      EventBus.$emit('debug', `login(): ${result}`)
      if (this.options.tokenRequired) {
        const token = this.options.tokenType
          ? this.options.tokenType + ' ' + result
          : result

        this.$auth.setToken(this.name, token)
        this._setToken(token)
      }

      return this.fetchUser()
    } catch (e) {
      EventBus.$emit('error', e.response.data)
      EventBus.$emit('debug', `Error: ${JSON.stringify(e.response.data)}`)
      console.log(e.response.data.message)
    }
  }

  async setUserToken(tokenValue) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + tokenValue
        : tokenValue

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }
    EventBus.$emit('debug', `setUserToken(): ${token}`)
    return this.fetchUser()
  }

  async fetchUser(endpoint) {
    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // Try to fetch user and then set
    try {
      const user = await this.$auth.requestWith(
        this.name,
        endpoint,
        this.options.endpoints.user
      )
      this.$auth.setUser(user)
      EventBus.$emit('debug', `fetchUser(): ${JSON.stringify(user)}`)
    } catch (e) {
      EventBus.$emit('debug', `fetchUser() error: ${e}`)
    }
  }

  async logout(endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {})
    }

    // But logout locally regardless
    return this._logoutLocally()
  }

  async _logoutLocally() {
    if (this.options.tokenRequired) {
      this._clearToken()
    }
    EventBus.$emit('debug', '_logoutLocally() => this.$auth.reset()')
    return this.$auth.reset()
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization'
}
