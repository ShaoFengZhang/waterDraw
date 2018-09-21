const ald = require('./utils/ald-stat.js')
App({
  data: {
    //api: 'https://xcx6.datikeji.com/', 线上
    api:'https://xcx11.datikeji.com/',
    currentInfo: '',
    bottomImg: [{
        img: "https://tp.datikeji.com/a/15354603904865/nqOEcMlQK6L2VUWAjw970Pp8kqtctbxoJVysTBRz.png",
        activeImg: 'https://tp.datikeji.com/a/15355081078817/MIfoNJCBl2cxwOnzw1bU27OUqq9OnLQH27nJRfPG.png',
        text: '水滴抽奖',
        done: false
      },
      {
        img: "https://tp.datikeji.com/a/15354604066923/4UbQfWLng9EmrnS6hB7xurb6GUSaUrZr6mGnjIXv.png",
        activeImg: "https://tp.datikeji.com/a/15355081274715/0hesjyQSVConxAIRUiyAPwrcld8DACH4il0ZmGgD.png",
        text: '水滴币商城',
        done: false
      },
      {
        img: "https://tp.datikeji.com/a/15354604176366/LwImuZIsnyBIKvM7QE6XZAd2dCkbjVEDNDdcm3T2.png",
        activeImg: 'https://tp.datikeji.com/a/15355081577006/kW0AocKeAH6oK2smEJV0Lak8Z9WTYFME7S7INvPF.png',
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