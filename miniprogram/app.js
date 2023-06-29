let that = null

App({
  globalData: {
    hasLogin: false,
    openid: null,
    predictUrl: 'https://poi.emoryhuang.cn/run/predict',
    baseUrl: 'https://poiserver.emoryhuang.cn'
  },
  async onLaunch (e) {
    that = this;
    if (!that.globalData.hasLogin){
      await that.getOpenid()
    }
  },
  async getOpenid () {
    await wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: that.globalData.baseUrl + `/poi/openid?code=${res.code}`,
            method: 'GET',
            success: function (res) {
              that.globalData.openid = res.data
              that.globalData.hasLogin = true
            }
          })
        }
      },
    })
  },
})
