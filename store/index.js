export const state = () => ({
  clickStatus: {
    listIndex: -5,
    taskIndex: 0
  },
  userInfo: {
    isLogin: false,
    username: '',
    id: ''
  },
  taskStatus: {
    title: '',
    creator: '',
    done: false,
    star: false,
    list: '',
    expireAt: null
  },
  tasks: [],
  commonLists: [
    { id: -5, name: '收件箱' },
    { id: -4, name: '已加星标' },
    { id: -3, name: '今天' },
    { id: -2, name: '本周' },
    { id: -1, name: '全部' }
  ],
  customLists: []
})

export const mutations = {
  initUserTasks(state, tasks) {
    state.tasks = tasks
  },
  initUserLists(state, lists) {
    state.customLists = lists
  },
  updateUserInfo(state, user) {
    state.userInfo = {
      username: user.username,
      id: user.id
    }
  },
  changeListIndex(state, index) {
    state.clickStatus.listIndex = index
  },
  changeTaskIndex(state, index) {
    state.clickStatus.taskIndex = index
  },
  changeTaskTitleStatus(state, title) {
    state.taskStatus.title = title
  },
  changeTaskStarStatus(state) {
    state.taskStatus.star = !state.taskStatus.star
  },
  changeTaskExpireStatus(state, date) {
    state.taskStatus.expireAt = date
  },
  changeTaskListStatus(state, id) {
    if (id < 0) {
      state.taskStatus.list = ''
    } else {
      state.taskStatus.list = state.customLists.filter(item => (item.id === id))[0]._id
    }
  },
  // Todo 这里暂先用一个mutations代替，之后需要在请求数据时初始化
  changeTaskCreatorStatus(state) {
    state.taskStatus.creator = state.userInfo.id
  },
  addTask(state, newTask) {
    // 只把任务添加到 store，通过action来发送post请求并将返回值更新到store
    this.state.tasks.push(newTask)
  },
  addList(state, newList) {
    // 只把清单添加到 store，通过action来发送post请求并将返回值更新到store
    this.state.customLists.push(newList)
  },
  changeTaskDone(state, id) {
    const task = state.tasks.find(task => task.id === id)
    if (task !== -1) { task.done = !task.done }
  },
  changeTaskStar(state, id) {
    const task = state.tasks.find(task => task.id === id)
    if (task !== -1) { task.star = !task.star }
  }
}

export const getters = {
  getUndoneTodos(state) {
    return state.tasks.filter(todo => !todo.done)
  },
  getStarTasks(state) {
    return state.tasks.filter(task => task.star)
  }
}

export const actions = {
  async addTask(ctx) {
    ctx.commit('changeTaskCreatorStatus')
    const newTask = await this.$axios.post('/api/tasks', ctx.state.taskStatus)
    ctx.commit('addTask', { ...ctx.state.taskStatus, id: newTask.data.id, _id: newTask.data.task })
    ctx.commit('changeTaskTitleStatus', '')
  },
  async addList(ctx, name) {
    // 创建自定义清单，我们需要提供清单名和创建者，并根据接口返回数据更新customList
    const res = await this.$axios.post('/api/lists', { name: name, creator: ctx.state.userInfo.id })
    if (res) {
      const newList = {
        _id: res.data._id,
        id: res.data.id,
        name: res.data.name
      }
      ctx.commit('addList', newList)
    }
  }
}
