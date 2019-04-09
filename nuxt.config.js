const pkg = require('./package')

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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'ant-design-vue/dist/antd.css',
    './assets/css/variables.scss',
    './assets/iconfont/iconfont.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['@/plugins/antd-ui'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: [
      './assets/css/variables.scss'// use underscore "_" & also file extension ".scss"
    ]
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/api': '/api'
  },
  auth: {
    redirect: {
      logout: '/login',
      callback: '/callback'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/login', method: 'post' },
          logout: { url: '/api/logout', method: 'get' },
          user: { url: '/api/getUser', method: 'get', propertyName: 'username' }
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
