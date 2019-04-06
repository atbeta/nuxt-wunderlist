import Router from 'koa-router'
import { Task, User, List } from '../db/models'

const router = new Router({
  prefix: '/api'
})


export default router
