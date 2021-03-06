import Router from 'koa-router'
import { Task, User, List } from '../db/models'

const router = new Router({
  prefix: '/api'
})

router.get('/lists/:user', async ctx => {
  // 查询某用户所有的自定义清单
  if (ctx.isAuthenticated()) {
    const username = ctx.params.user
    const user = await User.findOne({ username: username })
    const listList = user.lists
    const lists = await List.find({ _id: { $in: listList } })
    ctx.body = {
      code: 0,
      msg: '查询成功',
      lists: lists.filter(item => item.status === 0).map((list) => {
        return { id: list.id, name: list.name, _id: list._id }
      })
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请先登录'
    }
  }
})

// 添加新自定义清单，只需要前端提供清单名称和清单创建者
router.post('/lists', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    const { name, creator } = ctx.request.body
    // 我们要计算一下最大的 id
    const maxIdList = await List.find()
      .sort({ id: -1 })
      .limit(1)
    let id = 0
    if (maxIdList.length > 0) { id = maxIdList[0].id + 1 }
    const newList = {
      id: id,
      name: name,
      creator: creator
    }
    const list = await List.create(newList)
    const updateUser = await User.updateOne(
      { _id: creator },
      { $push: { lists: list._id } }
    ).then()
    if (updateUser.ok === 1) {
      ctx.body = {
        code: 0,
        msg: '创建清单成功',
        id: id,
        name: list.name,
        _id: list._id
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请先登录'
    }
  }
})

// 修改清单，只能修改清单名称
router.put('/lists', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    const _id = ctx.request.body.list
    const name = ctx.request.body.name
    const list = await List.findOneAndUpdate({ _id: _id }, { name: name })
    if (list) {
      ctx.body = {
        code: 0,
        msg: '删除清单成功'
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '未找到清单'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '请先登录'
    }
  }
})

// 删除清单，需要前端提供要删除的清单_id
// 我们除了要删除这个清单，还需要将所有该清单中的任务标记为删除
router.delete('/lists', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    const _id = ctx.request.body.list
    const list = await List.findOneAndUpdate({ _id: _id }, { status: -1 })
    const tasksToDelete = list.tasks
    await Task.updateMany( // TODO: 这里就算是操作正常也会返回错误，暂时不检查 updateMany 是不是返回 error，否则接口间隙404
      { _id: { $in: tasksToDelete } },
      { $set: { status: -1 } })
    ctx.body = {
      code: 0,
      msg: '删除清单成功'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '请先登录'
    }
  }
})

export default router
