// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const resource = cloud.database().collection('resource')

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const { collection, data } = event
  console.log(data)
  // 检查资源名是否被占用
  const res1 = await resource.where({ name: data.name }).count().catch(err => {
    console.log('读取数据库出错', err)
  })
  if (res1 && res1.total !== 0) {
    return {
      status_code: 2,
      err_msg: '资源名称重复'
    }
  }
  console.log(res1)
  const res2 = await resource.add({
    data: data
  }).catch(err => {
    console.log('新增失败', err)
  })
  console.log(res2)
  if (!res2) {
    return {
      status_code: 3,
      err_msg: '新增失败'
    }
  }
  return {
    status_code: 0,
    err_msg: ''
  }
}