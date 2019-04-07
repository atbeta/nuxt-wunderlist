<template>
  <b-row class="sider-wrapper">
    <b-col cols="12" class="sider-header">
      <span class="iconfont iconfont-menu" @click="toggleCollapse">&#xe63e;</span>
      <span class="sider-header-search">搜索</span>
      <span class="iconfont iconfont-search">&#xe604;</span>
    </b-col>
    <b-col cols="12" class="quick-menu">
      <span class="iconfont iconfont-avatar">&#xe605;</span>
      <span class="username">{{ userStatus.username }}</span>
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
          <span>{{ list.name }}</span>
          <span class="expire-count">2</span>
          <span class="total-count">6</span>
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Sider',
  data() {
    return {
      collapsed: false
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
    lists() {
      return this.commonLists.concat(this.customLists)
    }
  },
  methods: {
    handleListClick(key) {
      console.log(key)
      this.$store.commit('changeListIndex', key)
    },
    toggleCollapse() {
      console.log(this.collapsed)
      this.collapsed = !this.collapsed
    },
    showSiderIcon(id) {
      console.log(id)
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
    .sider-header-search{
      width: 100%;
    }
    .iconfont-menu{
      flex: 0 0 30px;
      margin-left: -10px;
      font-size: 20px;
    }
    .iconfont-search{
      flex: 0 0 30px;
      margin-right: -20px;
      font-size: 20px;
    }
  }
  .quick-menu{
    height: 45px;
    line-height: 45px;
    display: flex;
    flex-flow: row nowrap;
    padding-left: 5px;
    padding-right: 5px;
    span{
      flex: 0 0 25px;
      &:nth-child(2){
        flex: 1;
      }
    }
    span.iconfont-avatar{
      color: #777;
      font-size: 28px;
      margin-right: 10px;
    }
    span.iconfont-bell{
      font-size: 20px;
      margin: 0 12px;
    }
    span.iconfont-popover{
      font-size: 20px;
      font-weight: 300;
    }
  }
  .sider-list{
    padding-left: 0;
    padding-right: 0;
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
        margin: 0 8px;
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
 }
</style>
