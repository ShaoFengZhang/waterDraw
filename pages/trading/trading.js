var app = getApp();
let util = require('../../utils/util');
let btnBgm = wx.createInnerAudioContext();
btnBgm.src = "https://tp.datikeji.com/a/15351009376616/brf2xixGd14JpSRTIq3ujdBif0k9pVZzujw2HOws.mpga";
btnBgm.volume = 1;
Page({
  data: {
    ruleState: false,
    page: 1,
    newState: false,
    newState2: true,
    prizeList: [{
        pic: 'https://tp.datikeji.com/a/15330303036545/66PBEoyMJYG7DTDgwfL2vNYP4Hk2kTfpMp6sXS02.png',
        name: '话费1元',
        value: '800水滴币'
      },
      {
        pic: 'https://tp.datikeji.com/a/15330303397758/Dl2iYDeaExJwjcpXa2N5YP5uMigwqQClElrIbg2u.png',
        name: '苹果X',
        value: '7000000水滴币'
      },
      {
        pic: 'https://tp.datikeji.com/a/15330303541466/bvLwvLMttVFSDg4PqY1Di9S5xS47eivOYP69vMq6.png',
        name: '兰博基尼',
        value: '8*10 水滴币'
      },
      {
        pic: 'https://tp.datikeji.com/a/15330303791725/fXYAu1iRxUcd2w8v6QKvhT51ANIJzscHY10BmiQU.png',
        name: '东北大米1kg',
        value: '10000水滴币'
      }
    ],
    header: {
      title: '水滴币商城'
    },
    first: true,
    tradeState: true
  },
  onShow() {
    var that = this;
    if (!that.data.first) {
      that.dataRender(that.data.user_id)
      that.goldRender(that.data.user_id)
    }
  },
  onLoad: function(options) {
    var that = this;
    var bottomList = app.data.bottomImg;
    bottomList[0].done = false;
    bottomList[2].done = false;
    bottomList[1].done = true;
    if (options.shareUid) {
      that.setData({
        shareUid: options.shareUid
      })
    }
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      bottomList: bottomList
    })
    app.data.shareUid = ''
    if (that.data.shareUid) {
      that.setData({
        user_id: app.data.user_id
      })
      util.loading('数据加载中')
      that.setData({
        tradeState: true
      })
      util.postHttp(
        'api/gift_userinfo', {
          user_id: that.data.shareUid
        },
        function(res) {
          if (res.data.status == 0) {
            var inviterInfo = res.data.data;
            that.setData({
              newState: true,
              inviterInfo: inviterInfo
            })
            that.dataRender(that.data.user_id, 'hide')
            that.goldRender(that.data.user_id)
          }
        }
      )
    } else {
      if (!app.data.user_id) {
        util.loading('数据加载中')
        util.login(
          function(res) {
            that.dataRender(res, 'hide')
            that.goldRender(res)
            that.setData({
              user_id: res
            })
          }
        )
      } else {
        util.loading('数据加载中')
        that.setData({
          user_id: app.data.user_id
        })
        that.dataRender(that.data.user_id, 'hide')
        that.goldRender(that.data.user_id)
      }
    }
  },
  goldRender(uid) {
    var that = this;
    util.postHttp(
      'api/my_info', {
        user_id: uid
      },
      function(res) {
        util.hideLoad();
        if (res.data.status == 0) {
          var data = res.data.data;
          var myData = {
            ...data
          }
          that.setData({
            myData: myData
          })
        }
      }
    )
  },
  dataRender(uid, hide) {
    var that = this;
    util.postHttp(
      'api/transaction', {
        user_id: uid,
        page_number: 30,
        page: that.data.page
      },
      function(res) {
        if (that.data.first) {
          that.setData({
            first: false
          })
        }

        if (hide == 'refres') {
          wx.stopPullDownRefresh();
        }
        if (hide == 'hide') {
          util.hideLoad();
        }

        if (res.data.status == 0) {
          var data = res.data.data.transaction;
          data.forEach(function(item) {
            item.reward_time = util.format(item.reward_time * 1000, "MM月dd日 HH:mm")
          })
          if (that.data.page > 1) {
            data = that.data.transaction.concat(data)
          }
          that.setData({
            transaction: data,
            total_pages: res.data.data.total_pages
          })
        }
      }
    )
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
  remindTap() {
    util.noData('额，还在开发中,敬请期待')
  },
  onReachBottom: function(e) {
    // 下拉加载
    var that = this;
    if (that.data.page < that.data.total_pages) {
      that.setData({
        page: that.data.page + 1
      })
      util.loading('数据加载中')
      that.dataRender(that.data.user_id, 'hide')
    } else {
      return
    }
  },
  //提现
  withdrawalTap() {
    var that = this;
    if (that.data.myData.balance < 300) {
      util.noData('微信官方限制必须大于3毛（300水滴币）才能提现', 3000)
    } else {
      wx.showModal({
        title: '请确认提现？',
        confirmText: "确定",
        content: '您本次提现' + that.data.myData.balance + '水滴币=' + (Math.ceil(that.data.myData.balance / 10) / 100).toFixed(2) + '元人民币',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
              util.loading('提现中')
              util.postHttp(
                'api/put_forward', {
                  user_id: app.data.user_id
                },
                function(res) {
                  var msg = res.data.msg
                  if (res.data.status == 0) {
                    util.showMsgSave('温馨提示', '提现成功，请前往微信支付，查看到账情况')
                    that.goldRender(that.data.user_id)
                    that.dataRender(that.data.user_id, 'hide')
                  } else {
                    util.hideLoad();
                    util.showMsgSave('温馨提示', msg)
                  }
                }
              )
          }
        }
      })

    }
  },
  //上啦刷新
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      page: 1
    })
    util.loading('刷新数据中');
    that.dataRender(that.data.user_id, 'refres');
    that.goldRender(that.data.user_id)
  },
  onShareAppMessage: function(e) {
    //分享页面
    var that = this;
    return {
      title: app.data.share_writing,
      path: 'pages/index/index',
      imageUrl: app.data.share_pic,
      success: function(res) {
        // 转发成功
        util.success('分享成功')
      },
      fail: function(res) {
        // 转发失败
        util.noData('取消分享')
      }
    }
  },
  navBack: function() {
    util.navBack()
  },
  closeTap(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 4) {
      that.getForm(e)
      that.setData({
        newState: false
      })
    } else if (type == 5) {
      that.getForm(e)
      that.setData({
        newState2: false
      })
      that.dataRender(that.data.user_id)
      that.goldRender(that.data.user_id)
    }
  },
  getForm(e) {
    var that = this;
    console.log(e)
    if (e) {
      var formId = e.detail.formId;
    } else {
      var formId = ''
    }
    util.postHttp(
      'api/get_form', {
        user_id: app.data.user_id,
        formId: formId
      },
      function(res) {

      }
    )
  },
  swichTap() {
    var that = this;
    util.loading('开启红包中');
    var token = util.md5Toke(app.data.user_id)
    util.postHttp(
      'api/new_big_gift', {
        user_id: app.data.user_id,
        type: 2,
        token: token,
        parent_id: that.data.shareUid
      },
      function(res) {
        if (res.data.status == 0) {
          btnBgm.play()
          util.hideLoad();
          var gift = res.data.data.gift
          that.setData({
            newState: false,
            newState2: true,
            gift: gift,
            shareBottom: true
          })
          that.dataRender(that.data.user_id)
          that.goldRender(that.data.user_id)
        } else {
          util.noData(res.data.msg)
        }
      }
    )
  },
  bottomSwitch(e) {
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    if (index != 1) {
      if (index == 0) {
        console.log(index)
        wx.redirectTo({
          url: '../index/index'
        })
      } else if (index == 2) {
        wx.redirectTo({
          url: '../myself/myself'
        })
      }
    }
  }
})