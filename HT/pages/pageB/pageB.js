import mqtt from "../../utils/mqtt.min.js";

Page({
  data: {
    status: "未连接",
    receivedMessage: "none",
    client: null,

    // 页面绑定数据
    distance: "--",
    heart: "--",
    temp: "--",
    humi: "--",
    roll: "--",
    pitch: "--",
    angleX: "--",
    angleY: "--"
  },

  onLoad() {
    this.connectMqtt();
  },

  connectMqtt() {
    const that = this;

    const options = {
      connectTimeout: 5000,
      clientId: "wx_client_" + Math.random().toString(16).substr(2, 8),
      username: "admin",
      password: "aw336688990"
    };

    const client = mqtt.connect("wxs://broker.emqx.io:8084/mqtt", options);
    that.setData({ client });

    client.on("connect", () => {
      console.log("✅ MQTT 已连接");
      that.setData({ status: "MQTT 连接成功 ✅" });

      client.subscribe("ESP8266TX", (err) => {
        if (!err) {
          console.log("📡 已订阅 ESP8266TX");
        } else {
          console.error("❌ 订阅失败", err);
        }
      });
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      console.log("📩 收到消息:", topic, msg);
      that.setData({ receivedMessage: msg });

      try {
        const data = JSON.parse(msg);

        // 虚拟字段
        const virtualDistance = (Math.random() * 10).toFixed(1);
        const virtualRoll = (Math.random() * 180 - 90).toFixed(2);
        const virtualPitch = (Math.random() * 180 - 90).toFixed(2);

        that.setData({
          // 虚拟数据
          distance: virtualDistance,
          roll: virtualRoll,
          pitch: virtualPitch,

          // 实际数据
          heart: data.heart !== undefined ? data.heart : "--",
          temp: data.temp !== undefined ? data.temp : "--",
          humi: data.humi !== undefined ? data.humi : "--",
          angleX: data.angleX !== undefined ? data.angleX : "--",
          angleY: data.angleY !== undefined ? data.angleY : "--"
        });

      } catch (e) {
        console.warn("⚠️ 收到非 JSON 消息，跳过解析");
      }
    });

    client.on("error", (err) => {
      console.error("❌ MQTT 错误:", err);
      that.setData({ status: "连接失败 ❌" });
    });

    client.on("close", () => {
      console.warn("⚠️ MQTT 断开连接");
      that.setData({ status: "已断开 ❌" });
    });
  },

  // ✅ 如果需要保留虚拟回传测试
  fakeReceive(topic, msgStr) {
    const msgBuf = new TextEncoder().encode(msgStr);
    this.data.client.emit("message", topic, msgBuf);
  },

  sendZero() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish("ESP8266RX", "0", {}, (err) => {
        if (!err) console.log("✅ 已发送 0 到 ESP8266RX");
      });
    } else {
      wx.showToast({ title: 'MQTT未连接', icon: 'error' });
    }
  },

  sendOne() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish("ESP8266RX", "1", {}, (err) => {
        if (!err) console.log("✅ 已发送 1 到 ESP8266RX");
      });
    } else {
      wx.showToast({ title: 'MQTT未连接', icon: 'error' });
    }
  }
});
