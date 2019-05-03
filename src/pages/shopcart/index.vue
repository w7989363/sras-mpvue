<template>
  <div class="page-container">
    <h2 class="header">待确认订单</h2>
    <div class="form-container">
      <OrderItem
        v-for="item of shopcartList"
        :key="item.name"
        v-bind="item"
        :userType="user.userType"
        @click="handleClick(item.name)">
      </OrderItem>
    </div>
    <div class="btn-container">
      <button class="btn" @click="clearShopcart">一键取消</button>
      <button class="btn" @click="showModal" type="primary" :disabled="btnDisabled">一键预约</button>
    </div>
    <!-- <FixedUser /> -->
  </div>
</template>

<script>
import OrderItem from '@/components/OrderItem'
import { checkLogin } from '@/utils'
export default {
  data() {
    return {
      user: {},
      shopcartList: {}
    }
  },
  computed: {
    btnDisabled() {
      return Object.keys(this.shopcartList).length === 0
    }
  },
  watch: {
  },
  onShow() {
    this.refresh()
  },
  onPullDownRefresh() {
    this.refresh()
    mpvue.stopPullDownRefresh()
  },
  methods: {
    refresh() {
      this.shopcartList = mpvue.getStorageSync('shopcart')
      this.user = mpvue.getStorageSync('user') || {}
      checkLogin(this.user)
    },
    handleClick(name) {
      console.log('click', name)
      mpvue.navigateTo({
        url: `../resourceDetail/main?name=${name}`
      })
    },
    clearShopcart() {
      mpvue.removeStorageSync('shopcart')
      this.refresh()
    },
    showModal() {
      mpvue.showModal({
        title: '提示',
        content: '一旦预约成功不能取消，且最终预约到的设备数量与信用有关，并可在“我的订单”中查看最终结果',
        success: (res) => {
          if (res.confirm) {
            this.makeOrder()
          }
        }
      })
    },
    async makeOrder() {
      mpvue.showLoading({ mask: true })
      await mpvue.cloud.callFunction({
        name: 'makeOrder',
        data: {
          user: this.user.username,
          orders: this.shopcartList
        },
      }).then(res =>{
        console.log(res)
        const { result } = res
        if (result && result.status_code === 0) {
          // 预约成功，清空 shopcart，跳转到我的订单
          mpvue.removeStorage({ key: 'shopcart' })
          mpvue.redirectTo({
            url: '../orderList/main?orderStatus=rend'
          })
        } else if (result && result.status_code === 2) {
          // 部分预约失败，应该返回失败的订单 err_orders
          console.log(result)
          // storage 中留下失败的 然后 refresh
          const { err_orders } = result
          const shopcart = {}
          err_orders.forEach(resourceName => {
            shopcart[resourceName] = this.shopcartList[resourceName]
          })
          mpvue.setStorage({
            key: 'shopcart',
            data: shopcart,
            success: () => {
              mpvue.showToast({
                title: '部分下单失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              setTimeout(() => this.refresh(), 1000)
            }
          })
        } else {
          // 其他错误
          mpvue.showToast({
            title: result.err_msg || '请求错误',
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
        console.log(err)
        mpvue.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
      mpvue.hideLoading({})
    },
  },
  components: {
    OrderItem
  }
}
</script>

<style lang="less" scoped>
.page-container {
  padding-left: 0;
  padding: 0;
  .header {
    margin-bottom: 30rpx;
    flex: 0 0;
  }
  .form-container {
    width: 100%;
    flex: 1 1;
  }
  .btn-container {
    width: 100%;
    flex: 0 0 140rpx;
    line-height: 140rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    background-color: white;
    .btn {
      width: 40%;
      height: 100rpx;
      line-height: 100rpx;
    }
    .btn:first-child {
      background-color: #dda350;
      color: white;
    }
  }
  
}

</style>
