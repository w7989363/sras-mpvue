<template>
  <div class="shopcart-container" @click="resourceDetail">
    <div class="name">{{name}}</div>
    <div class="number">{{number}}</div>
    <div class="date">
      <div class="tip">租用日期</div>
      <div class="tip">{{start}}~{{end}}</div>
    </div>
    <!-- <div class="number" :style="{color: number === '可租' ? 'green' : 'red'}">{{number}}</div> -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {

    }
  },
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    number: {
      type: Number,
      default: 0,
      required: true
    },
    startDate: {
      type: String,
      default: '',
      required: true
    },
    endDate: {
      type: String,
      default: '',
      required: true
    }
    // number: {
    //   type: Array,
    //   default: () => [],
    //   required: true
    // }
  },
  computed: {
    start() {
      return dayjs(this.startDate).format('YYYY.MM.DD')
    },
    end() {
      return dayjs(this.endDate).format('YYYY.MM.DD')
    }
  },
  methods: {
    resourceDetail() {
      mpvue.navigateTo({
        url: `../resourceDetail/main?name=${this.name}`
      })
    }
  }
}
</script>

<style lang="less">
.shopcart-container {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  background: white;
  height: 100rpx;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
  // border-radius: 20rpx;
  .name, .number, .date {
    line-height: 100rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    flex: 0 0 30%;
  }
  .number {
    flex: 0 0 15%;
    text-align: center;
  }
  .date {
    font-size: 12px;
    flex: 0 0 45%;
    text-align: center;
    display: flex;
    flex-direction: column;
    .tip {
      height: 50rpx;
      line-height: 50rpx;
    }
  }
}
</style>