const pkg = require('./package')
require('dotenv').config()
// console.log(process.env.NUXT_ENV_BASE_URL)

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  axios: {
    baseURL: process.env.NUXT_ENV_BASE_URL
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth'],
  auth: {
    cookie: true,
    resetOnError: true,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    },
    strategies: {
      // local: false,

      strapi: {
        _scheme: '~/schemes/strapi.js',
        endpoints: {
          login: {
            url: '/auth/local',
            method: 'post',
            propertyName: 'jwt'
          },

          logout: {},
          user: {
            url: '/users/me',
            method: 'get'
          }
        }
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
