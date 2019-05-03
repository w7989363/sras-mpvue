// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const orderLogCollection = cloud.database().collection('orderLog')

// 云函数入口函数
exports.main = async (event, context) => {
  const { user, userType, orderStatus, skip } = event
  console.log(event)
  let orderList = []
  if (!user || !userType || !orderStatus) {
    return {
      status_code: 1,
      err_msg: 'params err'
    }
  }
  // 普通用户
  userType === 'user' && await orderLogCollection.where({
    user: user,
    status: orderStatus
  }).skip(skip).get().then(res => {
    console.log('user', res)
    orderList = res.data || []
  }).catch(err => {
    console.log('读取数据库出错', err)
  })
  // 管理员
  userType === 'admin' && await orderLogCollection.where({
    status: orderStatus,
    admin: orderStatus === 'rend' ? undefined : user
  }).skip(skip).get().then(res => {
    console.log('admin', res)
    orderList = res.data || []
  }).catch(err => {
    console.log('读取数据库出错', err)
  })
  return {
    status_code: 0,
    data: orderList
  }
}