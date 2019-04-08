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
    <div>
      <b-button @click="handleLogout">
        测试注销
      </b-button>
    </div>
  </b-container>
</template>

<script>
import Header from '../components/Header'
import Sider from '../components/Sider'
import Content from '../components/Content'
export default {
  middleware: 'auth',
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
    if (this.$store.state.auth.loggedIn) {
      this.$axios.get('/api/getUser')
        .then(({ data }) => {
          const { username, id } = data
          this.$store.commit('updateUserInfo', { username, id })
        })
    }
  },
  methods: {
    async handleLogout() {
      await this.$auth.logout()
    }
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
