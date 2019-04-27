<template>
  <div class="resource-container" @click="resourceDetail">
    <div class="name">{{name}}</div>
    <div class="status">{{number}}</div>
    <!-- <div class="status" :style="{color: status === '可租' ? 'green' : 'red'}">{{status}}</div> -->
  </div>
</template>

<script>
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
    }
    // number: {
    //   type: Array,
    //   default: () => [],
    //   required: true
    // }
  },
  computed: {
    // status() {
    //   if (this.number && this.number.length === 0) return ''
    //   return this.number.some(n => n > 0) ? '可租' : '已租完'
    // }
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
.resource-container {
  display: flex;
  justify-content: space-between;
  background: white;
  height: 80rpx;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
  border-radius: 20rpx;
  .status {
    flex: 0 0 3em;
    text-align: right;
  }
  .status, .name {
    line-height: 80rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>