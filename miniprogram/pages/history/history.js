// pages/history/history.js
const app = getApp()
let that = null // 页面this指针变量

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    num: -1,
    checkins: [{
      id: 0,
      openid: 'None',
      timestamp: 0, 
      time: 'None', 
      address: 'None',
      formatted: 'None',
      latitude: 'None',
      longitude: 'None',
      adInfo: 'None'
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this
    that.setData({
      openid: app.globalData.openid
    })
    await that.getCheckindata()
  },

  async topredict () {
    if (that.data.checkins.length < 10) {
      wx.showModal({
        title: "预测失败", // 提示的标题
        content: "签到数据不足，请保证签到数据大于10条", // 提示的内容
        showCancel: true, // 是否显示取消按钮，默认true
        cancelText: "取消", // 取消按钮的文字，最多4个字符
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "确定", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      })
    } else {
      await wx.request({
        url: app.globalData.predictUrl,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          "data" : [that.data.openid]
        },
        success: function (res) {
          if (res.statusCode == 200) {
            wx.showModal({
              title: "您接下来可能想去", // 提示的标题
              content: res.data.data[0], // 提示的内容
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "确定", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            })
          } else {
            wx.showModal({
              title: "预测失败", // 提示的标题
              content: "预测失败，请联系管理员", // 提示的内容
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "确定", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "预测失败", // 提示的标题
            content: "签到数据不足/存在新的签到地点，请保证签到数量大于10条或联系管理员重新训练模型", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelText: "取消", // 取消按钮的文字，最多4个字符
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确定", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
          })
        }
      })
    }
  },

  async getCheckinNum () {
    await wx.request({
      url: app.globalData.baseUrl + `/poi/getCheckinNum?openid=${that.data.openid}`,
      method: 'GET',
      success: function(res) {
        that.setData({
          num: res.data
        })
      }
    })
  },

  async getCheckindata () {
    // load checkin data
    // await that.getCheckinNum()
    await wx.request({
      url: app.globalData.baseUrl + `/poi/getRecentCheckins?openid=${that.data.openid}&num=20`,
      method: 'GET',
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            checkins: res.data,
            num: res.data.length
          })
        }
      }
    })
  }
})