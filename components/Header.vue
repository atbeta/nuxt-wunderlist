<template>
  <b-row class="header-wrapper">
    <b-col class="left-title">
      <div>{{ getCurrentListName }}</div>
    </b-col>
    <b-col class="right-menu">
      <div>
        <span class="iconfont iconfont-share">&#xe613;</span>
        <span class="icon-title">共享</span>
      </div>
      <div>
        <span class="iconfont iconfont-sort">&#xe616;</span>
        <span class="icon-title">排序</span>
      </div>
      <div class="last">
        <span class="iconfont iconfont-more">&#xe6d3;</span>
        <span class="icon-title">更多</span>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Header',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      clickStatus: 'clickStatus',
      commonLists: 'commonLists',
      customLists: 'customLists'
    }),
    ...mapGetters({
      getCurrentListName: 'getCurrentListName'
    })
  }
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    height: 46px;
    line-height: 46px;
    background: $GREEN_HEADER;
    .left-title {
      float: left;
      padding-left: 12px;
      font-size: 20px;
      color: #fff;
      font-weight: 400;
    }

    .right-menu {
      flex: 0 0 160px;
      padding-right: 6px;
      padding-left: 6px;
      div {
        float: left;
        padding: 0 12px;
        height: 46px;
        line-height: 46px;
      }
      div.last span {
        color: #fff;
      }
      span {
        display: block;
        height: 15px;
        text-align: center;
        color: #9dbbc5;
      }
      span.iconfont-sort {
        font-size: 20px;
      }
      span.iconfont-more {
        font-size: 20px;
      }
      span.icon-title {
        font-size: 10px;
      }
    }
  }
</style>
