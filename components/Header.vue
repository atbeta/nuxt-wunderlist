<template>
  <b-row class="header-wrapper">
    <b-col class="left-title">
      <div>{{ title }}</div>
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
export default {
  name: 'Header',
  props: { title: {
    type: String,
    default: '标题' } },
  data() {
    return {}
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
      font-weight: 300;
    }

    .right-menu {
      flex: 0 0 160px;
      padding-right: 12px;
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
