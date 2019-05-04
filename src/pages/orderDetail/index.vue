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
      <template v-if="user.userType === 'user'">
        <div class="form-item" v-if="order.admin">
          <div class="label">管理员</div>
          <div class="content">{{order.admin}}</div>
        </div>
        <div class="form-item" v-if="order.score">
          <div class="label">评分(0~10)</div>
          <div class="content">{{order.score}}</div>
        </div>
        <div class="form-item" v-if="order.comment">
          <div class="label">备注</div>
          <div class="content">{{order.comment}}</div>
        </div>
      </template>
      <template v-if="user.userType === 'admin'">
        <div class="form-item" v-if="order.admin">
          <div class="label">管理员</div>
          <div class="content">{{order.admin}}</div>
        </div>
        <div class="form-item">
          <div class="label">评分(0~10)</div>
          <div class="content" v-if="order.score">{{order.score}}</div>
          <div class="content" v-else>
            <input class="score-input" type="number" v-model="score" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">备注</div>
          <div class="content" v-if="order.comment">{{order.comment}}</div>
          <div class="content" v-else>
            <textarea class="comment-input" v-model="comment" placeholder="评分理由" />
          </div>
        </div>
      </template>
      
    </div>
    <button v-if="btnShow" class="btn" @click="giveBack" type="primary" :disabled="btnDisabled">确认归还</button>
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
      if (this.score === '') return true
      const score = parseInt(this.score)
      if (score >= 0 && score <= 10) return false
      return true
    }
  },
  mounted() {
    this.score = ''
    this.comment = ''
    this.order = JSON.parse(this.$root.$mp.query.order || '')
    this.user = mpvue.getStorageSync('user') || {}
    checkLogin(this.user)
  },
  methods: {
    async giveBack() {
      mpvue.showLoading({ mask: true })
      await mpvue.cloud.callFunction({
        name: 'giveBack',
        data: {
          user: this.order.user,
          admin: this.user.username,
          score: parseInt(this.score),
          comment: this.comment,
          orderID: this.order._id
        },
      }).then(res => {
        if (res.result.status_code === 0) {
          mpvue.showToast({
            title: '归还成功',
            icon: 'none',
            duration: 1000
          })
          setTimeout(() => {
            mpvue.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          throw res.result.err_msg
        }
      }).catch(err => {
        mpvue.showToast({
          title: err || '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
      mpvue.hideLoading()
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
      box-sizing: border-box;
      .label {
        color: grey;
        font-size: 14px;
        margin-bottom: 10rpx;
        padding: 0 30rpx;
      }
      .content {
        font-size: 16px;
        color: grey;
        min-height: 100rpx;
        line-height: 100rpx;
        background-color: white;
        padding: 0 30rpx;
        box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.2);
      }
      .score-input {
        height: 100rpx;
        line-height: 100rpx;
        color: black;
      }
      .comment-input {
        width: 100%;
        height: 300rpx;
        line-height: 40rpx;
        padding: 20rpx 0;
        color: black;
      }
    }
  }
  .btn {
    width: 80%;
    margin: 30rpx 0 40rpx;
  }
}

</style>
