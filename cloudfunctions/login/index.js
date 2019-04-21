// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const users = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { username, password } = event
  const res = await users.where({ username }).get().catch(err => {
    console.log('读取数据库出错', err)
  })
  if (res && res.data && res.data.length !== 0) {
    const data = res.data[0]
    if (data.username === username && data.password === password) {
      return {
        status_code: 0,
        data: {
          username: data.username,
          userType: data.userType
        },
        err_msg: ''
      }
    }
  }
  return {
    status_code: 1,
    err_msg: '用户名或密码错误'
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}