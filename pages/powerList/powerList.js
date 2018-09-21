var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    page: 1,
    page_number: 30,
    header: {
      title: '好友助力榜',
      navBack: true
    }
  },
  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid,
      user_id: app.data.user_id,
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      myHead: app.data.head_pic,
      nick_name :app.data.nick_name
    })
    util.loading('加载数据中')
    that.powerRender(that.data.user_id, 'hide')
  },
  powerRender(user, hide) {
    var that = this;
    util.postHttp(
      'api/help_list', {
        user_id: user,
        rid: that.data.rid,
        page: that.data.page,
        page_number: that.data.page_number
      },
      function (res) {
        if (hide) {
          util.hideLoad();
        }
        if (res.data.status == 0) {
          var data = res.data.data;
          if (that.data.page > 1) {
            data.childs = that.data.powerData.childs.concat(data.childs)
          } 
          that.setData({
            powerData: data
          })
        }
      }
    )
  },
  onReachBottom: function (e) {
    // 上啦加载
    var that = this;
    if (that.data.page < that.data.powerData.total_pages) {
      that.setData({
        page: that.data.page + 1
      })
      util.loading('加载数据中')
      that.powerRender(that.data.user_id, 'hide')
    } else {
      return
    }
  },
  //活动规则
  ruleTap() {
    var that = this;
    that.setData({
      ruleState: true
    })
  },
  closeRuleTap() {
    var that = this;
    that.setData({
      ruleState: false
    })

  },
  // 阻止向下捕捉
  cancel() {
    return false
  },
  onShareAppMessage: function (e) {
    //分享页面
    var that = this;
    return {
      title: app.data.share_writing,
      path: 'pages/index/index',
      imageUrl: app.data.share_pic,
      success: function (res) {
        // 转发成功
        util.success('分享成功')
      },
      fail: function (res) {
        // 转发失败
        util.noData('取消分享')
      }
    }
  },
  navBack: function () {
    util.navBack()
  }
})