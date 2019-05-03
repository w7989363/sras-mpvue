<template>
  <div class="page-container">
    <div class="form-container">
      <h2 class="header">用户登录</h2>
      <icon-input icon="user" circular placeholder="请输入用户名" v-model="username"></icon-input>
      <icon-input icon="pwd" circular type="password" placeholder="请输入密码" v-model="password"></icon-input>
      <button class="btn" type="primary" @click="login">登 录</button>
      <div class="footer">
        <span class="footer-tip" @click="goToRegister">立即注册</span>
        <span class="footer-tip" @click="goToForget">忘记密码</span>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import IconInput from '@/components/IconInput'

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  mounted() {
    this.username = ''
    this.password = ''
  },
  methods: {
    goToRegister() {
      mpvue.navigateTo({
        url: '../register/main'
      })
    },
    goToForget() {
      // 忘记密码
    },
    async login() {
      if (this.username.trim() === '' || this.password.trim() === '') {
        mpvue.showToast({
          title: '请输入用户名和密码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // 登录
      mpvue.showLoading({ mask: true })
      const res = await mpvue.cloud.callFunction({
        name: 'login',
        data: {
          username: this.username,
          password: md5(this.password)
        },
      }).catch(err => {
        console.log(err)
      })
      mpvue.hideLoading({})
      console.log(res)
      // 登陆成功
      if (res && res.result && res.result.status_code === 0) {
        console.log('setStorage user:', res.result.data)
        mpvue.setStorage({
          key: 'user',
          data: res.result.data
        })
        // 跳转
        mpvue.redirectTo({
          url: '../search/main'
        })
        return
      }
      // 登录失败
      mpvue.showToast({
        title: res.result.err_msg,
        icon: 'none',
        duration: 2000
      })
      
      
      
    }
  },
  components: {
    IconInput
  }
}
</script>

<style lang="less">

</style>
