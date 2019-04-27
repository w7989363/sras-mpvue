// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const resource = cloud.database().collection('resource')

// 云函数入口函数
exports.main = async (event, context) => {
  const { class1, search } = event
  if (class1 === '') {
    return {
      status_code: 1,
      err_msg: 'params error'
    }
  }
  const res = await resource.where({ class1: class1 }).get().catch(err => {
    console.log('读取数据库出错', err)
  })
  let data = res.data
  if (search && search.trim() !== '') {
    data = data.filter(item => {
      const temp = `${item.name}${item.class1}${item.class2}${item.class3}`
      return temp.search(search) >= 0
    })
  }
  return {
    status_code: 0,
    data
  }
}