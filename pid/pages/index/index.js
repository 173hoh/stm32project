// index.js脚本文件,逻辑交互
//获取
Page({
  //获取用户id
  getopenid()
  {
    wx.cloud.callFunction({
      name:"GetOpenID"
    }).then(res=>
      {console.log("获取openid成功",res)//打印正确信息，用，才能读到信息
    }).catch(res=>
      {console.log("获取openid失败",res)//打印错误信息
    })
  },
  //用户授权
  author(){
    wx.requestSubscribeMessage({
      tmplIds: ['dE0l5Qa0U2F6MSzrXvOut3cE5zUsRIGrRvKBKiUmP94'],
      success(res){
      console.log("授权成功",res)//打印正确信息，用，才能读到信息
      },
      fail(res){
      console.log("授权失败",res)//打印错误信息
      }
    })
  },
  //发送消息给单个用户
  sendone(){
    wx.cloud.callFunction({
    name:"Send",//调用云函数无用户id
    data:{
      openid:"o2THL65DHaRmpS-nGfTA9fsLPdw4"
    }
    }).then(res=>
      {console.log("发送信息成功",res)//打印正确信息，用，才能读到信息
    }).catch(res=>
      {console.log("发送消息失败",res)//打印错误信息
    })
  },//读取三个云开发参数
  data: {
    temp:"",
    humi:"",
    heart:"",
    led :0,
    showModal: false
  },
  
  //事件处理函数,类似main函数
  getinfo (){
  var that = this 
  //以下信息直接调用API接入
   wx.request({
              url: 'https://iot-api.heclouds.com/thingmodel/query-device-property',
              method:"get",
              header:{
                "Accept": "application/json, text/plain, */*",
                "authorization": "version=2018-10-31&res=products%2FAb74P35jd9%2Fdevices%2Fht2&et=1741424148&method=md5&sign=vFnmZcLn8cXTi7vILUjIZg%3D%3D"
              },
              data:{
                product_id:'Ab74P35jd9',
                device_name:'ht2'
              },
              success:function(res){
                console.log("获取成功",res);
                //console.log("获取成功",e);
                that.setData({
                  temp:res.data.data[2].value ,
                  humi:res.data.data[1].value ,
                  heart:res.data.data[0].value 
                 //mov: res.data,
                })
                console.log("temp=",that.data.temp),
                console.log("humi=",that.data.humi),
                console.log("heart=",that.data.heart)
                },
        });
      },
      
//函数与函数间要逗号隔开
  onLoad(){
        var that = this
        setInterval(function(){
          that.getinfo()
        },2000)
      
  }
})


  
  