<template>
  <b-container fluid>
    <b-row class="logo-container">
      <b-col cols="4" class="logo">
        <div class="logo-img-wrapper">
          <img src="../assets/img/logo.png" alt="">
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!apiValidate" class="login-inform-container">
      <b-col cols="4" class="login-fail-inform">
        <span>你输入的用户名或密码不正确，请重试。</span>
      </b-col>
    </b-row>
    <b-row class="form-container">
      <b-col cols="4" class="login-form">
        <form>
          <div class="input-wrapper">
            <span class="iconfont">&#xe623;</span>
            <input
              id="username-popover"
              v-model="FormData.username"
              type="text"
              :class="!validateResult.username?'input-username validate-false':'input-username'"
              placeholder="用户名"
            >
            <b-popover
              v-if="!validateResult.username"
              target="username-popover"
              placement="bottom"
              triggers="hover focus"
              content="请填写此字段"
              offset="-50"
            />
          </div>
          <div class="input-wrapper">
            <span class="iconfont">&#xe602;</span>
            <input
              id="password-popover"
              v-model="FormData.password"
              type="password"
              :class="!validateResult.password?'input-password validate-false':'input-password'"
              placeholder="密码"
            >
            <b-popover
              v-if="validateResult.username&&!validateResult.password"
              target="password-popover"
              placement="bottom"
              triggers="hover focus"
              content="请填写此字段"
              offset="-50"
            />
          </div>
          <div class="button-wrapper">
            <b-button class="button-login" @click="handleSubmit">
              登录
            </b-button>
          </div>
          <div class="forget-password">
            <span>忘记密码？</span>
          </div>
        </form>
        <div class="signup">
          <span>还没有账户？</span><span>创建账户</span>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      FormData: {
        username: '',
        password: ''
      },
      validateResult: {
        username: true,
        password: true
      },
      apiValidate: true
    }
  },
  methods: {
    validate(username, password) {
      // 用户名密码验证,我们只验证空的情况
      if (username.trim().length > 0 && password.length > 0) {
        return true
      } else {
        if (username.trim() === '') {
          this.validateResult.username = false
        }
        if (password === '') {
          this.validateResult.password = false
        }
        return false
      }
    },
    handleSubmit() {
      this.validateResult.username = true
      this.validateResult.password = true
      const result = this.validate(this.FormData.username, this.FormData.password)
      if (result) {
        console.log(this.FormData)
        this.$axios.post('/api/login', this.FormData).then((result) => {
          console.log(result)
          if (result.data.code === 0) {
            this.apiValidate = true
            this.$store.commit('updateUserLogin', result.data.user)
            setTimeout(this.$router.push({ path: '/' }), 1000)
          } else {
            this.apiValidate = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo-container{
    margin-top: 40px;
    justify-content: center;
    .logo-img-wrapper{
      text-align: center;
      img{
      display: inline-block;
      width: 80px;
      height: 80px;
      }
    }
  }
  .form-container{
    justify-content: center;
    margin-top: 30px;
    .login-form{
      flex: 0 0 350px;
      height: 235px;
      padding-left: 0;
      padding-right: 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      .input-wrapper{
        height: 60px;
        line-height: 60px;
        display: flex;
        flex-flow: row nowrap;
        border-bottom: 1px solid #ddd;
        span.iconfont{
          width: 24px;
          margin-left: 15px;
          margin-right: 15px;
          color: #4899e2;
          font-size: 20px;
        }
        input{
          width: 100%;
          border: 0;
          &::placeholder{
            font-size: 16px;
            color: $BLACK_TEXT;
          }
          &.validate-false{
            border: 1px solid #ec4843;
            box-shadow:0 0 1px #ec4843;
          }
        }
      }
      .button-wrapper{
        padding-left: 15px;
        padding-right: 15px;
        .button-login{
          width: 100%;
          height: 45px;
          border: 0;
          background: #4c86dd;
          color: #fff;
          font-weight: 700;
          margin-top: 20px;
        }
      }
      .forget-password{
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #457ae3;
        font-weight: 700;
      }
    }
    .signup{
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      span:last-child{
        color: #457ae3;
        font-weight: 700;
      }
    }
  }
  .login-inform-container{
    justify-content: center;
    margin-top: 30px;
    .login-fail-inform{
      flex: 0 0 350px;
      text-align: center;
      span{
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: 1px solid #e4a4a1;
        border-radius: 4px;
        font-size: 14px;
        color: #cf443a;
        background: #f5eaea;
      }
    }
  }
</style>
