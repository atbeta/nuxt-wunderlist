<template>
  <b-row>
    <b-col cols="12" class="content-input-container">
      <div class="content-input-wrapper">
        <span
          class="iconfont iconfont-plus"
          @click="handleAddTask"
        >&#xe687;
        </span>
        <input type="text" placeholder="添加任务" :value="taskStatus.title" @input="handleChangeTitleStatus" @keyup.enter="handleAddTask">
        <span class="iconfont">&#xe687;</span>
        <span class="iconfont">&#xe687;</span>
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
          >&#xe614;
          </span>
          <span
            v-if="task.done"
            class="iconfont"
            :index="task.id"
            @click="handleChangeTaskDone(task.id)"
          >&#xe612;
          </span>
          <span :class="task.done ? 'delete' : ''" :index="task.id">
            {{ task.title }}
          </span>
          <span>{{ task.expireAt }}</span>
          <span
            v-if="!task.star"
            :index="task.id"
            class="iconfont"
            @click="handleChangeTaskStar(task.id)"
          >&#xe687;
          </span>
          <span
            v-if="task.star"
            :index="task.id"
            class="iconfont"
            @click="handleChangeTaskStar(task.id)"
          >&#xe73c;
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
    }
  },
  computed: {
    ...mapState({
      clickStatus: 'clickStatus',
      userStatus: 'userStatus',
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
  methods: {
    handleChangeTitleStatus(e) {
      console.log(e.target.value)
      this.$store.commit('changeTaskTitleStatus', e.target.value)
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
      width: 100%;
      color: $WHITE_TEXT;
      background: $GREEN_INPUT;
      border: 0;
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
