import Router from 'koa-router'
import {Task, User} from '../db/models'
import passport from '../utils/passport'

const router = new Router({
  prefix: '/api'
})

router.post('/signup', async (ctx) => {
  const {
    username,
    password
  } = ctx.request.body
  const user = await User.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // 得到当前最大的id
  const maxIdUser = await User.find()
    .sort({ id: -1 })
    .limit(1)
  const id = maxIdUser[0].id + 1
  const newUser = await User.create({ id: id, username: username, password: password })
  if (newUser) {
    ctx.body = {
      code: 0,
      msg: '注册用户成功',
      username: newUser.username,
      _id: newUser._id
    }
  }
})

router.post('/login', async (ctx, next) => {
  return passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user: {
            username: user.username,
            id: user._id
          }
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.get('/logout', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', (ctx) => {
  if (ctx.isAuthenticated()) {
    const { username, _id } = ctx.session.passport.user
    ctx.body = {
      code: 0,
      username: username,
      id: _id
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '用户未登录'
    }
  }
})

export default router
