import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import { User } from '../db/models'

passport.use(new LocalStrategy(async function (username, password, done) {
  const where = {
    username
  }
  const result = await User.findOne(where)
  if (result !== null) {
    if (result.password === password) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  return done(null, user)
})

export default passport
