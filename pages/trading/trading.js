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
    newState2: false,
    ifShowWater_guide: false,
    userState: false,
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
      title: '水滴抽奖'
    },
    first: true,
    redbao: 4,
    tradeState: true,
    sponer:false
  },
  onShow() {
    var that = this;
    if (!that.data.first) {
      that.dataRender(that.data.user_id)
      that.goldRender(that.data.user_id)
    };
    this.setData({
      foucsQrShow: false,
      foucssessionShow: false,
      ifShowFocusMask: false,
      foucstxtnumShow: true,
      guideTop: wx.getStorageSync('topHeight'),
    });

    if (wx.getStorageSync('water_guide')) {
      this.setData({
        ifShowWater_guide: false,
      })
    } else {
      wx.setStorage({
        key: 'water_guide',
        data: '1',
      });
      this.setData({
        ifShowWater_guide: true,
      })
    }

    if (this.MallTime) {
      clearInterval(this.MallTime);
      this.clickMall = false;
      if (this.MallCount && this.MallCount < 20) {
        wx.showModal({
          title: '',
          confirmText: "确定",
          content: '试玩20秒以上才能获得奖励',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {

            }
          }
        })
      }
      if (this.MallCount && this.MallCount > 20) {
        this.addWaterCoin();
      }
    }


  },
  onHide() {
    clearInterval(this.MallTime);
    let _this = this;
    this.MallCount = 0;
    if (this.clickMall) {
      this.MallTime = setInterval(function() {
        _this.MallCount++;
        console.log(_this.MallCount);
      }, 1000)
    }
  },
  onLoad: function(options) {
    var that = this;
    var bottomList = app.data.bottomImg;
    bottomList[0].done = false;
    bottomList[2].done = false;
    bottomList[3].done = false;
    bottomList[1].done = true;
    if (options) {
      if (options.isnewuser) {
        that.setData({
          isnewuser: true
        })
      }
      if (options.sponer) {
        that.setData({
          sponer:true
        })
      }
    }
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      bottomList: bottomList
    })
    that.authorStep()
    if (that.data.sponer) {
      util.loading('数据加载中')
      that.setData({
        user_id: app.data.user_id
      })
      that.dataRender(that.data.user_id, 'hide')
      that.goldRender(that.data.user_id)
      that.switchNewUserRedBao();
      that.getShoppingMall();
    } else {
      if (!app.data.user_id || !util.checkNumber(app.data.user_id)) {
        util.loading('数据加载中')

        if (that.data.isnewuser) {
          that.setData({
            newState2: true,
          })
        }
        util.login(
          function(res) {
            that.setData({
              user_id: res
            })
            that.dataRender(res, 'hide')
            that.goldRender(res)

            that.getShoppingMall();
          }
        )
      } else {
        util.loading('数据加载中')
        if (that.data.isnewuser){
          that.setData({
              newState2: true
          })
        }
        that.setData({
          user_id: app.data.user_id,
        })
        that.dataRender(that.data.user_id, 'hide')
        that.goldRender(that.data.user_id)
        that.getShoppingMall();
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
        if (res.data.status == 0) {
          var data = res.data.data;
          var myData = {
            ...data
          }
          that.setData({
            myData: myData,
            is_granted: res.data.data.is_granted,
            is_put_forward: res.data.data.is_put_forward
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
          util.hideLoad();
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
    console.log(that.data.is_granted)
    if (that.data.is_granted == 1) {
      wx.getUserInfo({
        success: function(res) {
          util.loading('请稍后')
          util.author(res,
            function() {
              util.hideLoad()
              that.setData({
                userState: true,
                is_granted: 2
              })

              if (that.data.myData.balance < 300) {
                util.noData('微信官方限制必须大于3毛（300水滴币）才能提现', 3000);
                return;
              } else {
                if (that.data.is_put_forward == 1) {
                  that.setData({
                    ifShowFocusMask: true
                  });
                  setTimeout(function() {
                    that.setData({
                      foucssessionShow: true,
                      foucstxtnumShow: false,
                    })
                  }, 800)
                  return;
                };
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
            }
          )
        }
      })
    } else {
      if (that.data.myData.balance < 300) {
        util.noData('微信官方限制必须大于3毛（300水滴币）才能提现', 3000);
        return;
      } else {
        if (that.data.is_put_forward == 1) {
          that.setData({
            ifShowFocusMask: true
          });
          setTimeout(function() {
            that.setData({
              foucssessionShow: true,
              foucstxtnumShow: false,
            })
          }, 800)
          return;
        };
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
    var path = 'pages/jump/jump?uid=' + app.data.user_id;
    console.log(path)
    return {
      title: app.data.share_writing,
      path: path,
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
  bottomSwitch(e) {
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    if (index != 1) {
      if (index == 0) {
        console.log(index)
        wx.redirectTo({
          url: '../index/index'
        })
      } else if (index == 3) {
        wx.redirectTo({
          url: '../myself/myself'
        })
      } else if (index == 2) {
        wx.redirectTo({
          url: '../prizeRank/prizeRank'
        })
      }
    }
  },
  switchNewUserRedBao() {
    let _this = this;
    util.postHttp(
      'api/newer_share', {
        user_id: app.data.user_id,
        type: 2,
      },
      function(res) {
        if (res.data.status == 0) {
          btnBgm.play()
          var gift = res.data.data.gift;
          _this.setData({
            gift: gift,
            newState2: true,
          })
        } else {
          util.noData(res.data.msg)
        }
      }
    )
  },
  // 关闭关注公众号弹窗
  closeFocusOnMask() {
    this.setData({
      ifShowFocusMask: !this.data.ifShowFocusMask,
      foucsQrShow: false,
      foucssessionShow: false,
      foucstxtnumShow: true,
    })
  },
  foucssessionEvent(e) {
    let _this = this;
    setTimeout(function() {
      _this.setData({
        foucsQrShow: true,
      })
    }, 1200)

  },
  foucsQrEvent(e) {
    let _this = this;
    setTimeout(function() {
      _this.setData({
        foucstxtnumShow: true,
      })
    }, 1200)
  },
  closeGuide() {
    this.setData({
      ifShowWater_guide: false,
    })
  },
  getShoppingMall() {
    let _this = this;
    util.postHttp(
      'api/sponsor_list', {
        user_id: app.data.user_id,
        page: 1,
        per_page: 100,
      },
      function(res) {
        _this.shoppingList = res.data.data.data;
        if (res.data.status == 0) {
          if (_this.shoppingList.length > 0) {
            for (let i = 0; i < _this.shoppingList.length; i++) {
              _this.shoppingList[i].name = _this.shoppingList[i].name.slice(0, 5);
            }
            _this.setData({
              shoppingList: _this.shoppingList,
            })
          } else {
            _this.setData({
              shoppingList: []
            })
          }
        } else {
          util.noData(res.data.msg)
        }
      }
    )
  },

  addWaterCoin() {
    let _this = this;
    util.postHttp(
      'api/sponsor_try_play', {
        user_id: app.data.user_id,
        only_sign: _this.MallId || 6,
      },
      function(res) {
        if (res.data.status == 0) {
          util.noData(res.data.msg);
          _this.goldRender(_this.data.user_id);
          _this.dataRender(_this.data.user_id);
          _this.getShoppingMall();
        } else {
          util.noData(res.data.msg)
        }
      }
    )
  },
  MinMallClickEvent(e) {
    let Id = e.currentTarget.dataset.mallid;
    this.MallId = Id;
    this.clickMall = true;
  },

  bindGetUserInfo(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      util.loading('请稍后')
      util.author(res.detail, function() {
        util.hideLoad()
        that.setData({
          userState: true,
          is_granted: 2
        })
        that.withdrawalTap()
      })
    } else {
      wx.showModal({
        title: '',
        content: '需授权才能提现'
      })
    }
  },
  authorStep() {
    var that = this;

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          that.setData({
            userState: true
          })
        } else {

        }
      }
    })
  }

})