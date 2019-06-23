<template>
  <div class="page-container">
    <h2 class="header">搜索</h2>
    <div class="form-container">
      <icon-input icon="search" circular placeholder="搜索" v-model="searchText"></icon-input>
      <button class="btn" type="primary" @click="resourceList('static')">本地设备</button>
      <button class="btn" type="primary" @click="resourceList('mobile')">可移动设备</button>
    </div>
    <FixedUser />
  </div>
</template>

<script>
import IconInput from '@/components/IconInput'
import FixedUser from '@/components/FixedUser'

export default {
  data() {
    return {
      searchText: '',
    }
  },
  methods: {
    resourceList(class1) {
      mpvue.navigateTo({
        url: `../resourceList/main?class1=${class1}&search=${this.searchText}`
      })
    },
  },
  components: {
    IconInput,
    FixedUser
  }
}
</script>

<style lang="less">
.header {
  margin-bottom: 50rpx;
}
.btn {
  margin-top: 30rpx;
}
</style>
