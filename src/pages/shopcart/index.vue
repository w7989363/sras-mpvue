<template>
  <div class="page-container">
    <h2 class="header">待确认订单</h2>
    <div class="form-container">
      <ShopcartItem v-for="item of shopcartList" :key="item.name" v-bind="item"></ShopcartItem>
    </div>
    <div class="btn-container">
      <button class="btn" @click="clearShopcart">一键取消</button>
      <button class="btn" @click="makeOrder" type="primary" :disabled="btnDisabled">一键预约</button>
    </div>
    <!-- <FixedUser /> -->
  </div>
</template>

<script>
import ShopcartItem from '@/components/ShopcartItem'
export default {
  data() {
    return {
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
    },
    clearShopcart() {
      mpvue.removeStorageSync('shopcart')
      this.refresh()
    },
    makeOrder() {
      // TODO: 发送请求生成订单
      // 在 resourceLog 每个日期生成一条记录，方便计算可预订的数量
      // 在 orderLog 生成一条记录，用以订单列表和管理端评分、评分列表
    }
  },
  components: {
    ShopcartItem
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
