(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/UIPlayerRaceRankInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '47275k7Nn5Gi56cQtRtoxMG', 'UIPlayerRaceRankInfo', __filename);
// script/ui/club_2/UIPlayerRaceRankInfo.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.rankScrollView = this.node.getChildByName("rankScrollView");
        this.rankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    OnShow: function OnShow(clubId, pid, type) {
        this.opClubId = clubId;
        this.opPid = pid;
        this.type = type;
        this.curPage = 1;
        this.GetUnionDynamicItemList(true);
    },
    GetPage: function GetPage() {
        this.curPage++;
        this.GetUnionDynamicItemList(false);
    },
    GetUnionDynamicItemList: function GetUnionDynamicItemList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.opClubId;
        sendPack.pid = this.opPid;
        sendPack.getType = this.type;
        sendPack.pageNum = this.curPage;
        var self = this;
        app.NetManager().SendPack("club.CClubSportsPointChangeRecordByPid", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack.unionDynamicItemList, isRefresh);
            self.ShowPlayInfo(serverPack);
        }, function () {});
    },
    ShowPlayInfo: function ShowPlayInfo(serverPack) {
        var img_xiadi = this.node.getChildByName("img_xiadi");
        var player = serverPack.player;
        var headImageUrl = player.iconUrl;
        if (headImageUrl) {
            app.WeChatManager().InitHeroHeadImage(player.pid, headImageUrl);
            var WeChatHeadImage = img_xiadi.getChildByName('head').getComponent("WeChatHeadImage");
            WeChatHeadImage.OnLoad();
            WeChatHeadImage.ShowHeroHead(player.pid, headImageUrl);
        }
        img_xiadi.getChildByName('lb_name').getComponent(cc.Label).string = "昵称:" + player.name;
        img_xiadi.getChildByName('lb_beizhu').getComponent(cc.Label).string = "群名片:" + app.ComTool().GetBeiZhuName(player.pid, player.name);
        img_xiadi.getChildByName('lb_id').getComponent(cc.Label).string = "ID:" + player.pid;

        img_xiadi.getChildByName('lb_playerTotalPoint').getComponent(cc.Label).string = "成员积分：" + serverPack.playerTotalPoint;
        img_xiadi.getChildByName('lb_zhongZhiTotalPoint').getComponent(cc.Label).string = "总积分：" + serverPack.zhongZhiTotalPoint;
        img_xiadi.getChildByName('lb_eliminatePoint').getComponent(cc.Label).string = "淘汰：" + serverPack.eliminatePoint;
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var roomScrollView = this.node.getChildByName("mark");
        var content = this.rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            child.getChildByName("lb_execTime").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayHourMinuteString(serverPack[i].execTime);
            child.getChildByName("lb_execType").getComponent(cc.Label).string = this.GetExecTypeStr(serverPack[i].execType);
            child.getChildByName("lb_id").getComponent(cc.Label).string = serverPack[i].id;
            child.getChildByName("lb_winLoseValue").getComponent(cc.Label).string = serverPack[i].winLoseValue;
            child.getChildByName("lb_consumeValue").getComponent(cc.Label).string = serverPack[i].consumeValue;
            child.getChildByName("lb_eliminatePoint").getComponent(cc.Label).string = serverPack[i].eliminatePoint;
            child.getChildByName("lb_pidCurValue").getComponent(cc.Label).string = serverPack[i].pidCurValue;
            child.active = true;
            content.addChild(child);
        }
    },
    // //**
    //  * 异常操作
    //  */
    // ERROR(1),
    // /**
    //  * 对局输赢
    //  */
    // WINLOSE(2),
    // /**
    //  * 报名费
    //  */
    // ENTRYFEE(3),
    // /**
    //  * 洗牌费用
    //  */
    // XiPaiCost(4),
    GetExecTypeStr: function GetExecTypeStr(execType) {
        var typeObj = {
            1: "异常操作",
            2: "对局输赢",
            3: "报名费",
            4: "洗牌费用"
        };
        return typeObj[execType];
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close" || btnName == "img_black") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIPlayerRaceRankInfo.js.map
        