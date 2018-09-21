var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    page: 1,
    page_number: 30,
    myself:false,
    header: {
      title: '全部参与人',
      navBack: true
    }
  },
  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid,
      user_id: app.data.user_id,
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight
    })
    util.loading('加载数据中')
    that.partRender(that.data.user_id, 'hide')
  },
  partRender(user, hide) {
    var that = this;
    util.postHttp(
      'api/participants_number', {
        user_id: user,
        rid: that.data.rid,
        page: that.data.page,
        page_number: 30
      },
      function (res) {
        if (hide) {
          util.hideLoad();
        }
        var data = res.data.data;

        if (that.data.page > 1) {
          data.participant = that.data.partData.participant.concat(data.participant)
        } else {
          if (data.myself) {
            that.setData({
              myself:true
            })
            data.participant.unshift(data.myself);
          }
        }
        that.setData({
          partData: data
        })
      }
    )
  },
  onReachBottom: function (e) {
    // 上啦加载
    var that = this;
    if (that.data.page < that.data.partData.total_pages) {
      that.setData({
        page: that.data.page + 1
      })
      util.loading('加载数据中')
      that.partRender(that.data.user_id, 'hide')
    } else {
      return
    }
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
  winNumberTap(e){
    var that = this;
    var num = e.currentTarget.dataset.num;
    if(num>0){
      util.noData('TA中过' + num + '次奖', 2000)
    }
  }
})