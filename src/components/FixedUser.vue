<template>
  <img class="fixed-user" src="/static/images/my.png" @click="goToUser()" />
</template>

<script>
export default {
  methods: {
    goToUser() {
      mpvue.navigateTo({
        url: '../user/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fixed-user {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 300rpx;
  border: 3px solid black;
  padding: 10rpx;
  box-sizing: border-box;
}
</style>