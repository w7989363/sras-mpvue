<template>
  <div class="page-container">
    <div class="header">订单详情</div>
    <div class="form-container">
      <div class="form-item">
        <div class="label">订单号</div>
        <div class="content">{{order._id}}</div>
      </div>
      <div class="form-item">
        <div class="label">租赁人</div>
        <div class="content">{{order.user}}</div>
      </div>
      <div class="form-item">
        <div class="label">租赁设备</div>
        <div class="content">{{order.detail.name}}</div>
      </div>
      <div class="form-item">
        <div class="label">数量</div>
        <div class="content">{{order.detail.number}}</div>
      </div>
      <div class="form-item">
        <div class="label">租赁日期</div>
        <div class="content">{{order.detail.startDate}}-{{order.detail.endDate}}</div>
      </div>
      <div class="form-item" v-if="otherDevice">
        <div class="label">其他</div>
        <div class="content">{{otherDevice}}</div>
      </div>
      <div class="form-item">
        <div class="label">订单状态</div>
        <div class="content">{{order.status === 'rend' ? '租赁中' : '已归还'}}</div>
      </div>
      <div class="form-item" v-if="order.admin">
        <div class="label">管理员</div>
        <div class="content">{{order.admin}}</div>
      </div>
      <div class="form-item" v-if="order.score">
        <div class="label">评分</div>
        <div class="content">{{order.score}}</div>
      </div>
      <div class="form-item" v-if="order.comment">
        <div class="label">备注</div>
        <div class="content">{{order.comment}}</div>
      </div>
    </div>
    <button v-if="btnShow" class="btn" @click="giveBack" type="primary">确认归还</button>
  </div>
</template>

<script>
import { checkLogin } from '@/utils'

const map = {
  projector: '投影仪',
  mike: '麦克风',
  audio: '音响',
  board: '白板',
  tea: '茶水',
  dessert: '点心',
  fruit: '水果',
  paper: '纸',
  pen: '笔'
}
export default {
  data() {
    return {
      order: {
        _id: '',
        user: '',
        status: '',
        detail: {
          name: '',
          number: '',
          startDate: '',
          endDate: ''
        }
      },
      user: {},
      score: '',
      comment: ''
    }
  },
  computed: {
    otherDevice() {
      let ret = []
      const { auxiliaryDevices, livingMaterials, stationery} = this.order.detail
      auxiliaryDevices && Object.keys(auxiliaryDevices).forEach(name => {
        if (auxiliaryDevices[name]) ret.push(map[name])
      })
      livingMaterials && Object.keys(livingMaterials).forEach(name => {
        if (livingMaterials[name]) ret.push(map[name])
      })
      stationery && Object.keys(stationery).forEach(name => {
        if (stationery[name]) ret.push(map[name])
      })
      return ret.join('、')
    },
    btnShow() {
      return this.user.userType === 'admin' && this.order.status === 'rend'
    },
    btnDisabled() {
      return !this.score
    }
  },
  mounted() {
    this.order = JSON.parse(this.$root.$mp.query.order || '')
    this.user = mpvue.getStorageSync('user') || {}
    checkLogin(this.user)
  },
  methods: {
    giveBack() {

    }
  },
  components: {
    // FixedUser,
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
    .form-item {
      margin-bottom: 30rpx;
      .label {
        color: grey;
        font-size: 14px;
        margin-bottom: 10rpx;
        padding: 0 30rpx;
      }
      .content {
        font-size: 16px;
        color: black;
        min-height: 100rpx;
        line-height: 100rpx;
        background-color: white;
        padding: 0 30rpx;
      }
    }
  }
  .btn {
    width: 80%;
    margin: 30rpx 0 40rpx;
  }
}

</style>
