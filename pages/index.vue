<template>
  <b-container fluid>
    <b-row class="main-container">
      <b-col class="sider-container">
        <Sider />
      </b-col>
      <b-col class="right-container">
        <b-row>
          <b-col cols="12" class="header-container">
            <Header title="标题" />
          </b-col>
          <b-col cols="12" class="content-container">
            <Content />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Header from '../components/Header'
import Sider from '../components/Sider'
import Content from '../components/Content'
import axios from '../server/utils/axios'
export default {
  components: {
    Header,
    Sider,
    Content
  },
  data() {
    return {
    }
  },
  mounted() {
    axios.get('/api/getUser').then((res) => {
      if (res.data.code === 0) {
        this.$store.commit('updateUserLogin', { username: res.data.username, id: res.data.id })
      } else {
        this.$router.push('/login')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .main-container{
  }
  .sider-container{
    flex: 0 0 280px;
    height: 100vh;
    background: $WHITE_SIDER;
  }
  .right-container{
    height: 100vh;
    background-image: url('../assets/img/bg.jpg');
    background-size: cover;
    .header-container{
      height: 46px;
    }
  }
</style>
