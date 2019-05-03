<template>
  <div class="resource-container" @click="$emit('click')">
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
  },
  computed: {
  },
  methods: {
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
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.2);
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