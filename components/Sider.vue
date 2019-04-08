<template>
  <b-row class="sider-wrapper">
    <b-col cols="12" class="sider-header">
      <span class="iconfont iconfont-menu" @click="toggleCollapse">&#xe790;</span>
      <span v-if="!collapsed" class="sider-header-search">搜索</span>
      <span v-if="!collapsed" class="iconfont iconfont-search">&#xe604;</span>
    </b-col>
    <b-col cols="12" class="quick-menu">
      <span class="iconfont iconfont-avatar">&#xe605;</span>
      <span v-if="!collapsed" class="username">{{ userInfo.username }}</span>
      <span v-if="!collapsed" class="iconfont iconfont-bell">&#xe827;</span>
      <span v-if="!collapsed" class="iconfont iconfont-popover">&#xe885;</span>
    </b-col>
    <b-col cols="12" class="sider-list">
      <ul>
        <li
          v-for="list of lists"
          :key="list.id"
          :class="list.id===clickStatus.listIndex?'selected':''"
          @click="handleListClick(list.id)"
        >
          <span v-if="list.id===-5" class="iconfont" style="color: #228bef">&#xe6e5;</span>
          <span v-if="list.id===-4" class="iconfont" style="color: #e2695b">&#xe64b;</span>
          <span v-if="list.id===-3" class="iconfont" style="color: #5da200">&#xe672;</span>
          <span v-if="list.id===-2" class="iconfont" style="color: #e49700">&#xe606;</span>
          <span v-if="list.id===-1" class="iconfont" style="color: #9d5e14">&#xe67b;</span>
          <span v-if="list.id>=0" class="iconfont">&#xe611;</span>
          <span v-if="!collapsed">{{ list.name }}</span>
          <span v-if="!collapsed" class="expire-count">{{ showExpireCount(list.id) }}</span>
          <span v-if="!collapsed" class="total-count">{{ showTotalCount(list.id) }}</span>
        </li>
      </ul>
    </b-col>
    <b-col class="sider-footer" @click="showModal">
      <span class="iconfont iconfont-plus">&#xe696;</span>
      <span>创建清单</span>
    </b-col>
    <b-col>
      <!-- Modal Component -->
      <b-modal
        id="modal-prevent"
        ref="modal"
        :modal-class="newListModal"
        :footer-class="listName.trim().length===0?'footer-no-input':''"
        title="创建新清单"
        :hide-header-close="true"
        ok-title="保存"
        cancel-title="取消"
        @ok="handleOk"
        @shown="clearAndFocus"
      >
        <form @submit.stop.prevent="handleSubmit">
          <b-form-input ref="focusThis" v-model="listName" placeholder="清单名称" />
        </form>
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Sider',
  data() {
    return {
      collapsed: false,
      listName: '',
      newListModal: 'new-list-modal'
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
    lists() {
      return this.commonLists.concat(this.customLists)
    }
  },
  methods: {
    handleListClick(key) {
      this.$store.commit('clearTaskStatus')
      this.$store.commit('changeListIndex', key)
      this.$store.commit('changeTaskListStatus', key)
      if (key === -4) {
        this.$store.commit('changeTaskStarStatus')
      }
      if (key === -3) {
        this.$store.commit('changeTaskExpireStatus', moment().format())
      }
    },
    toggleCollapse() {
      this.collapsed = !this.collapsed
      this.$emit('collapsed', this.collapsed)
    },
    showSiderIcon(id) {
      console.log(id)
    },
    clearAndFocus() {
      this.listName = ''
      this.$refs.focusThis.focus()
    },
    showModal() {
      this.$refs.modal.show()
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      if (this.listName) {
        this.handleSubmit()
      } else {
        bvModalEvt.preventDefault()
      }
    },
    handleSubmit() {
      this.$store.dispatch('addList', this.listName)
      this.$refs.modal.hide()
    },
    showTotalCount(index) {
      switch (index) {
        case -5: {
          return this.getInboxTasks.length
        }
        case -4: {
          return this.getStarTasks.length
        }
        case -3: {
          return this.getTodayTasks.length
        }
        case -2: {
          return this.getThisWeekTasks.length
        }
        case -1: {
          return this.getAllTasks.length
        }
        default: { // TODO 这里不知道怎么过程中那么多Bug
          const _id = this.customLists.filter(list => list.id === index)[0]._id
          return this.tasks.filter(task => task.list === _id).length
        }
      }
    },
    showExpireCount(index) {
      switch (index) {
        case -5: {
          return this.getInboxTasks.filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
        case -4: {
          return this.getStarTasks.filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
        case -3: {
          return this.getTodayTasks.filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
        case -2: {
          return this.getThisWeekTasks.filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
        case -1: {
          return this.getAllTasks.filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
        default: { // TODO 这里不知道怎么过程中那么多Bug
          const _id = this.customLists.filter(list => list.id === index)[0]._id
          return this.tasks.filter(task => task.list === _id).filter(task => task.expireAt && moment(task.expireAt) < moment()).length
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sider-wrapper{
  .sider-header{
    height: 46px;
    line-height: 46px;
    color: $WHITE_TEXT;
    background: $GREEN_SIDER;
    display: flex;
    flex-flow: row nowrap;
    text-align: center;
    .sider-header-search{
      width: 100%;
    }
    .iconfont-menu{
      flex: 0 0 30px;
      margin: 0 5px;
      font-size: 20px;
    }
    .iconfont-search{
      flex: 0 0 30px;
      font-size: 20px;
    }
  }
  .quick-menu{
    height: 45px;
    line-height: 45px;
    display: flex;
    flex-flow: row nowrap;
    span{
      flex: 0 0 25px;
      &:nth-child(2){
        flex: 1;
      }
    }
    span.iconfont-avatar{
      color: #777;
      font-size: 28px;
      margin:0 5px;
    }
    span.iconfont-bell{
      font-size: 20px;
      margin: 0 8px;
    }
    span.iconfont-popover{
      font-size: 20px;
      font-weight: 300;
      margin-right: 8px;
    }
  }
  .sider-list{
    ul{
      list-style-type: none;
      padding-left: 0;
    }
    li {
      height: 40px;
      line-height: 36px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      span:first-child{
        margin: 0 12px;
      }
      span:nth-child(2) {
        flex: 1;
      }
      span.expire-count {
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-right: 8px;
        background: #f2e6e5;
        color: #b1463f;
        text-align: center;
        border-radius: 50%;
        font-size: 12px;
      }

      span.total-count {
        width: 20px;
        color: #cacac9;
        font-size: 12px;
      }
      &.selected{
        background: $BLUE_SIDER_SELECTED;
        span.total-count{
          color: #575a5e;
        }
        span.expire-count{
          color: #f4f0f0;
          background: #b1463f;
        }
      }
    }
  }
  .sider-footer{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: $BLUE_TEXT;
    border-top: 1px solid #dedede;
    cursor: pointer;
    span{
      display: inline-block;
      margin-right: 10px;
    }
  }
 }
  /deep/ .new-list-modal{
    .modal-dialog{
      max-width: 390px;
      .modal-header{
        border: 0;
        h5{
          margin: 0 auto;
          font-size: 18px;
        }
      }
      .modal-body{
        padding: 6px 12px 12px 12px;
        input{
          &:focus{
            border: 1px solid #6da0e1;
            box-shadow: 0 0 0;
          }
        }
      }
      .modal-footer{
        padding: 12px;
        button{
          width: 100px;
          height: 30px;
          line-height: 14px;
          font-size: 14px;
          &:first-child{
            background: #fff;
            color: $BLACK_TEXT;
            border: 1px solid #e8e8e8;
          }
          &:last-child{
            background-color: #4e85d6;
            color: $WHITE_TEXT;
            border: 1px solid #4e85d6;
          }
        }
        &.footer-no-input{
          button{
            &:last-child{
              background-color: #9ec0e9;
              border: 1px solid #9ec0e9;
            }
          }
        }
      }
    }
  }
</style>
