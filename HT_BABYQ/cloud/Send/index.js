// 云函数入口文件，发送订阅消息
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
      // 发送订阅信息
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,//选择推送用户
        page: 'pages/index/index', // 调用该小程序所在页面
        data: {
　　　　// 推送内容
        thing5: {
          value: '模块检测异常'
        },
        thing4: {
          value: '有难以预估的生命危险'
        },
        thing3: {
          value: '请打开小程序查看'
        }
        },
      templateId: 'dE0l5Qa0U2F6MSzrXvOut3cE5zUsRIGrRvKBKiUmP94'
       //模板id与上面一致
     })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
//配置完成跳到index.js
