import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'koa-bodyparser'
// 这里开始引用 API
import mongoose from 'mongoose'
import tasks from './api/tasks'
import lists from './api/lists'
import users from './api/users'
import dbConfig from './db/config'
// 引用结束

const app = new Koa()
app.use(bodyParser({ extendTypes: ['json', 'form', 'text'] }))

app.use(tasks.routes()).use(tasks.allowedMethods())
app.use(lists.routes()).use(lists.allowedMethods())
app.use(users.routes()).use(users.allowedMethods())

// Database Connections
mongoose
  .connect(dbConfig.mongo, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .catch(error => console.log(error))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
