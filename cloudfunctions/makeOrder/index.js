// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const resource = cloud.database().collection('resource')
const resourceLog = cloud.database().collection('resourceLog')
const orderLog = cloud.database().collection('orderLog')

// 云函数入口函数
exports.main = async (event, context) => {
  const ret = {}
  const { user, orders } = event
  if (!user || !orders) {
    ret.status_code = 1
    ret.err_msg = 'params err'
    return ret
  }
  // TODO: 判断订单是否可插入
  // 在 resourceLog 每个日期生成一条记录，方便计算可预订的数量
  // 在 orderLog 生成一条记录，用以订单列表和管理端评分、评分列表
  // 分配规则

  // 获取 resource 详情
  await resource.where({ name }).get()
  .then(res => {
    if (res.data && res.data.length === 0) {
      throw 'params err'
    }
    detail = res.data[0]
    const _ = cloud.database().command
    // 获取该 resource 从明天开始的所有租用记录
    return resourceLog.where({
      name: name,
      date: _.gt(dayjs().format('YYY-MM-DD'))
    }).get()
  })
  .then(res => {
    // 格式化为 7 元数组，代表每天的剩余数量
    const map = {}
    for (let i = 1; i <= 7; i++) {
      map[dayjs().add(i, 'day').format('YYYY-MM-DD')] = detail.number
    }
    res.data.forEach(item => {
      const { date, number } = item
      map[date] -= number
    })
    ret.status_code = 0
    ret.data = { ...detail, number: map }
  })
  .catch(err => {
    console.log('读取数据库出错', err)
    ret.status_code = 1
    ret.err_msg = err.toString()
  })
  return ret

}