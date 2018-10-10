const ald = require('./utils/ald-stat.js')
var App = require('./utils/xmadx_sdk.min.js').xmad(App, 'App').xmApp;
App({
  data: {
    //api: 'https://xcx6.datikeji.com/',//目前线上
    api: 'https://xcx11.datikeji.com/', 
    currentInfo: '',
    bottomImg: [{
      img: "https://tp.datikeji.com/a/15382106238542/LriMCtuiNIaoyuWiMDgUlUKG4r4ViLaTTBtEYHFN.png",
        activeImg: 'https://tp.datikeji.com/a/15382070326586/GSXFDgeukaS55deIly06Ncenprq9GfGEPdiiuPqB.png',
        text: '首页',
        done: false
      },
      {
        img: "https://tp.datikeji.com/a/15382106434482/5TXsPamYgwD1wYwHvPZXZkv8xX4RzcVAhYyy0BYk.png",
        activeImg: "https://tp.datikeji.com/a/15382070551012/VpASB9qUc1DQOMAUo1kSFIYraymv8cLkTZGeNL3w.png",
        text: '水滴币',
        done: false
      },
      {
        img: "https://tp.datikeji.com/a/15382106606922/5SM1xCVIl5YV0hZay4JKAMdowkZr3HHIrlcqZ8xg.png",
        activeImg: 'https://tp.datikeji.com/a/15382070789025/MAe1lJl4BnFennAMnwjuCvQeIX8KAKdfhQed3QxA.png',
        text: '中奖榜',
        done: false
      },
      {
        img: "https://tp.datikeji.com/a/15382106525619/W49Cj1myLq8qPTHhQmwmwS1A8nMH1pVwft78LtzO.png",
        activeImg: 'https://tp.datikeji.com/a/15382070975862/SxYmf0Y5ncQSFHUrQ4KMI6CDd6cRg6BjhGgEDS3P.png',
        text: '我的',
        done: false
      }
    ]
  },
  onLaunch: function(options) {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调

    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
    })
    var that = this;
    //测试
    var data = wx.getStorageSync('app.data');

    that.data.currentInfo = data.currentInfo;
    that.data.user_id = data.user_id;
    that.data.share_pic = data.share_pic;
    that.data.share_writing = data.share_writing;
    that.data.nick_name = data.nick_name;
    that.data.head_pic = data.head_pic;
    that.data.oldDate = data.oldDate;
    //测试
    wx.getSystemInfo({
      success: function(res) {
        // 状态栏高度
        wx.setStorageSync('statusBarHeight', res.statusBarHeight + 'px');
        // 头部高度
        wx.setStorageSync('topHeight', (res.statusBarHeight + 44) + 'px')
        //屏幕宽度
        wx.setStorageSync('screenWidth', res.screenWidth);
        //屏幕高度
        wx.setStorageSync('screenHeight', res.screenHeight);

        that.data.statusBarHeight = wx.getStorageSync('statusBarHeight')
        that.data.topHeight = wx.getStorageSync('topHeight')
        that.data.screenHeight = wx.getStorageSync('screenHeight')
        that.data.screenWidth = wx.getStorageSync('screenWidth')
      }
    })
  }
})