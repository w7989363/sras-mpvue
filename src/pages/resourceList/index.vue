<template>
  <div class="page-container">
    <h2 class="header">{{class1 === 'static' ? '固定设备' : '移动设备'}}</h2>
    <div class="form-container">
      <ResourceItem v-for="resource in resourceList" :key="resource.name" v-bind="resource"></ResourceItem>
    </div>
    <FixedUser />
  </div>
</template>

<script>
import FixedUser from '@/components/FixedUser'
import ResourceItem from '@/components/ResourceItem'
export default {
  data() {
    return {
      class1: '',
      search: '',
      resourceList: [],
    }
  },
  mounted() {
    this.class1 = this.$root.$mp.query.class1
    this.search = this.$root.$mp.query.search
    this.fetchList()
  },
  onPullDownRefresh() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      mpvue.showLoading({ mask: true })
      await mpvue.cloud.callFunction({
        name: 'resourceList',
        data: {
          class1: this.class1,
          search: this.search
        },
      }).then(res =>{
        const { result } = res
        if (result && result.status_code === 0) {
          console.log(result.data)
          this.resourceList = result.data
        } else {
          mpvue.showToast({
            title: result.err_msg,
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
    }
  },
  components: {
    FixedUser,
    ResourceItem
  }
}
</script>

<style lang="less">
.header {
  margin-bottom: 50rpx;
}
</style>
