const mqtt = require('../../utils/mqtt.min.js');

Page({
  data: {
    status: "等待连接...",
    receivedMessage: "无",
    Temp: "--",    
    Humi: "--",    
    Lux: "--",   
    PH: "--",      
    Tds: "--",     
    WaterLevel: "--", 
    value: 0       
  },

  onLoad() {
    this.connectMqtt();
  },

  connectMqtt() {
    const options = {
      connectTimeout: 5000,
      clientId: "wx_client_" + Math.random().toString(16).substr(2, 8),
      username: "admin",
      password: "aw336688990"
    };

    const client = mqtt.connect("wxs://broker.emqx.io:8084/mqtt", options);

    client.on("connect", () => {
      this.setData({ status: "MQTT 连接成功 ✅" });
      console.log("MQTT 连接成功");

      client.subscribe("ESP8266TX", (err) => {
        if (!err) {
          console.log("已订阅 ESP8266TX");
        }
      });

      // 定时发送 value，每 10 秒一次
      this.valueInterval = setInterval(() => {
        this.sendMessage("ESP8266RX", `value=${this.data.value}`);
        console.log(`定时发送 value=${this.data.value}`);
      }, 10000); 
    });

    client.on("message", (topic, message) => {
      const msgStr = message.toString();
      console.log(`收到消息: ${topic} -> ${msgStr}`);

      try {
        const jsonData = JSON.parse(msgStr);

        this.setData({
          receivedMessage: msgStr,
          Temp: jsonData.Temp || "--",
          Humi: jsonData.Humi || "--",
          Lux: jsonData.Lux || "--",
          PH: jsonData.PH || "--",
          Tds: jsonData.Tds || "--",
          Water: jsonData.Water || "--"
        });

      } catch (error) {
        console.error("JSON 解析失败", error);
      }
    });

    client.on("error", (error) => {
      this.setData({ status: "连接失败 ❌" });
      console.error("MQTT 连接失败", error);
    });

    this.client = client;
  },

  sendMessage(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
      console.log(`已发送: ${topic} -> ${message}`);
    }
  },

  increaseValue() {
    this.setData({
      value: this.data.value + 10
    });
    this.sendMessage("ESP8266RX", `value=${this.data.value}`);
  },

  decreaseValue() {
    this.setData({
      value: this.data.value - 10
    });
    this.sendMessage("ESP8266RX", `value=${this.data.value}`);
  },

  // 退出页面时清除定时器，防止后台任务运行
  onUnload() {
    if (this.valueInterval) {
      clearInterval(this.valueInterval);
      console.log("清除定时发送任务");
    }
  }
});
