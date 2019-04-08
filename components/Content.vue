<template>
  <b-row>
    <b-col v-if="clickStatus.listIndex !== -2" cols="12" class="content-input-container">
      <div class="content-input-wrapper">
        <span
          class="iconfont iconfont-plus"
          @click="handleAddTask"
        >&#xe696;
        </span>
        <input
          :value="taskStatus.title"
          :placeholder="showPlaceholder"
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
          v-for="task of showList.filter(item=>!item.done)"
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
          <span :index="task.id">
            {{ task.title }}
          </span>
          <span :class="task.expireAt&&new Date(task.expireAt)<new Date()?'expired':''">{{ task.expireAt?task.expireAt.toString().substr(0,10):'' }}</span>
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
    <b-col v-if="clickStatus.listIndex === -5 || clickStatus.listIndex >= 0" cols="12" class="content-list-container done-list-container">
      <b-button class="show-more-button" @click="toggleDoneList">
        显示已完成内容
      </b-button>
      <ul v-if="showDoneList">
        <li
          v-for="task of showList.filter(item=>item.done)"
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
          <span :index="task.id">
            {{ task.title }}
          </span>
          <span :class="task.expireAt&&new Date(task.expireAt)<new Date()?'expired':''">{{ task.expireAt?task.expireAt.toString().substr(0,10):'' }}</span>
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
  </b-row>
</template>

<script>
// import VueDatepickerLocal from 'vue-datepicker-local'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Content',
  components: {
  },
  data() {
    return {
      inputFocus: true,
      showDoneList: false,
      expire: new Date()
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
      getInboxTasks: 'getInboxTasks', // 这个包括了已完成和未完成的
      getUndoneTodos: 'getUndoneTodos',
      getStarTasks: 'getStarTasks',
      getAllTasks: 'getAllTasks',
      getCustomListTasks: 'getCustomListTasks',
      getTodayTasks: 'getTodayTasks',
      getThisWeekTasks: 'getThisWeekTasks'
    }),
    showList() {
      // 根据当前左侧点击项判断显示哪个列表
      switch (this.clickStatus.listIndex) {
        case -5: {
          return this.getInboxTasks
        }
        case -4: {
          return this.getStarTasks
        }
        case -3: {
          return this.getTodayTasks
        }
        case -2: {
          return this.getThisWeekTasks
        }
        case -1: {
          return this.getAllTasks
        }
        default: {
          return this.getCustomListTasks
        }
      }
    },
    showPlaceholder() {
      switch (this.clickStatus.listIndex) {
        case -4: {
          return '在"收件箱"中添加一个星标任务'
        }
        case -3: {
          return '在"收件箱"中添加一个今天到期的任务'
        }
        case -1: {
          return '在"收件箱"中添加一个任务'
        }
        default: {
          return '添加任务...'
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
    confirmExpireDate() {
      this.$store.commit('changeTaskExpireStatus', moment(this.expire).format())
    },
    clearExpireDate() {
      this.expire = new Date()
      this.$store.commit('changeTaskExpireStatus', '')
    },
    handleChangeTitleStatus(e) {
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
      this.$store.dispatch('changeAndAsyncTaskDone', id)
    },
    handleChangeTaskStar(id) {
      this.$store.dispatch('changeAndAsyncTaskStar', id)
    },
    toggleDoneList() {
      this.showDoneList = !this.showDoneList
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .expire-date-picker-wrapper{
    line-height: 30px;
    input.expire-date-picker{
      width: 20px;
      height: 20px;
      padding: 0;
      visibility: hidden;
    }
    .datepicker::before{
      width: 0;
    }
    .datepicker-popup{
      right: 0;
      top: 30px;
      a.calendar-date{
        line-height: 30px;
        &.calendar-date-selected{
          color: #fff;
          background: #5798fd;
          border-radius: 3px;
        }
      }
    }
    .datepicker__buttons button{
      width: 90px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      margin: 0 auto;
    }
  }
  .content-input-container {
    padding-left: 0;
    padding-right: 0;
  }
  .content-input-wrapper {
    height: 46px;
    line-height: 46px;
    margin: 12px 12px 0 12px;
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
        margin-right: -20px;
      }
      &.iconfont-star{
        font-weight: 700;
      }
    }
  }
  .content-list-container{
    margin-top: 10px;
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
        span.expired{
          color: #b54f49;
        }
      }
      li.selected{
        background: #e5f4fe;
      }
    }
    &.done-list-container{
      li{
        background: #f3f7f7;
        color: #686d6f;
        span:nth-child(2){
          text-decoration: line-through;
        }
        &.selected{
          background: #dae8ef;
        }
      }
      .show-more-button{ // TODO Chrome非常讨厌的加各种默认样式，去除按钮点击效果不成功待修改
        width: 105px;
        height: 20px;
        line-height: 20px;
        border: 0;
        outline: none;
        background: #7d9eac;
        padding: 0 6px;
        font-size: 12px;
        margin-bottom: 10px;
        &:active{
          outline: none;
          box-shadow: 0 0 0;
        }
      }
    }
  }
</style>
