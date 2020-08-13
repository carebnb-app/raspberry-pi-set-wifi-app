import * as messages from './messages'

export default function connect (controller, { status = 200 } = {}) {
  return async function (ctx, next) {
    try {
      const _ctx = {
        params: ctx.request.body,
        query: ctx.request.query,
        paramsUrl: ctx.params,
        headers: ctx.request.headers,
        session: {
          ...ctx.session,
          set: (key, value) => (ctx.session[key] = value)
        }
      }

      const result = await controller(_ctx)
      ctx.status = status
      ctx.__connected__010 = true
      ctx.body = result
    } catch (err) {
      console.error(err)
      ctx.status = err.status || 500
      ctx.body = {
        error: true,
        message: messages[err.message] || err.message,
        errorCode: messages[err.message] ? err.message : null
      }
    }
    if (next) await next()
  }
}
