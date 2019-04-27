<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style lang="less">
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 30rpx;
  padding-top: 60rpx;
  box-sizing: border-box;
}
.form-container {
  width: 70%;
  display: flex;
  flex-direction: column;
  // align-items: center;
  .header {
    text-align: center;
    margin-bottom: 30rpx;
  }
  .btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    margin-bottom: 30rpx;
    font-size: 38rpx;
    border-radius: 40rpx;
  }
  .footer {
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    .footer-tip {
      color: grey;
      font-size: 30rpx;
    }
  }
  .legend {
    font-size: 30rpx;
    color: grey;
    margin-bottom: 20rpx;
  }
  .radio-group {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 20rpx;
    margin-bottom: 30rpx;
    .type-radion {
      font-size: 30rpx;
      height: 70rpx;
      line-height: 70rpx;
    }
  }
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
