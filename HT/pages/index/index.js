const config = require('../../libs/config.js');

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    city: '',
    pois: []
  },

  onLoad() {
    this.getCurrentLocation();
  },

  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02', // 高德支持的坐标系
      success: (res) => {
        const { latitude, longitude } = res;
        this.setData({ latitude, longitude });
        this.getNearbyPOI(longitude, latitude); // 注意顺序，高德是 经度,纬度
      },
      fail: () => {
        wx.showToast({ title: '定位失败', icon: 'error' });
      }
    });
  },

  getNearbyPOI(longitude, latitude, keywords = '') {
    const url = `https://restapi.amap.com/v3/place/around?key=${config.key}&location=${longitude},${latitude}&keywords=${keywords}&radius=1000&output=json`;

    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.data.status === "1") {
          const pois = res.data.pois.map(poi => ({
            id: poi.id,
            title: poi.name,
            address: poi.address,
            longitude: parseFloat(poi.location.split(',')[0]),
            latitude: parseFloat(poi.location.split(',')[1])
          }));

          this.setData({
            markers: pois.map(p => ({
              id: p.id,
              latitude: p.latitude,
              longitude: p.longitude,
              title: p.title,
              iconPath: "../../img/marker.png",
              width: 25,
              height: 25
            })),
            pois
          });
        } else {
          console.error("高德 API 返回错误", res.data);
        }
      },
      fail: (err) => {
        console.error("请求高德失败", err);
      }
    });
  }
});
