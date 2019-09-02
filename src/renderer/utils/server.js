import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
let server = null

router.get('/', ctx => {
  ctx.body = 'Hello World!'
})

export function start () {
  server = app.listen(9527)
}

export function stop () {
  server.close()
}
