var touchDot = 0; //触摸时的原点
var time = 0; //  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = ""; // 记录/清理 时间记录
var tmpFlag = true; // 判断左右华东超出菜单最大值时不再执行滑动事件
var flag = true;
let btnBgm = wx.createInnerAudioContext();
btnBgm.src = "https://tp.datikeji.com/a/15351009376616/brf2xixGd14JpSRTIq3ujdBif0k9pVZzujw2HOws.mpga";
btnBgm.volume = 1;
var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    leftDirection: false,
    leftDirection2: false,
    rightDirection: false,
    rightDirection2: false,
    loginState: false,
    ruleState: false,
    goldState2: false,
    shareState: false,
    backState: false,
    winState: false,
    nowinState: false,
    firstState: true,
    newState: false,
    newState2: false,
    redbao: 3,
    tradeState: false,
    shareBottom: false,
    shareFirst: true,
    toView: '',
    is_new: 1,
    header: {
      title: '奖品详情',
      navBack: true
    },
    timeClock: null,
    timeNum: 0,
    tOhterSatus: false,
    showbottombtn: false,
  },
  onShow() {
    var that = this;
    if (that.data.timeClock) {
      clearInterval(that.data.timeClock)
    }
    if (that.data.tOhterSatus) {
      if (that.data.timeNum <= 20) {
        util.noData('需试玩超过20秒才能加码', 5000)
      }
      if (that.data.timeNum > 20) {
        util.loading('加码中')
        util.postHttp(
          'api/is_played', {
            user_id: that.data.user_id,
            rid: that.data.rid
          },
          function(res) {
            if (res.data.status == 0) {
              util.noData(res.data.msg);
              setTimeout(function() {
                btnBgm.play()
              }, 500)
              //详情
              that.detailRender(that.data.user_id)
              //助力
              that.powerRender(that.data.user_id)
            }
          }
        )
      }
      that.setData({
        tOhterSatus: false,
        timeNum: 0
      })
    }
    if (!that.data.firstState) {
      //详情
      that.detailRender(that.data.user_id, 'noLoad')
      //助力
      that.powerRender(that.data.user_id)
    }
  },
  tOtherProgram() {
    var that = this;
    if (that.data.allDetail.is_try_play == 0) {
      that.setData({
        tOhterSatus: true
      })
    }
  },
  onHide() {
    var that = this;
    if (that.data.tOhterSatus) {
      var timeClock = setInterval(function() {
        that.data.timeNum++
          that.setData({
            timeNum: that.data.timeNum
          })
        console.log(that.data.timeNum)
      }, 1000)
      that.setData({
        timeClock: timeClock
      })
      console.log('走了')
    }

  },
  onLoad(options) {
    var that = this;

    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight
    })
    if (options.uid) {
      that.setData({
        backState: true,
        otherUid: options.uid,
        rid: options.rid
      })
    } else if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      let info_arr = [];
      info_arr = scene.split('a');
      that.setData({
        backState: true,
        otherUid: info_arr[0],
        rid: info_arr[1],
      })
    } else {
      that.setData({
        otherUid: '',
        rid: options.rid
      })
    }
    that.userInfo()
    util.loading('数据加载中')
    if (!app.data.user_id) {
      util.login(
        function(uid, is_new) {
          if (app.data.head_pic && app.data.nick_name) {
            that.setData({
              loginState: false
            })
          }
          that.setData({
            user_id: uid
          })
          if (is_new == 0 && that.data.otherUid) {
            that.setData({
              is_new: 0
            })
            util.postHttp(
              'api/gift_userinfo', {
                user_id: that.data.otherUid
              },
              function(res) {
                if (res.data.status == 0) {
                  var inviterInfo = res.data.data;
                  that.setData({
                    newState: true,
                    inviterInfo: inviterInfo
                  })
                  //详情
                  that.detailRender(uid)
                  //助力
                  that.powerRender(uid)
                }
              }
            )
          } else {
            //详情
            that.detailRender(uid)
            //助力
            that.powerRender(uid)
          }
        }
      )
    } else {
      that.setData({
        user_id: app.data.user_id
      })
      //详情
      that.detailRender(that.data.user_id)
      //助力
      that.powerRender(that.data.user_id)
    }
    wx.showShareMenu({
      withShareTicket: true,
    })
  },
  bindGetUserInfo(res) {
    var that = this;
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      util.author(res.detail, that.drawTap)
      that.setData({
        loginState: false
      })
    } else {
      util.showMsg('温馨提示', '需授权头像、昵称后，才能参与抽奖')
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
        user_id: that.data.user_id,
        formId: formId
      },
      function(res) {

      }
    )
  },
  userInfo() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          if (app.data.head_pic && app.data.nick_name) {
            that.setData({
              loginState: false
            })
          } else {
            that.setData({
              loginState: true
            })
          }
        } else {

        }
      }
    })
  },
  // 抽奖
  drawTap(e) {
    var that = this;
    btnBgm.play()
    var token = util.md5Fun(that.data.rid, that.data.user_id, that.data.detailData.open_type)
    console.log(token)
    if (!app.data.nick_name) {
      wx.getUserInfo({
        success: function(res) {
          util.author(res,
            function() {
              if (e) {
                var formId = e.detail.formId;
              } else {
                var formId = ''
              }
              util.loading('正在参与')
              util.postHttp(
                'api/luck_draw', {
                  invited_user_id: that.data.user_id,
                  invitation_user_id: that.data.otherUid,
                  rid: that.data.rid,
                  formId: formId,
                  open_type: that.data.detailData.open_type,
                  token: token,
                  is_new: that.data.is_new
                },
                function(res) {
                  that.setData({
                    showbottombtn: true,
                  })
                  if (res.data.status == 0) {
                    //详情
                    that.detailRender(that.data.user_id, 'draw')
                    //助力
                    that.powerRender(that.data.user_id)
                  } else {
                    util.noData(res.data.msg);
                    //详情
                    that.detailRender(that.data.user_id)
                    //助力
                    that.powerRender(that.data.user_id)
                  }
                }
              )
            }, 'draw')
        }
      })
    } else {
      if (e) {
        var formId = e.detail.formId;
      } else {
        var formId = ''
      }
      util.loading('正在参与')
      util.postHttp(
        'api/luck_draw', {
          invited_user_id: that.data.user_id,
          invitation_user_id: that.data.otherUid,
          rid: that.data.rid,
          formId: formId,
          open_type: that.data.detailData.open_type,
          token: token,
          is_new: that.data.is_new
        },
        function(res) {
          that.setData({
            showbottombtn: true,
          })
          if (res.data.status == 0) {
            //详情
            that.detailRender(that.data.user_id, 'draw')
            //助力
            that.powerRender(that.data.user_id)
          } else {
            util.noData(res.data.msg);
            //详情
            that.detailRender(that.data.user_id)
            //助力
            that.powerRender(that.data.user_id)
          }
        }
      )
    }
  },
  // 详情接口
  detailRender(user, use) {
    var that = this;
    util.postHttp(
      'api/prizes_detail', {
        user_id: user,
        rid: that.data.rid
      },
      function(res) {
        if (use == 'noLoad') {

        } else {
          setTimeout(function() {
            util.hideLoad();
          }, 300)
        }

        if (use == 'refresh') {
          wx.stopPullDownRefresh();
        }

        if (use == 'draw') {
          that.setData({
            leftDirection: true
          })
          if (util.getNowFormatDate(app.data.oldDate)) {
            that.setData({
              //   shareState: true
            })
          }
        }

        // 册数
        var allDetail = {};
        allDetail.convertible_or_not = res.data.data.convertible_or_not;
        allDetail.myself_code_number = res.data.data.myself_code_number;
        allDetail.receive_or_not = res.data.data.receive_or_not;
        allDetail.delivery_or_not = res.data.data.delivery_or_not;
        allDetail.express_company = res.data.data.express_company;
        allDetail.courier_number = res.data.data.courier_number;
        allDetail.is_try_play = res.data.data.is_try_play;
        allDetail.my_sons = res.data.data.my_sons;
        allDetail.myHead = app.data.head_pic;
        allDetail.nick_name = app.data.nick_name;

        var detailData = res.data.data.prize;
        if (detailData.opening_time) {
          detailData.opening_time = util.format(detailData.opening_time * 1000, "MM月dd日 HH时")
        }
        var share_detail_writing = res.data.data.share_detail_writing;
        var share_detail_pic = res.data.data.share_detail_pic;
        var prizeStatus = res.data.data.status;
        var winner_user = res.data.data.winner_user
        var countNum = res.data.data.count_down;
        var participant = res.data.data.participant;
        var total_people = res.data.data.total_people
        //倒计时
        var countTime = util.dateformat(countNum);

        if (prizeStatus == 1 || prizeStatus == 2 || prizeStatus == 4) {
          participant.unshift({
            head_pic: app.data.head_pic
          })
        }
        // 测试数据

        //测试数据

        if (prizeStatus == 1) {
          if (that.data.firstState) {
            that.setData({
              winState: true
            })
          }
        } else if (prizeStatus == 2) {
          if (that.data.firstState) {
            that.setData({
              nowinState: true
            })
          }
        }

        if (that.data.firstState) {
          that.setData({
            firstState: false
          })
        }

        that.setData({
          allDetail: allDetail,
          detailData: detailData,
          winner_user: winner_user,
          share_detail_writing: share_detail_writing,
          share_detail_pic: share_detail_pic,
          prizeStatus: prizeStatus,
          countTime: countTime,
          participant: participant,
          total_people: total_people,
        });
        if (res.data.data.status == 3 || res.data.data.status == 5) {
          that.setData({
            showbottombtn: false,

          })
        } else {
          that.setData({
            showbottombtn: true,
          })
        }
        app.data.currentInfo = detailData;

      }
    )
  },
  // 助力榜
  powerRender(user) {
    var that = this;
    util.postHttp(
      'api/help_list', {
        user_id: user,
        rid: that.data.rid,
        page: 1,
        page_number: 3
      },
      function(res) {
        if (res.data.status == 0) {
          var data = res.data.data;
          that.setData({
            powerData: data,
            helpState: 0,
            myHead: app.data.head_pic,
            nick_name: app.data.nick_name
          })
        } else {
          that.setData({
            helpState: 1
          })
        }
      }
    )
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function(e) {
    var that = this;
    var touchMove = e.touches[0].pageX;
    if (!flag) {
      return
    }
    // 向左滑动   
    if (touchMove - touchDot <= -25 && time < 10) {
      console.log('左滑')
      flag = false;
      if (that.data.leftDirection2) {
        return
      }

      if (that.data.rightDirection) {
        that.setData({
          leftDirection: true,
          rightDirection: false,
          leftDirection2: false,
          rightDirection2: false
        })
      } else {
        that.setData({
          leftDirection: false,
          rightDirection: false,
          leftDirection2: true,
          rightDirection2: false
        })
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 25 && time < 10) {
      console.log('右滑')
      flag = false;
      if (that.data.rightDirection) {
        return
      }
      if (that.data.leftDirection2) {
        that.setData({
          leftDirection: false,
          rightDirection: false,
          leftDirection2: false,
          rightDirection2: true
        })
      } else {
        that.setData({
          leftDirection: false,
          rightDirection: true,
          leftDirection2: false,
          rightDirection2: false
        })
      }
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
    flag = true
  },
  onShareAppMessage: function(e) {
    //分享页面
    var that = this;

    if (e.target && e.target.dataset.type) {
      var type = e.target.dataset.type;
    }

    return {
      title: that.data.share_detail_writing,
      path: 'pages/detail/detail?uid=' + that.data.user_id + '&rid=' + that.data.rid,
      imageUrl: that.data.share_detail_pic,
      success: function(res) {
        // 转发成功
        util.postHttp(
          'api/share_first', {
            user_id: that.data.user_id
          },
          function(res) {
            console.log(res)
            if (res.data.status == 0) {
              if (that.data.is_new == 0) {
                util.noData('分享成功', 3000)
                setTimeout(function() {
                  btnBgm.play()
                }, 500)
                setTimeout(function() {
                  wx.redirectTo({
                    url: '../trading/trading?shareUid=' + that.data.otherUid
                  })
                }, 1000)
              } else {
                util.noData('分享成功', 3000)
                setTimeout(function() {
                  btnBgm.play()
                }, 500)
                if (type == 5 && that.data.shareFirst) {
                  that.setData({
                    shareFirst: false
                  })
                  if (that.data.leftDirection || that.data.rightDirection2 || !that.data.leftDirection && !that.data.leftDirection2 && !that.data.rightDirection && !that.data.rightDirection2) {
                    setTimeout(function() {
                      console.log('好了')
                      that.setData({
                        leftDirection: false,
                        rightDirection: false,
                        leftDirection2: true,
                        rightDirection2: false
                      })
                    }, 500)
                  }
                }
                that.setData({
                  goldState2: true
                })
              }
            } else {
              if (that.data.is_new == 0) {
                util.noData(res.data.msg, 3000)
                setTimeout(function() {
                  btnBgm.play()
                }, 500)
                setTimeout(function() {
                  wx.redirectTo({
                    url: '../trading/trading?shareUid=' + that.data.otherUid
                  })
                }, 1000)
              }
              util.success('分享成功');
              setTimeout(function() {
                btnBgm.play()
              }, 500)
              if (type == 5 && that.data.shareFirst) {
                that.setData({
                  shareFirst: false
                })
                if (that.data.leftDirection || that.data.rightDirection2 || !that.data.leftDirection && !that.data.leftDirection2 && !that.data.rightDirection && !that.data.rightDirection2) {
                  setTimeout(function() {
                    console.log('好了')
                    that.setData({
                      leftDirection: false,
                      rightDirection: false,
                      leftDirection2: true,
                      rightDirection2: false
                    })
                  }, 500)
                }
              }
            }
          }
        );
        if (e.target && e.target.id == "doubleShare") {
          that.exchangeTap(that.doubleShareData, 1)
        }
      },
      fail: function(res) {
        // 转发失败
        util.noData('分享失败')
      }
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
  closeTap(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      that.setData({
        shareState: false
      })
    } else if (type == 2) {
      that.setData({
        winState: false
      })
    } else if (type == 3) {
      that.setData({
        nowinState: false
      })
    } else if (type == 4) {
      that.getForm(e)
      that.setData({
        newState: false
      })
    } else if (type == 5) {
      that.getForm(e)
      that.setData({
        newState2: false,
        toView: 'part'
      })
    }
  },
  // 阻止向下捕捉
  cancel() {
    return false
  },
  PreviewImg(e) {
    // 预览图片
    var that = this;
    var img = e.target.dataset.img;
    var imgArr = that.data.detailData.banners
    wx.previewImage({
      current: img,
      urls: imgArr
    })
  },
  // 兑换金币
  exchangeTap(e, type) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 2) {
      util.noData('您已领取')
    } else {
      btnBgm.play();
      util.loading('兑换金币中');
      util.postHttp(
        'api/currency_exchange', {
          user_id: that.data.user_id,
          rid: that.data.rid,
          type: type,
          water_coin: that.data.comforNum
        },
        function(res) {
          util.hideLoad();
          that.setData({
            comfortShow: false,
          })
          if (res.data.status == 0) {
            util.noData(res.data.msg, 3000);
            that.data.allDetail.convertible_or_not = 1;
            that.setData({
              allDetail: that.data.allDetail,
            })
          } else {
            util.noData(res.data.msg, 3000);
          };

        }
      )
    }
  },
  //水币数额
  watercoin() {
    let _this = this;
    util.loading('兑换金币中');
    util.postHttp('api/water_coin', {}, function(res) {
      util.hideLoad();
      console.log(res);
      _this.setData({
        comfortShow: true,
        comforNum: res.data.data.water_coin,
      });
    })
  },
  // 填写收货地址
  addressTap(e) {
    var that = this;
    console.log(e)
    var rid = that.data.rid;
    var formId = e.detail.formId;
    console.log(rid);
    wx.chooseAddress({
      success: function(res) {
        that.chooseAddress(res, formId, rid)
      },
      fail: function(res) {
        if (res.errMsg == 'chooseAddress:fail auth deny' || res.errMsg == 'chooseAddress:fail:auth denied') {
          wx.showModal({
            title: '警告',
            confirmText: "确定",
            content: '您点击了拒绝授权，将无法正常添加，点击确定重新获取授权',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (!res["authSetting"]["scope.address"]) {
                      util.noData("授权失败")
                    } else {
                      that.addressTap(e)
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  // 选择地址
  chooseAddress(data, formId, rid) {
    var that = this;
    wx.showModal({
      title: '请核对地址',
      content: data.provinceName + data.cityName + data.countyName + data.detailInfo + '。电话:' + data.telNumber,
      success: function(res) {
        if (res.confirm) {
          util.postHttp(
            'api/collect_goods', {
              formId: formId,
              rid: rid,
              user_id: app.data.user_id,
              consignee: data.userName,
              phone: data.telNumber,
              province: data.provinceName,
              city: data.cityName,
              area: data.countyName,
              detail_address: data.detailInfo,
              zip_code: data.postalCode
            },
            function(res) {
              if (res.data.status == 0) {
                util.success(res.data.msg);
                that.data.allDetail.receive_or_not = 1;
                that.data.allDetail.delivery_or_not = 0;
                that.setData({
                  allDetail: that.data.allDetail
                })
              } else {
                util.noData(res.data.msg);
              }
            }
          )
        }
      }
    })
  },
  // 跳转
  jumpTap(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../drawRecord/drawRecord'
      })
    } else if (type == 2) {
      wx.redirectTo({
        url: '../trading/trading'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../posters/posters'
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../powerList/powerList?rid=' + that.data.rid
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: '../partList/partList?rid=' + that.data.rid
      })
    } else if (type == 6) {
      wx.redirectTo({
        url: '../index/index'
      })
    } else if (type == 7) {
      var rid = e.currentTarget.dataset.rid;
      wx.redirectTo({
        url: '../detail/detail?rid=' + rid
      })
    } else if (type == 8) {
      if (that.data.goldState2) {

      } else {
        util.noData('需要分享好友后，才能领红包')
      }

    }
  },
  onPullDownRefresh: function() {
    var that = this;

    util.loading('刷新数据中');
    //详情
    that.detailRender(that.data.user_id, 'refresh')
    //助力
    that.powerRender(that.data.user_id)
    //参与
    that.partRender(that.data.user_id)

  },
  navBack: function() {
    if (getCurrentPages().length == 1) {
      wx.redirectTo({
        url: '../index/index'
      })
    } else {
      util.navBack()
    }
  },
  //授权开红包
  switchTap(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      util.loading('开启红包中');
      util.author(res.detail, function() {
        var token = util.md5Toke(that.data.user_id)
        util.postHttp(
          'api/new_big_gift', {
            user_id: that.data.user_id,
            type: 1,
            token: token,
            parent_id: that.data.otherUid
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
                // shareBottom: true
              })
            } else {
              util.noData(res.data.msg)
            }
          }
        )
      })
      that.setData({
        loginState: false
      })
    } else {
      util.loading('开启红包中');
      var token = util.md5Toke(that.data.user_id)
      util.postHttp(
        'api/new_big_gift', {
          user_id: that.data.user_id,
          type: 1,
          token: token,
          parent_id: that.data.otherUid
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
              //   shareBottom: true
            })
          } else {
            util.noData(res.data.msg)
          }
        }
      )

    }
  },

  // 领取双倍安慰奖按钮收集formId
  doubleShare(e) {
    console.log(e);
    let formId = e.detail.formId;
    console.log(formId);
    if (formId && parseInt(formId) > 0) {
      this.getForm(e);
    };
    this.doubleShareData = e;
  },

  hideComfort(e) {
    this.exchangeTap(e, 2)
    this.setData({
      comfortShow: false,
    })
  }
})