import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    env: 'sras-cloud',
    traceUser: true
  })
}

const app = new Vue(App)
app.$mount()

