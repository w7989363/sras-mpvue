<template>
  <div class="page-container">
    <h2 class="header">{{name}}</h2>
    <div class="form-container">
      <div class="form-item">
        <div class="label">开始日期</div>
        <picker class="picker" mode="date" @change="startDate = $event.target.value" :start="startMin" :end="dateMax">{{startDate}}</picker>
      </div>
      <div class="form-item">
        <div class="label">结束日期</div>
        <picker class="picker" mode="date" @change="endDate = $event.target.value" :start="endMin" :end="dateMax">{{endDate}}</picker>
      </div>
      <div class="form-item">
        <div class="label">数量</div>
        <picker class="picker" @change="number = $event.target.value" :range="numberRange">{{number}}</picker>
      </div>
    </div>
    <template v-if="otherShow">
      <h2 class="header">辅助设备</h2>
      <div class="form-container">
        <div class="switch-item">
          <div class="switch-label">投影仪</div>
          <switch :checked="auxiliaryDevices.projector" @change="auxiliaryDevices.projector = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">麦克风</div>
          <switch :checked="auxiliaryDevices.mike" @change="auxiliaryDevices.mike = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">音响</div>
          <switch :checked="auxiliaryDevices.audio" @change="auxiliaryDevices.audio = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">白板(配白板笔和板擦)</div>
          <switch :checked="auxiliaryDevices.board" @change="auxiliaryDevices.board = $event.target.value"></switch>
        </div>
      </div>
      <h2 class="header">生活物资</h2>
      <div class="form-container">
        <div class="switch-item">
          <div class="switch-label">茶水</div>
          <switch :checked="livingMaterials.tea" @change="livingMaterials.tea = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">点心</div>
          <switch :checked="livingMaterials.dessert" @change="livingMaterials.dessert = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">水果</div>
          <switch :checked="livingMaterials.fruit" @change="livingMaterials.fruit = $event.target.value"></switch>
        </div>
      </div>
      <h2 class="header">文具</h2>
      <div class="form-container">
        <div class="switch-item">
          <div class="switch-label">纸</div>
          <switch :checked="stationery.paper" @change="stationery.paper = $event.target.value"></switch>
        </div>
        <div class="switch-item">
          <div class="switch-label">笔</div>
          <switch :checked="stationery.pen" @change="stationery.pen = $event.target.value"></switch>
        </div>
      </div>
    </template>
    <button class="btn" @click="addToShopcart" type="primary" :disabled="btnDisabled">{{btnName}}</button>
    <!-- <FixedUser /> -->
  </div>
</template>

<script>
// import FixedUser from '@/components/FixedUser'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      btnName: '加入订单',
      detail: {},
      name: '',
      startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      number: 0,
      auxiliaryDevices: {
        projector: true,
        mike: true,
        audio: true,
        board: true
      },
      livingMaterials: {
        tea: true,
        dessert: true,
        fruit: true
      },
      stationery: {
        paper: true,
        pen: true
      }
    }
  },
  computed: {
    otherShow() {
      if (!this.name) return false
      return this.name.indexOf('会议室') > -1
    },
    startMin() {
      return dayjs().add(1, 'day').format('YYYY-MM-DD')
    },
    endMin() {
      return this.startDate
    },
    dateMax() {
      return dayjs().add(7, 'day').format('YYYY-MM-DD')
    },
    numberRange() {
      if (!this.detail.number) return [0]
      let min = Number.MAX_VALUE
      let date = this.startDate
      while (date <= this.endDate) {
        if (this.detail.number[date] < min) min = this.detail.number[date]
        date = dayjs(date).add(1, 'day').format('YYYY-MM-DD')
      }
      return Array.from({length: min + 1}).map((v, i) => i)
    },
    btnDisabled() {
      return this.number === 0
    }
  },
  watch: {
    startDate(newVal) {
      if (this.endDate < newVal) this.endDate = newVal
    },
    numberRange(newVal) {
      this.number = Math.min(this.number, newVal[newVal.length-1])
    }
  },
  mounted() {
    this.name = this.$root.$mp.query.name
    this.fetchDetail()
    this.recoverData()
  },
  onPullDownRefresh() {
    this.fetchDetail()
    this.recoverData()
  },
  methods: {
    async fetchDetail() {
      mpvue.showLoading({ mask: true })
      await mpvue.cloud.callFunction({
        name: 'resourceDetail',
        data: { name: this.name },
      }).then(res =>{
        console.log(res)
        const { result } = res
        if (result && result.status_code === 0) {
          console.log(result.data)
          this.detail = result.data
        } else {
          mpvue.showToast({
            title: result.err_msg || '',
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
      mpvue.stopPullDownRefresh()
      mpvue.hideLoading({})
    },
    recoverData() {
      const shopcart = mpvue.getStorageSync('shopcart') || {}
      if (!shopcart[this.name]) {
        this.btnName = '加入订单'
        this.startDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
        this.endDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
        this.number = 0
        this.auxiliaryDevices = {
          projector: true,
          mike: true,
          audio: true,
          board: true
        }
        this.livingMaterials = {
          tea: true,
          dessert: true,
          fruit: true
        }
        this.stationery = {
          paper: true,
          pen: true
        }
      } else {
        const data = shopcart[this.name]
        this.btnName = '修改订单'
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.number = data.number
        Object.assign(this.auxiliaryDevices, data.auxiliaryDevices)
        Object.assign(this.livingMaterials, data.livingMaterials)
        Object.assign(this.stationery, data.stationery)
      }
      
    },
    addToShopcart() {
      mpvue.showLoading({ mask: true })
      const data = {
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        number: this.number,
      }
      if (this.otherShow) {
        // data.auxiliaryDevices = this.convert2array(this.auxiliaryDevices),
        // data.livingMaterials = this.convert2array(this.livingMaterials),
        // data.stationery = this.convert2array(this.stationery)
        data.auxiliaryDevices = { ...this.auxiliaryDevices }
        data.livingMaterials = { ...this.livingMaterials }
        data.stationery = { ...this.stationery }
        delete data.auxiliaryDevices.__newReference
        delete data.livingMaterials.__newReference
        delete data.stationery.__newReference
      }
      let shopcart = mpvue.getStorageSync('shopcart') || {}
      shopcart[data.name] = data
      mpvue.setStorage({
        key: 'shopcart',
        data: shopcart,
        success: () => {
          mpvue.hideLoading({})
          mpvue.showToast({
            title: '添加成功',
            duration: 2000,
            mask: true
          })
          setTimeout(() => {
            mpvue.navigateBack({
              delta: 1
            })
          }, 2000)
        },
        fail: () => {
          mpvue.hideLoading({})
          mpvue.showToast({
            icon: 'none',
            title: '添加失败，请重试',
            duration: 2000,
            mask: true
          })
        }
      })
      
    },
    convert2array(obj) {
      return Object.keys(obj).filter(k => obj[k] && k !== '__newReference')
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
      .picker {
        color: green;
        height: 100rpx;
        line-height: 100rpx;
        background-color: white;
        padding: 0 30rpx;
      }
    }
    .switch-item {
      background-color: white;
      display: flex;
      justify-content: space-between;
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 30rpx;
      margin-bottom: 30rpx;
    }
  }
  .btn {
    width: 80%;
    margin: 30rpx 0 40rpx;
  }
}

</style>
