import moment from 'moment'
export const state = () => ({
  clickStatus: {
    listIndex: -5,
    taskIndex: 0,
    taskTitle: '',
    taskDone: false,
    taskStar: false,
    taskExpireAt: null,
    taskCreateAt: null
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

export const getters = {
  getCurrentListName(state) {
    const list = state.commonLists.concat(state.customLists).filter(item => item.id === state.clickStatus.listIndex)
    if (list.length > 0) {
      return list[0].name
    }
  },
  getInboxTasks(state) {
    return state.tasks.filter(task => !task.list)
  },
  getUndoneTodos(state) {
    return state.tasks.filter(todo => !todo.done)
  },
  getStarTasks(state) {
    return state.tasks.filter(task => !task.done && task.star)
  },
  getAllTasks(state) {
    return state.tasks.filter(task => !task.done)
  },
  getCustomListTasks(state) {
    return state.tasks.filter(task => task.list === state.taskStatus.list)
  },
  getTodayTasks(state) {
    return state.tasks.filter((task) => {
      return task.expireAt && !task.done && moment(task.expireAt) <= moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    })
  },
  getThisWeekTasks(state) {
    const todayWeekDay = new Date().getDay()
    const thisWeekLastDay = moment().add(7 - todayWeekDay, 'days')
    return state.tasks.filter(task => !task.done && task.expireAt && moment(task.expireAt) <= thisWeekLastDay)
  }
}
