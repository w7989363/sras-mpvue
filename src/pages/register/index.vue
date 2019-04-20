<template>
  <div class="page-container">
    <div class="form-container">
      <h2 class="header">用户注册</h2>
      <div class="icon-input">
        <img src="/static/images/user.png">
        <input type="text" placeholder="请输入用户名" v-model="username" />
      </div>
      <div class="icon-input">
        <img src="/static/images/pwd.png">
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>
      <div class="icon-input">
        <img src="/static/images/pwd.png">
        <input type="password" placeholder="请确认密码" v-model="confirmPassword" />
      </div>
      <div class="icon-input">
        <img src="/static/images/tel.png">
        <input type="text" placeholder="请输入手机号" v-model="tel" />
      </div>
      <div class="legend">请选择您的身份</div>
      <radio-group class="radio-group" @change="typeChange">
        <label class="type-radion">
          <radio id="user" value="user" checked />普通用户
        </label>
        <label class="type-radion">
          <radio id="admin" value="admin" />管理员
        </label>
      </radio-group>
      <button class="btn" type="primary" @click="register">立即注册</button>

    </div>
    
  </div>
</template>

<script>
import md5 from 'js-md5'
import { setTimeout } from 'timers';

const db = mpvue.cloud.database()
const users = db.collection('user')
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      tel: '',
      userType: 'user'
    }
  },
  methods: {
    typeChange(e) {
      this.userType = e.target.value
    },
    async register() {
      if (this.username.trim() === '') {
        mpvue.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.password !== this.confirmPassword) {
        mpvue.showToast({
          title: '两次密码不一致',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.tel.trim() === '') {
        mpvue.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // 开始注册流程
      mpvue.showLoading({
        title: '',
        mask: true
      })
      // 查询是否被占用
      let res = await users.where({
        username: this.username
      }).get().catch(err => {
        console.log('读取数据库出错', err)
      })
      console.log(res)
      if (res && res.data && res.data.length !== 0) {
        mpvue.hideLoading({})
        mpvue.showToast({
          title: '用户名重复',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // 注册
      res = await users.add({
        data: {
          username: this.username,
          password: md5(this.password),
          tel: this.tel,
          userType: this.userType
        }
      }).catch(err => {
        console.log('新增失败', err)
      })
      if (!res) {
        mpvue.hideLoading({})
        mpvue.showToast({
          title: '注册失败',
          icon: 'none',
          duration: 2000
        })
        return
      }
      mpvue.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      })
      // 注册成功，返回登录页
      setTimeout(() => {
        mpvue.navigateBack({
          delta: 1
        })
      }, 1000)
      
    }
  }
}
</script>

<style lang="less">


</style>
