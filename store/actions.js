export default {
  async addTask(ctx) {
    ctx.commit('changeTaskCreatorStatus')
    const newTask = await this.$axios.post('/api/tasks', ctx.state.taskStatus)
    ctx.commit('addTask', { ...ctx.state.taskStatus, id: newTask.data.id, _id: newTask.data.task })
    ctx.commit('clearTaskStatus')
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
    ctx.commit('changeListIndex', ctx.state.customLists[ctx.state.customLists.length - 1].id)
  },
  async changeAndAsyncTaskStar(ctx, id) {
    const task = ctx.state.tasks.find(task => task.id === id)
    if (task) {
      await this.$axios.put('/api/tasks', { _id: task._id, task: { star: !task.star } })
        .then(() => {
          ctx.commit('changeTaskStar', id)
        })
        .catch(err => console.log(err))
    }
  },
  async changeAndAsyncTaskDone(ctx, id) {
    const task = ctx.state.tasks.find(task => task.id === id)
    if (task) {
      await this.$axios.put('/api/tasks', { _id: task._id, task: { done: !task.done } })
        .then(() => {
          ctx.commit('changeTaskDone', id)
        })
        .catch(err => console.log(err))
    }
  },
  async changeAndAsyncTaskTitle(ctx, { id, title }) {
    const task = ctx.state.tasks.find(task => task.id === id)
    if (task) {
      await this.$axios.put('/api/tasks', { _id: task._id, task: { title: title } })
        .then(() => {
          ctx.commit('changeTaskTitle', { id, title })
        })
        .catch(err => console.log(err))
    }
  },
  async changeAndAsyncTaskExpire(ctx, { id, expire }) {
    const task = ctx.state.tasks.find(task => task.id === id)
    if (task) {
      await this.$axios.put('/api/tasks', { _id: task._id, task: { expireAt: expire } })
        .then(() => {
          ctx.commit('changeTaskExpire', { id, expire })
        })
        .catch(err => console.log(err))
    }
  },
  async deleteTask(ctx, id) {
    const task = ctx.state.tasks.find(task => task.id === id)
    await this.$axios.delete('/api/tasks', { data: { task: task._id } })
      .then(() => {
        ctx.commit('deleteTask', id)
      })
      .catch(err => console.log(err))
  },
  async changeAndAsyncListName(ctx, { id, name }) {
    const list = ctx.state.customLists.find(list => list.id === id)
    await this.$axios.put('/api/lists', { list: list._id, name: name })
      .then(() => {
        ctx.commit('changeListName', { id, name })
      })
      .catch(err => console.log(err))
  },
  async deleteList(ctx, id) {
    const list = ctx.state.customLists.find(task => task.id === id)
    await this.$axios.delete('/api/lists', { data: { list: list._id } })
      .then(() => {
        ctx.commit('deleteList', id)
      })
      .catch(err => console.log(err))
  }
}
