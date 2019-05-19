// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')

cloud.init()
const userCollection = cloud.database().collection('user')
const resourceLogCollection = cloud.database().collection('resourceLog')
const orderLogCollection = cloud.database().collection('orderLog')

// 获取订单中每个 resource 的信息
async function getResourcesInfo(orders) {
  const resourceInfo = {}
  await Promise.all(Object.keys(orders).map(name => {
    return cloud.callFunction({
      name: 'resourceDetail',
      data: { name }
    })
  })).then(resArr => {
    resArr.forEach(({result}) => {
      const { data } = result
      resourceInfo[data.name] = data
    })
  }).catch(err => {
    console.log(err)
  })
  return resourceInfo
}

// 某个 resource 能不能下单
function canMakeOrder(order, resourceInfo) {
  const { startDate, endDate, number: wantNumber } = order
  const { number } = resourceInfo || {}
  // 开始截止日期不对
  if (!(startDate in number) || !(endDate in number)) return false
  // 遍历开始到结束日期
  for (let date = startDate; date <= endDate; date = dayjs(date).add(1, 'day').format('YYYY-MM-DD')) {
    if (number[date] < wantNumber) return false
  }
  return true
}

// 订单记录
async function makeOrderLog(user, order) {
  let res = true
  let orderID
  const number = Math.round(parseInt(order.number) * parseInt(user.score) / 10)
  if (number === 0) return false
  await orderLogCollection.add({
    data: {
      user: user.username,
      resource: order.name,
      detail: {
        ...order,
        number
      },
      status: 'rend'
    }
  }).then(res => {
    orderID = res._id
    const dates = generateDates(order)
    return Promise.all(dates.map(date => {
      return resourceLogCollection.add({
        data: {
          user: user.username,
          name: order.name,
          date,
          number,
          orderID
        }
      })
    }))
  }).catch(err => {
    res = false
    // 回滚
    console.log('roll back', err)
    orderLogCollection.doc(orderID).remove()
    resourceLogCollection.where({ orderID }).get().then(res => {
      const { data } = res
      data.forEach(item => {
        resourceLogCollection.doc(item._id).remove()
      })
    })
  })
  return res
}

// 生成startDate到endDate的数组
function generateDates(order) {
  const { startDate, endDate } = order
  const dates = []
  for (let date = startDate; date <= endDate; date = dayjs(date).add(1, 'day').format('YYYY-MM-DD')) {
    dates.push(date)
  }
  return dates
}

// 云函数入口函数
exports.main = async (event, context) => {
  const ret = {}
  const { user, orders } = event
  if (!user || !orders) {
    ret.status_code = 1
    ret.err_msg = 'params err'
    return ret
  }
  // 获取用户数据
  const userRes = await userCollection.where({ username: user }).get().catch(err => {
    console.log('读取数据库出错', err)
  })
  if (userRes.data.length && userRes.data.length === 0) {
    ret.status_code = 1
    ret.err_msg = 'params err'
    return ret
  }
  const userInfo = userRes.data[0]
  // 获取订单中每个 resource 的信息
  const resourceInfo = await getResourcesInfo(orders)
  console.log(resourceInfo)
  if (Object.keys(resourceInfo).length !== Object.keys(orders).length) {
    ret.status_code = 2
    ret.err_msg = 'db_resouce_detail err'
    return ret
  }
  const errResource = []
  // 处理每一个 resource
  for (resourceName in orders) {
    // 判断订单是否可插入
    if (canMakeOrder(orders[resourceName], resourceInfo[resourceName])) {
      // 插入失败，记录，回滚
      if (!await makeOrderLog(userInfo, orders[resourceName])) {
        errResource.push(resourceName)
      }
    } else {
      console.log(resourceName+'  cant make order')
      errResource.push(resourceName)
    }
  }
  console.log(errResource)
  ret.status_code = errResource.length === 0 ? 0 : 2
  ret.err_orders = errResource
  return ret
  
}

