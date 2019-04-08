<template>
  <b-row>
    <b-col cols="12" class="content-input-container">
      <div class="content-input-wrapper">
        <span
          class="iconfont iconfont-plus"
          @click="handleAddTask"
        >&#xe696;
        </span>
        <input
          :value="taskStatus.title"
          placeholder="添加任务"
          type="text"
          @input="handleChangeTitleStatus"
          @keyup.enter="handleAddTask"
        >
        <span
          v-if="inputFocus"
          class="iconfont iconfont-expire"
          @click="handleChangeExpireStatus"
        >
          {{ !taskStatus.expireAt?'&#xe71f;':'&#xe78d;' }}
        </span>
        <span
          v-if="inputFocus"
          class="iconfont iconfont-star"
          @click="handleChangeStarStatus"
        >
          {{ !taskStatus.star?'&#xe6e0;':'&#xe637;' }}
        </span>
      </div>
    </b-col>
    <b-col cols="12" class="content-list-container">
      <ul>
        <li
          v-for="task of showList"
          :key="task.id"
          :class="task.id===clickStatus.taskIndex?'selected':''"
          @click="handleTaskClick(task.id)"
        >
          <span
            v-if="!task.done"
            class="iconfont"
            :index="task.id"
            @click="handleChangeTaskDone(task.id)"
          >&#xe601;
          </span>
          <span
            v-if="task.done"
            class="iconfont"
            :index="task.id"
            @click="handleChangeTaskDone(task.id)"
          >&#xe614;
          </span>
          <span :class="task.done ? 'delete' : ''" :index="task.id">
            {{ task.title }}
          </span>
          <span>{{ task.expireAt?task.expireAt.substr(0,10):'' }}</span>
          <span
            v-if="!task.star"
            :index="task.id"
            class="iconfont"
            @click="handleChangeTaskStar(task.id)"
          >&#xe6e0;
          </span>
          <span
            v-if="task.star"
            :index="task.id"
            class="iconfont"
            @click="handleChangeTaskStar(task.id)"
          >&#xe637;
          </span>
        </li>
      </ul>
    </b-col>
    <b-col cols="12" class="content-list-container">
      <div>测试</div>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Content',
  data() {
    return {
      inputFocus: true
    }
  },
  computed: {
    ...mapState({
      auth: 'auth',
      clickStatus: 'clickStatus',
      userInfo: 'userInfo',
      taskStatus: 'taskStatus',
      tasks: 'tasks',
      commonLists: 'commonLists',
      customLists: 'customLists'
    }),
    ...mapGetters({
      getUndoneTodos: 'getUndoneTodos',
      getStarTasks: 'getStarTasks'
    }),
    showList() {
      // 根据当前左侧点击项判断显示哪个列表
      switch (this.clickStatus.listIndex) {
        case -5: {
          return this.tasks
        }
        case -4: {
          return this.getStarTasks
        }
        case -3: {
          return this.tasks
        }
        case -2: {
          return this.getUndoneTodos
        }
        case -1: {
          return this.tasks
        }
        default: {
          return this.getStarTasks
        }
      }
    }
  },
  mounted() {
    if (this.auth.loggedIn) {
      this.$axios.get('/api/tasks/' + this.auth.user).then((res) => {
        this.$store.commit('initUserTasks', res.data.tasks)
      })
    }
  },
  methods: {
    handleChangeTitleStatus(e) {
      console.log(e.target.value)
      this.$store.commit('changeTaskTitleStatus', e.target.value)
    },
    handleChangeExpireStatus() {
    },
    handleChangeStarStatus() {
      this.$store.commit('changeTaskStarStatus')
    },
    handleAddTask() {
      this.$store.dispatch('addTask')
    },
    handleTaskClick(index) {
      this.$store.commit('changeTaskIndex', index)
    },
    handleChangeTaskDone(id) {
      this.$store.commit('changeTaskDone', id)
    },
    handleChangeTaskStar(id) {
      this.$store.commit('changeTaskStar', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-input-container {
    padding-left: 0;
    padding-right: 0;
  }
  .content-input-wrapper {
    height: 46px;
    line-height: 46px;
    margin: 12px;
    display: flex;
    flex-flow: row nowrap;
    background: $GREEN_INPUT;
    border-radius: 3px;

    input {
      flex: 1;
      color: $WHITE_TEXT;
      background: $GREEN_INPUT;
      border: 0;
      outline: none;
      &::placeholder {
        color: #d2dfe3;
      }
      &:focus{
        border: 0;
      }
    }
    span.iconfont{
      flex: 0 0 20px;
      padding-left: 8px;
      padding-right: 8px;
      color: $WHITE;
      &.iconfont-plus{
      }
      &.iconfont-expire{
      }
      &.iconfont-star{
        font-weight: 700;
      }
    }
  }
  .content-list-container{
    ul{
      list-style-type: none;
      padding-left: 0;
      li{
        height: 46px;
        line-height: 46px;
        margin-top: 2px;
        border-radius: 4px;
        background: #fff;
        display: flex;
        flex-flow: row nowrap;
        font-size: 14px;
        span.iconfont{
          flex: 0 0 20px;
          padding-left: 8px;
          padding-right: 8px;
        }
        span:nth-child(2){
          flex: 1;
        }
      }
      li.selected{
        background: #e5f4fe;
      }
    }
  }
</style>
