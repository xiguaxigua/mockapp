import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import destroyable from 'server-destroy'
import { cloneDeep } from 'lodash'

const DEAULT_ROUTES = {
  get: {},
  post: {},
  put: {},
  patch: {},
  delete: {},
  head: {}
}
let routesMap = cloneDeep(DEAULT_ROUTES)

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
let server = null

router.all('*', ctx => {
  const { method, path } = ctx
  const realMethod = method.toLowerCase()
  if (routesMap[realMethod][path]) {
    const { content, status, time } = routesMap[realMethod][path]

    if (time) {
      return new Promise(resolve => {
        setTimeout(() => {
          ctx.body = content
          if (status) ctx.status = status
          resolve()
        }, time)
      })
    } else {
      ctx.body = content
      if (status) ctx.status = status
    }
  } else {
    ctx.body = '当前路径未配置'
  }
})

function setRoutes (routes) {
  routesMap = cloneDeep(DEAULT_ROUTES)
  routes.forEach(({ path, method, content, status, time }) => {
    routesMap[method][path] = {
      content,
      status,
      time
    }
  })
}

export function start (routes) {
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
