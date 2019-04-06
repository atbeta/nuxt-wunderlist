import axios from '../server/utils/axios'
export const state = () => ({
  clickStatus: {
    listIndex: -5,
    taskIndex: 0
  },
  userStatus: {
    isLogin: true,
    username: 'test',
    id: '5ca7a0188daf990a72129f63'
  },
  taskStatus: {
    title: '',
    creator: '',
    done: false,
    star: false,
    list: '',
    expireAt: null
  },
  tasks: [{
    'done': false,
    'star': false,
    'expireAt': null,
    'status': 0,
    '_id': '5ca7a103d428840c991be68f',
    'id': 0,
    'creator': '5ca7a0188daf990a72129f63',
    'title': '测试任务一',
    'createAt': '2019-04-05T18:40:03.607Z',
    '__v': 0
  },
  {
    'done': false,
    'star': true,
    'expireAt': null,
    'status': 0,
    '_id': '5ca7a147588fb00d73650f15',
    'id': 1,
    'creator': '5ca7a0188daf990a72129f63',
    'title': '测试任务带星标一',
    'createAt': '2019-04-05T18:41:11.507Z',
    '__v': 0
  },
  {
    'done': true,
    'star': false,
    'expireAt': null,
    'status': 0,
    '_id': '5ca7a16603fb180dddb192d5',
    'id': 2,
    'creator': '5ca7a0188daf990a72129f63',
    'title': '测试任务已完成一',
    'createAt': '2019-04-05T18:41:42.148Z',
    '__v': 0
  },
  {
    'done': true,
    'star': false,
    'expireAt': null,
    'status': 0,
    '_id': '5ca7a38ede7f5710c072b7dc',
    'id': 3,
    'creator': '5ca7a0188daf990a72129f63',
    'list': '5ca7a0c8f302190c14e89e49',
    'title': '测试任务自定义清单',
    'createAt': '2019-04-05T18:50:54.796Z',
    '__v': 0
  },
  {
    'done': true,
    'star': false,
    'expireAt': '2019-04-03T18:53:17.556Z',
    'status': 0,
    '_id': '5ca7a41dd33d4011914162d0',
    'id': 4,
    'creator': '5ca7a0188daf990a72129f63',
    'title': '测试已过期任务',
    'createAt': '2019-04-05T18:53:17.555Z',
    '__v': 0
  },
  {
    'done': false,
    'star': false,
    'expireAt': '2019-03-31T18:53:53.158Z',
    'status': 0,
    '_id': '5ca7a441699f821200027dcd',
    'id': 5,
    'creator': '5ca7a0188daf990a72129f63',
    'title': '测试已过期任务二',
    'createAt': '2019-04-05T18:53:53.157Z',
    '__v': 0
  }],
  commonLists: [
    { id: -5, name: '收件箱' },
    { id: -4, name: '已加星标' },
    { id: -3, name: '今天' },
    { id: -2, name: '本周' },
    { id: -1, name: '全部' }
  ],
  customLists: [{
    'tasks': ['5ca7a38ede7f5710c072b7dc'],
    'status': 0,
    '_id': '5ca7a0c8f302190c14e89e49',
    'id': 0,
    'name': '测试自定义清单一',
    'creator': '5ca7a0188daf990a72129f63',
    '__v': 0
  }]
})

export const mutations = {
  initUserTasks(state, tasks) {
    state.tasks = tasks
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
  // Todo 这里暂先用一个mutations代替，之后需要在请求数据时初始化
  changeTaskCreatorStatus(state) {
    state.taskStatus.creator = state.userStatus.id
  },
  addTask(state, newTask) {
    // 只把任务添加到 store，通过action来发送post请求并将返回值更新到store
    this.state.tasks.push(newTask)
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
  async initUserTasks(ctx, user) {
    const result = await axios.get(`/tasks/${user}`)
    console.log(result.data.tasks)
    ctx.commit('initUserTasks', result.data.tasks)
  },
  async addTask(ctx) {
    ctx.commit('changeTaskCreatorStatus')
    const newTask = await axios.post('/api/tasks', ctx.state.taskStatus)
    console.log(newTask)
    ctx.commit('addTask', { ...ctx.state.taskStatus, id: newTask.data.id, _id: newTask.data.task })
  }
}
