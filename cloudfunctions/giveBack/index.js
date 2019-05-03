// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const userCollection = cloud.database().collection('user')
const orderLogCollection = cloud.database().collection('orderLog')
// 云函数入口函数
exports.main = async (event, context) => {
  const ret = {}
  const { user, admin, score, orderID, comment } = event
  console.log(event)
  if (!user || !admin || !score || !orderID) {
    return {
      status_code: 1,
      err_msg: 'params err'
    }
  }
  await orderLogCollection.doc(orderID).update({
    data: {
      status: 'over',
      score,
      admin,
      comment: comment || ''
    }
  }).catch(err => {
    console.log('update order err', err)
  })
  await userCollection.where({ username: user }).get()
  .then(res => {
    const { data } = res
    if (!data[0]) {
      ret.status_code = 2
      ret.err_msg = 'user err'
    }
    return userCollection.doc(data[0]._id).update({
      data: { score }
    })
  })
  .then(res => {
    ret.status_code = 0
  })
  .catch(err => {
    console.log(err)
  })
  return ret

}