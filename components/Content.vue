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
        <a-date-picker
          v-model="expire"
          class="input-date-wrapper"
          placeholder=""
          :allow-clear="false"
          :show-today="false"
          @change="confirmExpireDate"
        >
          <span
            v-if="inputFocus"
            slot="suffixIcon"
            class="iconfont iconfont-expire"
            @click="handleChangeExpireStatus"
          >
            {{ !taskStatus.expireAt?'&#xe71f;':'&#xe78d;' }}
          </span>
          <div slot="renderExtraFooter" class="date-picker-footer">
            <a-button @click="clearExpireDate">
              移除到期日
            </a-button>
          </div>
        </a-date-picker>
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
          @dblclick="showDrawer"
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
          @dblclick="showDrawer"
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
    <b-col>
      <a-drawer
        placement="right"
        class="task-info-drawer"
        width="360"
        :closable="false"
        :visible="visible"
        @close="onClose"
      >
        <template v-slot:title>
          <div class="drawer-title-container">
            <span
              v-if="!clickStatus.taskDone"
              class="iconfont"
              @click="handleChangeTaskDoneDrawer(clickStatus.taskIndex)"
            >&#xe601;
            </span>
            <span
              v-if="clickStatus.taskDone"
              class="iconfont"
              @click="handleChangeTaskDoneDrawer(clickStatus.taskIndex)"
            >&#xe614;
            </span>
            <input
              type="text"
              :value="clickStatus.taskTitle"
              @change="handleChangeClickTitleStatus"
              @keyup.enter="handleChangeTaskTitle"
            >
            <span
              v-if="!clickStatus.taskStar"
              class="iconfont"
              @click="handleChangeTaskStarDrawer(clickStatus.taskIndex)"
            >&#xe6e0;
            </span>
            <span
              v-if="clickStatus.taskStar"
              class="iconfont"
              @click="handleChangeTaskStarDrawer(clickStatus.taskIndex)"
            >&#xe637;
            </span>
          </div>
        </template>
        <div class="drawer-datepicker-container">
          <span
            class="iconfont iconfont-expire"
            @click="handleChangeExpireStatus"
          >
            {{ !clickStatus.taskExpireAt?'&#xe71f;':'&#xe78d;' }}
          </span>
          <a-date-picker
            ref="drawerDatepicker"
            :open="datepickerOpen"
            :placeholder="formatExpireAt"
            :show-today="false"
            :value="null"
            class="expired"
            @focus="openPanel"
            @change="updateExpire"
          >
            <div slot="renderExtraFooter" class="date-picker-footer">
              <a-button style="width: 48%" @click="closePanel">
                取消
              </a-button>
              <a-button style="width: 48%" @click="handleChangeTaskExpire">
                保存
              </a-button>
            </div>
            <i slot="suffixIcon" />
          </a-date-picker>
        </div>
        <!--为了解决antd日期选择器的关闭问题增加一个空容器-->
        <div class="drawer-body-mask" @click="closePanel"></div>
        <div class="drawer-footer-container">
          <span class="iconfont" @click="onClose">&#xe665;</span>
          <span class="task-create-at">任务创建于{{ taskCreateAtWeekDay+','+formatTaskCreateAt }}</span>
          <span class="iconfont" @click="showModal">&#xe659;</span>
        </div>
      </a-drawer>
    </b-col>
    <b-col>
      <b-modal
        ref="modal"
        class="delete-modal"
        :hide-header-close="true"
        ok-title="删除任务"
        cancel-title="取消"
        @ok="handleDeleteTask"
      >
        <div class="delete-modal-body">
          <div class="delete-modal-logo">
            <img src="../assets/img/logo.png" alt="LOGO">
          </div>
          <div class="delete-modal-text">
            <p>“{{ clickStatus.taskTitle }}”将被永久删除。</p>
            <p>你将无法撤销此操作。</p>
          </div>
        </div>
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
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
      expire: moment(),
      visible: false,
      newExpire: null,
      datepickerOpen: false
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
    },
    formatTaskCreateAt() {
      return moment(this.clickStatus.taskCreateAt).format('M月D日')
    },
    taskCreateAtWeekDay() {
      const weekDays = ['周天', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekDays[moment(this.clickStatus.taskCreateAt).day()]
    },
    formatExpireAt() {
      const weekDays = ['周天', '周一', '周二', '周三', '周四', '周五', '周六']
      if (this.clickStatus.taskExpireAt) {
        const weekDay = weekDays[moment(this.clickStatus.taskCreateAt).day()]
        return weekDay + '，' + moment(this.clickStatus.taskExpireAt).format('M月D日') + ' 到期'
      } else {
        return '设置任务到期日'
      }
    }
  },
  mounted() {
    if (this.auth.loggedIn) {
      this.$axios.get('/api/tasks/' + this.auth.user).then((res) => {
        const fixedTimeTasks = res.data.tasks.map((task) => {
          if (task.expireAt) { // 解决Mongodb数据库中使用UTC时间的问题, moment会自动转换为当前时区，无需添加参数
            task.expireAt = moment(task.expireAt).format()
          }
          task.createAt = moment(task.createAt).format()
          return task
        })
        this.$store.commit('initUserTasks', fixedTimeTasks)
      })
    }
  },
  methods: {
    confirmExpireDate() { // 创建任务的时候，如果有过期日期，就将时间设为当天最后一毫秒，避免出现错误的过期提示
      this.$store.commit('changeTaskExpireStatus', moment(this.expire).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).format())
    },
    clearExpireDate() {
      this.expire = moment()
      this.$store.commit('changeTaskExpireStatus', '')
    },
    handleChangeTitleStatus(e) {
      if (e.target.value.trim().length > 0) {
        this.$store.commit('changeTaskTitleStatus', e.target.value.trim())
      }
    },
    handleChangeExpireStatus() {
    },
    handleChangeStarStatus() {
      this.$store.commit('changeTaskStarStatus')
    },
    handleAddTask() {
      if (this.taskStatus.title) {
        this.$store.dispatch('addTask')
      }
    },
    handleTaskClick(index) {
      this.$store.commit('changeTaskIndex', index)
    },
    handleChangeTaskDone(id) {
      this.$store.dispatch('changeAndAsyncTaskDone', id)
    },
    async handleChangeTaskDoneDrawer(id) {
      await this.$store.dispatch('changeAndAsyncTaskDone', id)
      this.$store.commit('changeTaskIndex', id)
    },
    handleChangeTaskStar(id) {
      this.$store.dispatch('changeAndAsyncTaskStar', id)
    },
    async handleChangeTaskStarDrawer(id) {
      await this.$store.dispatch('changeAndAsyncTaskStar', id)
      this.$store.commit('changeTaskIndex', id)
    },
    handleChangeClickTitleStatus(e) {
      console.log(e.target.value)
      this.$store.commit('changeClickTitle', e.target.value)
    },
    handleChangeTaskTitle(e) {
      this.$store.dispatch('changeAndAsyncTaskTitle', { id: this.clickStatus.taskIndex, title: this.clickStatus.taskTitle })
      e.target.blur()
    },
    async handleChangeTaskExpire() {
      await this.$store.dispatch('changeAndAsyncTaskExpire', { id: this.clickStatus.taskIndex, expire: this.newExpire })
      this.$store.commit('changeTaskIndex', this.clickStatus.taskIndex)
      this.datepickerOpen = false
    },
    handleDeleteTask() {
      this.$store.dispatch('deleteTask', this.clickStatus.taskIndex)
      this.visible = false
    },
    toggleDoneList() {
      this.showDoneList = !this.showDoneList
    },
    showDrawer() {
      this.visible = true
    },
    openPanel() {
      this.datepickerOpen = true
    },
    closePanel() {
      this.datepickerOpen = false
    },
    onClose() {
      this.datepickerOpen = false // 关抽屉的时候如果日期选择器没关也一起关了
      this.visible = false
    },
    updateExpire(date) {
      console.log(date)
      this.newExpire = date
    },
    showModal() {
      this.$refs.modal.show()
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
        user-select: none;
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
  .input-date-wrapper {
    width: 40px;
    height: 46px;
    line-height: 46px;
    background: $GREEN_INPUT;

    /deep/ .ant-calendar-picker-input {
      border: none;
      background: $GREEN_INPUT;
      color: transparent;
    }
  }

  .date-picker-footer {
    button.ant-btn {
      width: 100%;
      margin: 10px auto;
    }
  }
  .drawer-title-container{
    display: flex;
    flex-flow: row nowrap;
    span.iconfont{
      flex: 0 0 20px;
      font-size: 18px;
      color: $BLACK_TEXT;
      &:first-child{
        margin-left: -10px;
        margin-right: 10px;
      }
      &:last-child{
        margin-left: 10px;
        margin-right: -10px;
      }
      &:hover{
        cursor: pointer;
      }
    }
    input{
      flex: 1;
      font-weight: 700;
      border: none;
      &:focus{
        outline: none;
      }
    }
  }
  .drawer-datepicker-container{
    display: flex;
    flex-flow: row nowrap;
    margin-right: -10px;
    span.iconfont{
      flex: 0 0 20px;
      font-size: 20px;
      margin-left: -10px;
      margin-right: 10px;
    }
    span.ant-calendar-picker{
      flex: 1;
    }
  }
  .drawer-footer-container{
    position: fixed;
    bottom: 10px;
    right: 0;
    width: 360px;
    display: flex;
    flex-flow: row nowrap;
    padding-top: 10px;
    border-top: 1px solid #e8e8e8;
    span.iconfont{
      flex: 0 0 20px;
      margin-left: 10px;
      margin-right: 30px;
    }
    span.task-create-at{
      flex: 1;
      text-align: center;
    }
    &:hover{
      cursor: pointer;
    }
  }
  .drawer-body-mask{
    height: 600px;
    margin-left: -24px;
    margin-right: -24px;
  }
  /deep/ .delete-modal{
    .modal-dialog{
      width: 400px;
      height: 180px;
    }
    .modal-header{
      border: 0;
      padding: 0;
    }
    .modal-body{
      padding: 25px 25px;
    }
    .modal-footer{
      height: 54px;
      button{
        width: 140px;
        height: 30px;
        line-height: 15px;
        font-size: 14px;
        font-weight: 700;
        &:first-child{
          background: #fafafa;
          color: $BLACK_TEXT;
          border: 1px solid #e0e0df;
        }
        &:last-child{
          background: #4f88da;
          color:$WHITE_TEXT;
          border: 1px solid #4f88da;
        }
      }
    }
    .delete-modal-body{
      display: flex;
      flex-flow: row nowrap;
      .delete-modal-logo{
        flex: 0 0 64px;
        margin-right: 25px;
        img{
          display: inline-block;
          width: 100%;
        }
      }
      .delete-modal-text{
        flex: 1;
        p:first-child{
          color: #000;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 10px;
        }
        p:last-child{
          margin-top: 10px;
          color: #8b8b8b;
          font-size: 12px;
        }
      }
    }
  }
</style>
