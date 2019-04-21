<template>
  <div class="page-container">
    <div class="form-container">
      <h2 class="header">用户注册</h2>
      <icon-input icon="user" placeholder="请输入用户名" v-model="username"></icon-input>
      <icon-input icon="pwd" type="password" placeholder="请输入密码" v-model="password"></icon-input>
      <icon-input icon="pwd" type="password" placeholder="请确认密码" v-model="confirmPassword"></icon-input>
      <icon-input icon="tel" placeholder="请输入手机号" v-model="tel"></icon-input>
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
import IconInput from '@/components/IconInput'

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
      mpvue.showLoading({
        title: '',
        mask: true
      })
      const res = await mpvue.cloud.callFunction({
        name: 'register',
        data: {
          username: this.username,
          password: md5(this.password),
          tel: this.tel,
          userType: this.userType
        },
      }).catch(err => {
        console.log(err)
      })
      console.log(res)
      mpvue.hideLoading({})
      if (res && res.result && res.result.status_code === 0) {
        mpvue.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        })
        // 返回登录页
        setTimeout(() => {
          mpvue.navigateBack({
            delta: 1
          })
        }, 1000)
        return
      }
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
