<template>
  <b-container fluid>
    <b-row class="main-container">
      <b-col :class="siderCollapsed?'sider-container sider-collapsed':'sider-container'">
        <Sider @collapsed="handleCollapsed" />
      </b-col>
      <b-col class="right-container">
        <b-row>
          <b-col cols="12" class="header-container">
            <Header />
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
export default {
  middleware: 'auth',
  components: {
    Header,
    Sider,
    Content
  },
  data() {
    return {
      siderCollapsed: false
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
    if (this.$store.state.auth.loggedIn) {
      this.$axios.get('/api/lists/' + this.$store.state.auth.user).then((res) => {
        this.$store.commit('initUserLists', res.data.lists)
      })
    }
  },
  methods: {
    handleCollapsed(collapsed) {
      this.siderCollapsed = collapsed
    },
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
    padding: 0;
    background: $WHITE_SIDER;
    &.sider-collapsed{
      flex: 0 0 40px;
    }
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
