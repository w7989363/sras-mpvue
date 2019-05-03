// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { collection } = event
  const store = cloud.database().collection(collection)
  const _ = cloud.database().command
  store.where({
    _id: _.neq('')
  }).get().then(res => {
    const { data } = res
    data.forEach(item => {
      store.doc(item._id).remove()
    })
  })
  return
}