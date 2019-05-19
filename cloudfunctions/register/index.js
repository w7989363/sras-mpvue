// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const users = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const { username='', password='', tel, userType } = event
  if (username.trim().length === 0 || password.trim().length === 0 || !/^user|admin$/g.test(userType)) {
    return {
      status_code: 1,
      err_msg: '参数错误'
    }
  }
  // 检查用户名是否被占用
  const res1 = await users.where({ username }).count().catch(err => {
    console.log('读取数据库出错', err)
  })
  if (res1 && res1.total !== 0) {
    return {
      status_code: 2,
      err_msg: '用户名重复'
    }
  }
  // 注册
  const res2 = await users.add({
    data: {
      username,
      password,
      tel,
      userType,
      score: 10
    }
  }).catch(err => {
    console.log('新增失败', err)
  })
  if (!res2) {
    return {
      status_code: 3,
      err_msg: '注册失败'
    }
  }
  return {
    status_code: 0,
    err_msg: ''
  }
}