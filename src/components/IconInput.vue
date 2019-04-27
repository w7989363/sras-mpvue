<template>
  <div class="icon-input" :style="{borderRadius: circular ? '50rpx' : ''}">
    <img v-if="icon !== ''" class="icon" :src="iconMap[icon]" >
    <input
      class="input"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)" />
  </div>
</template>

<script>
const iconMap = {
  user: '/static/images/user.png',
  pwd: '/static/images/pwd.png',
  tel: '/static/images/tel.png',
  success: '/static/images/success.png',
  search: '/static/images/search.png',
  error: '/static/images/tel.png',
  my: '/static/images/my.png',
}
export default {
  inheritAttrs: false,
  props: {
    value: {
      String,
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    circular: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconMap
    }
  }
}
</script>

<style lang="less" scoped>
.icon-input {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  background-color: white;
  margin-bottom: 30rpx;
  .icon {
    width: 32rpx;
    height: 32rpx;
    margin-left: 20rpx;
  }
  .input {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    flex: 1;
    margin: 0 20rpx;
  }
}
</style>
