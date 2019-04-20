<template>
  <div class="page-container">
    <div class="form-container">
      <h2 class="header">用户登录</h2>
      <div class="icon-input">
        <img src="/static/images/user.png">
        <input type="text" placeholder="请输入用户名" v-model="username" />
      </div>
      <div class="icon-input">
        <img src="/static/images/pwd.png">
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>
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
import { constants } from 'crypto';

const db = mpvue.cloud.database()
const users = db.collection('user')
export default {
  data() {
    return {
      username: '',
      password: ''
    }
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
      // 登录，失败则提示，成功则跳转到一级页面，存储一下用户名、用户类型
      console.log(md5(this.password))
      mpvue.showLoading({
        title: '',
        mask: true
      })
      const res = await users.where({
        username: this.username
      }).get().catch(err => {
        console.log('读取数据库出错', err)
      })
      if (res && res.data && res.data.length !== 0) {
        const data = res.data[0]
        if (data.username === this.username && data.password === md5(this.password)) {
          // 登陆成功
          // 存储用户名、用户类型
          mpvue.setStorage({
            key: 'user',
            data: {
              username: data.username,
              userType: data.userType
            }
          })
          // 跳转
          mpvue.navigateTo({
            url: '../search/main'
          })
          return
        }
      }
      // 登录失败
      mpvue.hideLoading({})
      mpvue.showToast({
        title: '用户名或密码错误',
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="less">

</style>
