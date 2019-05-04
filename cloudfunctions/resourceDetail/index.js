// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')

cloud.init()
const resource = cloud.database().collection('resource')
const resourceLog = cloud.database().collection('resourceLog')

// 云函数入口函数
exports.main = async (event, context) => {
  // 服务器时区为 0 时区，使用东八区时间
  const zone8time = dayjs().add(480 - dayjs().utcOffset(), 'minute')
  const ret = {}
  let detail = {}
  const { name } = event
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
      date: _.gt(zone8time.format('YYYY-MM-DD'))
    }).get()
  })
  .then(res => {
    console.log('resourceLog',res)
    // 格式化为 7 元数组，代表每天的剩余数量
    const map = {}
    for (let i = 1; i <= 7; i++) {
      map[zone8time.add(i, 'day').format('YYYY-MM-DD')] = parseInt(detail.number)
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
