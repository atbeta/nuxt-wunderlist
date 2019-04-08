import Router from 'koa-router'
import { Task, User, List } from '../db/models'

const router = new Router({
  prefix: '/api'
})

// TODO：待补充未加用户验证的api，待补充参数验证避免崩溃

router.get('/tasks/:user', async ctx => {
  const username = ctx.params.user
  const user = await User.findOne({ username: username })
  if (user) {
    const taskList = user.tasks
    const tasks = await Task.find({ _id: { $in: taskList } })
    ctx.body = {
      code: 0,
      msg: '查询成功',
      tasks: tasks.filter(item => item.status === 0)
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '用户不存在'
    }
  }
})

// 创建任务，我们需要从前台获取创建者creator，任务title，done star，过期日，如果是自定义清单的任务还有list
// 我们目前均使用_id来传递
// 需要注意我们需要将该任务关联的 自定义清单 以及 用户，进行数据库操作
router.post('/tasks', async (ctx, next) => {
  const { creator, title, done, star } = ctx.request.body
  let list
  let expireAt
  if (ctx.request.body.list) {
    list = ctx.request.body.list
  }
  if (ctx.request.body.expireAt) {
    expireAt = ctx.request.body.expireAt
  }
  // 获取最大id值
  const maxIdTask = await Task.find()
    .sort({ id: -1 })
    .limit(1)
  const id = maxIdTask[0].id + 1
  const newTask = {
    id: id,
    creator: creator,
    list: list || null,
    title: title,
    done: done,
    star: star,
    createAt: Date.now(),
    expireAt: expireAt || null
  }
  const task = await Task.create(newTask)
  if (task) {
    await User.updateOne({ _id: creator }, { $push: { tasks: task._id } }).then()
    await List.updateOne({ _id: list }, { $push: { tasks: task._id } }).then()
    ctx.body = {
      code: 0,
      msg: '创建任务成功',
      task: task._id,
      id: task.id
    }
  }
})

// 修改任务，可接收多个参数，可以包括 _id title star done expireAt五个属性，其中_id必须
router.put('/tasks', async (ctx, next) => {
  const _id = ctx.request.body._id
  const task = await Task.findOneAndUpdate({ _id: _id }, ctx.request.body.task)
  if (task) {
    ctx.body = {
      code: 0,
      msg: '更新任务成功',
      _id: _id
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '更新任务失败'
    }
  }
})

// 删除任务,只需要提供任务_id
router.delete('/tasks', async (ctx, next) => {
  const _id = ctx.request.body.task
  const task = await Task.findOneAndUpdate({ _id: _id }, { status: -1 })
  if (task) {
    ctx.body = {
      code: 0,
      msg: '删除任务成功'
    }
  }
})

export default router
