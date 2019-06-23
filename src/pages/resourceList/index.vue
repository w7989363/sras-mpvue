<template>
  <div class="page-container">
    <h2 class="header">{{class1 === 'static' ? '本地设备' : '可移动设备'}}</h2>
    <div class="form-container">
      <ResourceItem
        v-for="resource in resourceList"
        :key="resource.name"
        v-bind="resource"
        @click="handleClick(resource)">
      </ResourceItem>
    </div>
    <FixedUser />
  </div>
</template>

<script>
import FixedUser from '@/components/FixedUser'
import ResourceItem from '@/components/ResourceItem'
import { checkLogin } from '@/utils'
export default {
  data() {
    return {
      user: {},
      class1: '',
      search: '',
      resourceList: [],
    }
  },
  mounted() {
    this.resourceList = []
    this.class1 = this.$root.$mp.query.class1
    this.search = this.$root.$mp.query.search
    this.user = mpvue.getStorageSync('user') || {}
    checkLogin(this.user)
    this.fetchList()
  },
  async onPullDownRefresh() {
    await this.fetchList()
    mpvue.stopPullDownRefresh()
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
      mpvue.hideLoading({})
    },
    handleClick(resource) {
      if (this.user.userType === 'user') {
        mpvue.navigateTo({
          url: `../resourceDetail/main?name=${resource.name}`
        })
      }
      if (this.user.userType === 'admin') {
        mpvue.navigateTo({
          url: `../orderList/main?name=${resource.name}&orderStatus=rend`
        })
      }
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
