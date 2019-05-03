<template>
  <div class="page-container">
    <img src="/static/images/my.png" class="avatar">
    <p class="user-info">用户名：{{user.username}}</p>
    <p class="user-info">类型：{{user.userType === 'user' ? '普通用户' : '管理员'}}</p>
    <p v-if="user.userType === 'user'" class="user-info">积分：{{user.score}}</p>
    <div v-if="user.userType === 'user'" class="form-container">
      <button class="btn" type="primary" @click="myShopcart">待确认订单</button>
      <button class="btn" type="primary" @click="myOrder('rend')">我的订单</button>
      <button class="btn" type="primary" @click="myOrder('over')">租赁记录</button>
      <button class="btn warn" @click="logout">注销</button>
    </div>
    <div v-else>
      <button class="btn" type="primary" @click="myOrder('rend')">待打分订单</button>
      <button class="btn" type="primary" @click="myOrder('over')">打分记录</button>
      <button class="btn warn" @click="logout">注销</button>
    </div>
  </div>
</template>

<script>
import { logout, checkLogin } from '@/utils'
export default {
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    this.user = mpvue.getStorageSync('user') || {}
    checkLogin(this.user)
  },
  methods: {
    myShopcart() {
      mpvue.navigateTo({
        url: '../shopcart/main'
      })
    },
    myOrder(orderStatus) {
      mpvue.navigateTo({
        url: `../orderList/main?orderStatus=${orderStatus}`
      })
    },
    logout() {
      logout()
    }
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  border: 3px solid black;
  padding: 30rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.user-info {
  margin-bottom: 20rpx;
}
.btn {
  margin-bottom: 40rpx;
}
.warn {
  background-color: #dda350;
  color: white;
}
</style>
