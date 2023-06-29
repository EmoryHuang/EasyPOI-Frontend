const app = getApp()
Page({
  async onLaunch (e) {
    if (!app.globalData.hasLogin) {
      await getOpenid()
    }
  },
  async getOpenid () {
    await wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: `https://poiserver.emoryhuang.cn/poi/openid?code=${res.code}`,
            method: 'GET',
            success: function (res) {
              app.globalData.openid = res.data
            }
          })
        }
      },
    })
  },
  tomap () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  tohistory () {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
