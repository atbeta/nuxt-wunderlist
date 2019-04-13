import moment from 'moment'
export default {
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
    const task = state.tasks.find(item => item.id === index)
    state.clickStatus.taskTitle = task.title
    state.clickStatus.taskDone = task.done
    state.clickStatus.taskStar = task.star
    state.clickStatus.taskExpireAt = task.expireAt
    state.clickStatus.taskCreateAt = task.createAt
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
  clearTaskStatus(state) { // 添加完一个任务后清除加星和完成到期日状态
    state.taskStatus.title = ''
    state.taskStatus.expireAt = null
    state.taskStatus.star = false
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
    if (task) { task.done = !task.done }
  },
  changeTaskStar(state, id) {
    const task = state.tasks.find(task => task.id === id)
    if (task) { task.star = !task.star }
  },
  changeClickTitle(state, title) {
    state.clickStatus.taskTitle = title
  },
  changeTaskTitle(state, { id, title }) {
    const task = state.tasks.find(task => task.id === id)
    if (task) { task.title = title }
  },
  changeTaskExpire(state, { id, expire }) {
    const task = state.tasks.find(task => task.id === id)
    if (task) { task.expireAt = moment(expire).format() }
  },
  deleteTask(state, id) {
    const taskIndex = state.tasks.findIndex(task => task.id === id)
    if (taskIndex !== -1) { state.tasks.splice(taskIndex, 1) }
  },
  changeListName(state, { id, name }) {
    const list = state.customLists.find(list => list.id === id)
    if (list) { list.name = name }
  },
  deleteList(state, id) {
    const listIndex = state.customLists.findIndex(list => list.id === id)
    console.log(listIndex)
    if (listIndex !== -1) { state.customLists.splice(listIndex, 1) }
  }
}
