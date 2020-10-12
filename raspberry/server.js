import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import cors from '@koa/cors'
import Router from 'koa-router'
import * as config from './config'
import routes from './src/routes'
import slugify from 'slugify'
import EventEmitter from 'events'

const requestsEvents = new EventEmitter()
const app = new Koa()
const router = new Router()

app.keys = [config.SESSION_KEY]

const CONFIG = {
  key: slugify(config.PROJECT_NAME),
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: true
}

let requestsCount = 0

app.use(async (ctx, next) => {
  ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  ctx.set('Expires', '-1')
  ctx.set('Pragma', 'no-cache')
  await next()
})

app.use(async (_, next) => {
  requestsCount++
  await next()
  requestsCount--
  if (requestsCount === 0) {
    requestsEvents.emit('zeroed_requests')
  }
})

app.use(session(CONFIG, app))
app.use(cors({ credentials: true }))
app.use(bodyParser({ jsonLimit: '100mb' }))

routes(router)
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx, next) => {
  console.log(`[${ctx.method}] [${new Date()}] - ${ctx.request.path}`)
  await next()
})

app.use(async (ctx, next) => {
  if (!ctx.body && !ctx.__connected__010) {
    ctx.body = {
      error: true,
      message: 'Endpoint not found',
      errorCode: 'NOT_FOUND'
    }

    ctx.status = 404
  }
  await next()
})

app.listen(config.API_PORT, () => {
  console.log('LISTENING AT PORT', config.API_PORT)
  if (process.send) process.send('ready')
})

process.on('SIGINT', function () {
  if (requestsCount <= 0) {
    process.exit(0)
  }

  requestsEvents.on('zeroed_requests', () => {
    process.exit(0)
  })
})
