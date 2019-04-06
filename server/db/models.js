import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

const UserSchema = new Schema({
  id: {
    type: Number,
    require: true
  },
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  tasks: {
    type: Array
  },
  lists: {
    type: Array
  },
  status: {
    // 用户状态
    type: Number,
    default: 0
  }
})

const ListSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tasks: {
    type: Array,
    default: []
  },
  status: {
    type: Number,
    default: 0
  }
})

const TaskSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    require: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List'
  },
  title: {
    type: String,
    trim: true,
    require: true
  },
  done: {
    type: Boolean,
    default: false
  },
  star: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: null
  },
  status: {
    type: Number,
    default: 0
  }
})

export const User = mongoose.model('User', UserSchema)
export const Task = mongoose.model('Task', TaskSchema)
export const List = mongoose.model('List', ListSchema)
