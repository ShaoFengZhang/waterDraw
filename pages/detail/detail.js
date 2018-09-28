let btnBgm = wx.createInnerAudioContext();
btnBgm.src = "https://tp.datikeji.com/a/15351009376616/brf2xixGd14JpSRTIq3ujdBif0k9pVZzujw2HOws.mpga";
btnBgm.volume = 1;
var app = getApp();
let util = require('../../utils/util');
var Page = require('../../utils/xmadx_sdk.min.js').xmad(Page).xmPage;
Page({
    data: {
        // 需在xmadID中配置广告位ID，多个ID之间用英文逗号隔开
        xmad: {
            adData: {},
            ad: {
                banner: "xm2fd1dd84691b8eaa5427ee1b3144c4", // 按需引入
            }
        },
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
        redbao: 1,
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
        currentTab: 1
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
                util.loading('加码中');
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
                            that.detailRender(that.data.user_id);
                            //助力
                            that.powerRender(that.data.user_id);

                            if (that.data.is_new == 0) {
                                that.setData({
                                    newState: false,
                                    newState2: false,
                                    redbao: 1,
                                });
                                wx.navigateTo({
                                    url: `../trading/trading?isnewuser=1`,
                                })
                            }
                        }
                    }
                );

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

        if (!app.data.user_id || !util.checkNumber(app.data.user_id)) {
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
                }, options.uid
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

                                        that.choujiangfenxiang();
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

                        that.choujiangfenxiang();
                    } else {
                        util.noData(res.data.msg);
                        //详情
                        that.detailRender(that.data.user_id)
                            //助力
                        that.powerRender(that.data.user_id)
                    }
                }
            )
        };

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
                //  prizeStatus = 5 
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

    choujiangfenxiang() {
        let that = this;
        if (that.data.is_new == 0) {
            var token = util.md5Toke(that.data.user_id)
            util.postHttp(
                'api/new_big_gift', {
                    user_id: that.data.user_id,
                    type: 2,
                    token: token,
                    parent_id: that.data.otherUid
                },
                function(res) {
                    if (res.data.status == 0) {
                        btnBgm.play();
                        util.hideLoad();
                        var gift = res.data.data.gift
                        that.setData({
                            gift: gift,
                            redbao: 2,
                            newState2: true,
                            tradeState: false,
                        })
                    } else {
                        util.noData(res.data.msg)
                    }
                }
            )
        }
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
                                    // setTimeout(function() {
                                    //     wx.redirectTo({
                                    //         url: '../trading/trading?shareUid=' + that.data.otherUid
                                    //     })
                                    // }, 1000)
                            } else {
                                util.noData('分享成功', 3000)
                                setTimeout(function() {
                                    btnBgm.play()
                                }, 500)
                                if (type == 5 && that.data.shareFirst) {
                                    that.setData({
                                        shareFirst: false
                                    })
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
                            }
                            util.success('分享成功');
                            setTimeout(function() {
                                btnBgm.play()
                            }, 500)
                            if (type == 5 && that.data.shareFirst) {
                                that.setData({
                                    shareFirst: false
                                })
                            }
                        }
                    }
                );
                if (e.target && e.target.id == "doubleShare") {
                    that.exchangeTap(that.doubleShareData, 1)
                };
                if (that.newUserShareDoubleRedBao && that.data.is_new == 0) {
                    that.newUserShareDoubleRedBao = false;
                    util.postHttp(
                        'api/newer_share', {
                            user_id: that.data.user_id,
                            type: 1,
                        },
                        function(res) {
                            if (res.data.status == 0) {
                                btnBgm.play()
                                util.hideLoad();
                                var gift = res.data.data.gift
                                that.setData({
                                    gift: gift,
                                    redbao: 3,
                                    newState2: true,
                                    tradeState: false,
                                })
                            } else {
                                util.noData(res.data.msg)
                            }
                        }
                    )
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
            wx.showModal({
                title: '您确定放弃四个红包吗？',
                confirmText: "确定",
                content: '机会只有一次',
                showCancel: true,
                success: function(res) {
                    if (res.confirm) {
                        that.setData({
                            newState: false
                        })
                    }
                }
            })
        } else if (type == 5) {
            that.getForm(e)
            that.setData({
                newState2: false,
                toView: 'part'
            })
        } else if (type == 6) {
            that.getForm(e);
            that.setData({
                newState2: true,
                redbao: 3,
                tradeState: false,
                noshareFriend: true
            });
        } else if (type == 7) {
            that.getForm(e)
            that.setData({
                newState2: false,
                toView: 'part',
                newUserShareDoubleRedBao: true,
            })
            that.newUserShareDoubleRedBao = true;
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
    exchangeTap(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
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
                if (type == 1) {
                    that.setData({
                        comfortShow: true,
                        comforNum: res.data.data.water_coin,
                    });
                }
            }
        )

    },
    //水币数额
    watercoin(e) {
        this.exchangeTap(e)
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

        } else if (type == 9) {
            that.jumpNewDetail()
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
        this.setData({
            comfortShow: false,
        })
    },
    jumpNewDetail() {
        var _this = this;
        util.postHttp(
            'api/prizes_list', {
                user_id: app.data.user_id,
                page: 1,
                per_page: 50,
                type: 1
            },
            function(res) {
                wx.hideLoading();
                if (res.data.status == 0) {
                    let ridList = res.data.data.prizes;
                    var arr = [];
                    var arr2 = [];
                    ridList.forEach(function(item) {
                        if (item.have_involved == "no") {
                            arr.push(item)
                        } else {
                            arr2.push(item)
                        }
                    })
                    if (arr.length > 0) {
                        let random = Math.floor(Math.random() * arr.length);
                        _this.rid = arr[random].rid;
                        wx.redirectTo({
                            url: `../detail/detail?uid=${_this.uid}&rid=${_this.rid}`
                        })
                    } else {
                        let random = Math.floor(Math.random() * arr2.length);
                        _this.rid = arr2[random].rid;
                        wx.redirectTo({
                            url: `../detail/detail?uid=${_this.uid}&rid=${_this.rid}`
                        })
                    }

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '当前没有正在抽奖的奖品',
                        showCancel: false,
                        success: function() {
                            wx.redirectTo({
                                url: `../index/index`
                            })
                        }
                    })
                }
            }
        )
    }
})