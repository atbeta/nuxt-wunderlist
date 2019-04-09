<template>
  <b-container fluid class="main-container">
    <b-row class="logo-container">
      <b-col cols="12">
        <div class="logo-img-wrapper">
          <img src="../assets/img/logo.png" alt="">
        </div>
      </b-col>
      <b-col cols="12" class="logo-title">
        <h1>免费获取奇妙清单</h1>
      </b-col>
    </b-row>
    <b-row class="form-and-info-container">
      <b-col md="6" cols="12" class="form-outer-container">
        <b-row class="form-container">
          <b-col cols class="signup-form">
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
              <div class="input-wrapper">
                <span class="iconfont">&#xe602;</span>
                <input
                  v-model="FormData.password2"
                  type="password"
                  :class="!validateResult.password?'input-password validate-false':'input-password'"
                  placeholder="重复密码"
                >
              </div>
              <div class="button-wrapper">
                <b-button class="button-signup" @click="handleSignup">
                  注册
                </b-button>
              </div>
            </form>
            <div class="signup">
              <span>已有账户？</span>
              <span><nuxt-link to="/login">登录</nuxt-link></span>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="6" class="info-container">
        <b-row>
          <b-col cols="3">
            <div class="info-img-wrapper">
              <img src="../assets/img/complete-icon.png" alt="">
            </div>
          </b-col>
          <b-col cols="9" class="info-content">
            <p>完成任务</p>
            <p>无论是与你的亲朋好友共享购物清单或者是处理项目，奇妙清单都能让你更轻松有趣地完成任务。</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="3">
            <div class="info-img-wrapper">
              <img src="../assets/img/async-icon.png" alt="">
            </div>
          </b-col>
          <b-col cols="9" class="info-content">
            <p>随时被提醒</p>
            <p>永远不会忘记重要的会议、期限或者是牛奶。奇妙清单的提醒设定让你轻松记住大大小小的所有事情。</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="3">
            <div class="info-img-wrapper">
              <img src="../assets/img/people-icon.png" alt="">
            </div>
          </b-col>
          <b-col cols="9" class="info-content">
            <p>让你的生活同步</p>
            <p>支持 iPhone、iPad、Android、Mac、Windows、Windows Phone 和网页，奇妙清单让你的清单在所有设备实时同步。</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  name: 'Signup',
  data() {
    return {
      FormData: {
        username: '',
        password: '',
        password2: ''
      },
      validateResult: {
        username: true,
        password: true,
        password2: true
      }
    }
  },
  methods: {
    validate(username, password, password2) {
      // 用户名密码验证,我们只验证空白输入，以及两次密码不一致的情况
      // 共有三种验证结果，第一种是至少一个为空，返回-2，处理是哪个空白哪个框变红
      // 第二种是都不为空，但两次密码输入不一致，返回-1，处理是密码框变红，提示两次不一致
      // 第三种是正常，返回0
      if (username.trim().length > 0 && password.length > 0 && password === password2) {
        return 0
      }
      if (username.trim().length > 0 && password.length > 0 && password !== password2) {
        this.validateResult.password = false
        this.validateResult.password2 = false
        return -1
      } else {
        if (username.trim() === '') {
          this.validateResult.username = false
        }
        if (password === '') {
          this.validateResult.password = false
        }
        if (password2 === '') {
          this.validateResult.password2 = false
        }
        return -2
      }
    },
    async handleSignup() {
      console.log(this.FormData)
      const result = this.validate(this.FormData.username, this.FormData.password, this.FormData.password2)
      if (result === -2) { console.log('请补充您的注册信息') }
      if (result === -1) { console.log('两次输入的密码不一致') }
      if (result === 0) {
        const mdPassword = CryptoJS.MD5(this.FormData.password).toString()
        const res = await this.$axios.post('/api/signup', { username: this.FormData.username, password: mdPassword })
        if (res.data.code === -1) {
          console.log('用户名已被注册')
        } else if (res.data.code === 0) {
          console.log('注册成功')
          this.$router.push('/login')
        } else {
          console.log('注册失败')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container{
  background: #fafafa;
  height: 100vh;
}
.logo-container{
  justify-content: center;
  padding-top: 40px;
  .logo-img-wrapper {
    text-align: center;

    img {
      display: inline-block;
      width: 80px;
      height: 80px;
    }
  }
  .logo-title{
    margin-top: 25px;
    text-align: center;
    color: #666666;
    font-weight: 300;
  }
}

.form-and-info-container {
  max-width: 840px;
  min-width: 420px;
  margin: 60px auto;

  .form-outer-container {
    justify-content: center;

    .signup-form {
      flex: 0 0 350px;
      height: 265px;
      padding-left: 0;
      padding-right: 0;
      border: 1px solid #ddd;
      border-radius: 4px;

      .input-wrapper {
        height: 60px;
        line-height: 60px;
        display: flex;
        flex-flow: row nowrap;
        border-bottom: 1px solid #ddd;

        span.iconfont {
          width: 24px;
          margin-left: 15px;
          margin-right: 15px;
          color: #4899e2;
          font-size: 20px;
        }

        input {
          width: 100%;
          border: 0;
          outline: none; // 针对Chrome浏览器外框变蓝
          &::placeholder {
            font-size: 16px;
            color: $BLACK_TEXT;
          }

          &.validate-false {
            border: 1px solid #ec4843;
            box-shadow: 0 0 1px #ec4843;
          }
        }
      }
    }

    .button-wrapper {
      padding-left: 15px;
      padding-right: 15px;

      .button-signup {
        width: 100%;
        height: 45px;
        border: 0;
        background: #4c86dd;
        color: #fff;
        font-weight: 700;
        margin-top: 20px;
      }
    }

    .signup {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;

      span:last-child {
        color: #457ae3;
        font-weight: 700;
      }
    }
  }
  .info-container{
    border-left: 1px solid #ddd;
    overflow: hidden;
    .info-img-wrapper{
      width: 60px;
      height: 60px;
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    .info-content{
      p:first-child{
        color: #4088d9;
        font-weight: 700;
        margin-bottom: 8px;
      }
      p:last-child{
        font-size: 14px;
      }
    }
  }
}

</style>
