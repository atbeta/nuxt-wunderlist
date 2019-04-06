import mongoose from 'mongoose'
import dbConfig from './config'
import moment from 'moment'
import { User, Task, List } from './models'

mongoose.connect(dbConfig.mongo, {
  useCreateIndex: true,
  useNewUrlParser: true
})

// User.create({ id: 1, username: 'test2', password: 'test1234' }).then(function(result) {
//   console.log(result)
// })
// Task.find().then(function(result) {
//   console.log(result)
// })

// List.create({
//   id: 0,
//   name: '测试自定义清单一',
//   creator: '5ca7a0188daf990a72129f63'
// }).then(function(list) {
//   User.updateOne(
//     { _id: '5ca7a0188daf990a72129f63' },
//     { $push: { lists: list._id } }
//   ).then()
// })

// Task.create({
//   id: 3,
//   creator: '5ca7a0188daf990a72129f63',
//   list: '5ca7a0c8f302190c14e89e49',
//   title: '测试任务自定义清单',
//   done: true,
//   star: false,
//   createAt: Date.now()
// }).then(function(task) {
//   User.updateOne(
//     { _id: '5ca7a0188daf990a72129f63' },
//     { $push: { tasks: task._id } }
//   ).then()
//   List.updateOne(
//     { _id: '5ca7a0c8f302190c14e89e49' },
//     { $push: { tasks: task._id } }
//   ).then()
// })
//
// Task.create({
//   id: 5,
//   creator: '5ca7a0188daf990a72129f63',
//   title: '测试已过期任务二',
//   done: false,
//   star: false,
//   createAt: Date.now(),
//   expireAt: moment()
//     .add(-5, 'days')
//     .toDate()
// }).then(function(task) {
//   User.updateOne(
//     { _id: '5ca7a0188daf990a72129f63' },
//     { $push: { tasks: task._id } }
//   ).then()
// })
