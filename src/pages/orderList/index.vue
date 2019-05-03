<template>
  <div class="page-container">
    <scroll-view
      class="scroll-wrapper"
      :scroll-y="true"
      @scrolltolower="loadMore">
      <h2 class="header">{{pageTitle}}</h2>
      <div class="form-container">
        <OrderItem
          v-for="item of filteredList"
          :key="item._id"
          v-bind="item.detail"
          :user="user"
          :orderUser="item.user"
          @click="handleClick(item)">
        </OrderItem>
        <div class="tips" v-if="tips">{{tips}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import OrderItem from '@/components/OrderItem'
import { checkLogin } from '@/utils'
export default {
  data() {
    return {
      name: '',
      user: {},
      orderList: [],
      orderStatus: 'rend',
      noMore: false
    }
  },
  computed: {
    pageTitle() {
      if (this.name !== '') return this.name
      if (!this.user || !this.user.username) {
        return '我的订单'
      }
      if (this.user.userType === 'user') {
        // 普通用户界面
        return this.orderStatus === 'rend' ? '我的订单' : '租赁记录'
      } else {
        // 管理员界面
        return this.orderStatus === 'rend' ? '待打分订单' : '打分记录'
      }
    },
    filteredList() {
      if (this.name === '') return this.orderList
      return this.orderList.filter(order => order.resource === this.name)
    },
    skip() {
      return this.orderList.length
    },
    tips() {
      const tip = '温馨提示：请用户按时间准时到达，如有迟到晚退等现象会影响信用哦！'
      return this.pageTitle === '我的订单' ? tip : ''
    }
  },
  mounted() {
    this.noMore = false
    this.name = this.$root.$mp.query.name || ''
    this.orderStatus = this.$root.$mp.query.orderStatus || 'rend'
    this.user = mpvue.getStorageSync('user') || {}
    checkLogin(this.user)
    this.fetchData(true)
  },
  async onPullDownRefresh() {
    await this.fetchData(true)
    mpvue.stopPullDownRefresh()
  },
  methods: {
    loadMore() {
      if (this.noMore) return
      this.fetchData()
    },
    async fetchData(refresh) {
      if (refresh) this.orderList = []
      mpvue.showLoading({ mask: true })
      await mpvue.cloud.callFunction({
        name: 'orderList',
        data: {
          user: this.user.username,
          userType: this.user.userType,
          orderStatus: this.orderStatus,
          skip: this.skip
        },
      }).then(res => {
        console.log(res)
        const { result } = res
        if (result && result.status_code !== 0) {
          throw result.err_msg
        }
        if (result && result.data) {
          if (result.data.length === 0) {
            // 没有更多数据了
            this.noMore = true
            mpvue.showToast({
              title: '没有更多了...',
              icon: 'none',
              duration: 1000
            })
          } else {
            // 反回了新数据
            this.orderList.push(...result.data)
          }
        }
      }).catch(err => {
        console.log(err)
        mpvue.showToast({
          title: err || '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
      mpvue.hideLoading({})
    },
    handleClick(order) {
      console.log(order)
      mpvue.navigateTo({
        url: `../orderDetail/main?order=${JSON.stringify(order)}`
      })
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
  .scroll-wrapper {
    height: 100vh;
  }
  .header {
    margin-bottom: 30rpx;
    text-align: center;
    flex: 0 0;
  }
  .form-container {
    width: 100%;
    flex: 1 1;
    .tips {
      color: grey;
      font-size: 12px;
      padding: 0 30rpx;
      margin: 100rpx 0 50rpx;
    }
  }
  
}

</style>
