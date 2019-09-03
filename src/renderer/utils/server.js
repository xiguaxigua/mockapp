import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import destroyable from 'server-destroy'

let getRoutes = {}
let postRoutes = {}

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
let server = null

router.get('*', ctx => {
  if (getRoutes[ctx.path]) {
    ctx.body = getRoutes[ctx.path]
  } else {
    ctx.body = 'Hello World!'
  }
})

router.post('*', ctx => {
  ctx.body = '123'
})

function setRoutes (routes) {
  console.log(routes)
  getRoutes = {}
  routes.forEach(({ path, method, content }) => {
    if (method === 'get') {
      getRoutes[path] = content
    } else {
      postRoutes[path] = content
    }
  })
}

export function start (routes) {
  console.log('routes', routes)
  setRoutes(routes)
  server = app.listen(9527)
  destroyable(server)
}

export function restart (routes) {
  setRoutes(routes)
}

export function stop () {
  server.destroy()
}
