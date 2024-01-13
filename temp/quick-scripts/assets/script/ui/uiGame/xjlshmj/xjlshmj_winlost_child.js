(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xjlshmj/xjlshmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f5b91Kl8jNHq4l0Ury3pZC+', 'xjlshmj_winlost_child', __filename);
// script/ui/uiGame/xjlshmj/xjlshmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        img_huiPai: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var jin1 = setEnd.jin;
        var jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        var posHuArray = new Array();
        this.posCount = posResultList.length;
        for (var i = 0; i < this.posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        var maiMaList = setEnd["maiMaList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maiMaList);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var maiMaList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerHuPai(PlayerNode.getChildByName('hupai'), HuList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
        // this.ShowPlayerPiaoJingList(PlayerNode.getChildByName('zhongma'), HuList.piaoJingList, jin1, jin2);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isTing = HuList["isTing"];
        var isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('ting').active = isTing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },

    ShowPlayerPiaoJingList: function ShowPlayerPiaoJingList(showNode, piaoJingList, jin1, jin2) {
        for (var i = 1; i <= 8; i++) {
            showNode.getChildByName("card" + i).active = false;
            showNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
            showNode.getChildByName("card" + i).getChildByName("da").active = false;
            showNode.getChildByName("card" + i).getChildByName("icon_fu").active = false;
        }
        for (var _i = 0; _i < piaoJingList.length; _i++) {
            var cardID = piaoJingList[_i];
            var node = showNode.getChildByName("card" + (_i + 1));
            var cardType = Math.floor(cardID / 100);
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;

            this.ShowJinBgByNode(cardID, node, jin1, jin2);
        }
    },

    ShowJinBgByNode: function ShowJinBgByNode(cardID, childNode) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        childNode.color = cc.color(255, 255, 255);
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = false;
        }
        if (childNode.getChildByName("icon_fu")) {
            childNode.getChildByName("icon_fu").active = false;
        }

        if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = true;
            }
        } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = true;
            }
        }
    },

    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        //买码飘分
        // let maiMa = huInfoAll["maiMa"];
        // let piaoHua = huInfoAll["piaoHua"];
        // let maiMaStr = "";
        // let piaoHuaStr = "";
        // if(maiMa == 1){
        //     maiMaStr = "买2码";
        // }else if(maiMa == 2){
        //     maiMaStr = "买4码";
        // }else if(maiMa == 0){
        //     maiMaStr = "不买";
        // }else{
        //     maiMaStr = "";
        // }
        // if(piaoHua == -1){
        //     piaoHuaStr = "" ;
        // }else if(piaoHua == 0){
        //     piaoHuaStr = "不飘" ;
        // }else{
        //     piaoHuaStr = "飘" + piaoHua + "分" ;
        // }
        // if(maiMaStr != "" || piaoHuaStr != ""){
        //     if(maiMaStr != "" && piaoHuaStr!= ""){
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + " " + piaoHuaStr + "]");
        //     }else{
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + piaoHuaStr + "]");
        //     }
        // }

        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        var absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
        //显示比赛分
        if (typeof huInfo.sportsPointTemp != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof huInfo.sportsPoint != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },

    ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        ShowNode.active = 1;
        var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByJDZMJ(publishcard, this.posCount, jin1, jin2);
    },

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maiMaList, endPoint, huType) {
        var zhongMaList = endPoint["zhongMaList"];
        ShowNode.active = false;
        for (var i = 1; i <= 8; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (maiMaList.length == 0) {
            console.error("ShowPlayerNiaoPai", maiMaList);
            return;
        }
        huType = this.ShareDefine.HuTypeStringDict[huType];
        //没胡得人不显示
        if (huType == this.ShareDefine.HuType_DianPao || huType == this.ShareDefine.HuType_NotHu) {
            return;
        }
        ShowNode.active = true;
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for (var _i2 = 0; _i2 < maiMaList.length; _i2++) {
            var cardType = maiMaList[_i2];
            var node = ShowNode.getChildByName("card" + (_i2 + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongMaList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
            }
        }
    },
    ShowImage: function ShowImage(childNode, imageString, cardID) {
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
        //取卡牌ID的前2位
        var imageName = [imageString, cardID].join("");
        var imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            var that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return;
                }
                childSprite.spriteFrame = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {};
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["QDHu"] = "七对";
        huTypeDict["HDDHu"] = "豪华七对";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["QingYiSe"] = "清一色";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["GSKH1"] = "杠上开花";
        huTypeDict["GSKH2"] = "杠上开花";
        huTypeDict["GSKH3"] = "杠上开花";
        huTypeDict["GSKH4"] = "杠上开花";
        huTypeDict["GSP1"] = "杠上炮";
        huTypeDict["GSP2"] = "杠上炮";
        huTypeDict["GSP3"] = "杠上炮";
        huTypeDict["GSP4"] = "杠上炮";
        huTypeDict["QGH1"] = "抢杠胡";
        huTypeDict["QGH2"] = "抢杠胡";
        huTypeDict["QGH3"] = "抢杠胡";
        huTypeDict["QGH4"] = "抢杠胡";
        huTypeDict["DanDiao"] = "单吊";
        huTypeDict["DanDiaoLiangPai"] = "单吊亮牌";

        huTypeDict["JiePaoPoint"] = "接炮分";
        huTypeDict["ZiMoPoint"] = "自摸分";
        huTypeDict["PeiDiFen"] = "赔底分";

        return huTypeDict[huType];
    },
    ShowPlayerHuPai: function ShowPlayerHuPai(showNode, huInfoAll) {
        var huInfo = false;
        if (huInfoAll["endPoint"]) {
            huInfo = huInfoAll["endPoint"];
        } else {
            huInfo = huInfoAll;
        }
        var huInfoMap = huInfo["huInfoMap"];
        for (var i = 1; i <= 23; i++) {
            showNode.getChildByName("card" + i).active = false;
            showNode.getChildByName("card" + i).getChildByName("img_hutype").getComponent(cc.Sprite).spriteFrame = "";
            showNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
            showNode.getChildByName("card" + i).getChildByName("mapNode").active = false;
            showNode.getChildByName("card" + i).cardType = -1;
        }
        var count = 0;
        for (var key in huInfoMap) {
            count++;
            var node = showNode.getChildByName("card" + count);
            node.cardType = key;
            //自摸的牌
            if (key < 0) {
                node.getChildByName("img_hutype").getComponent(cc.Sprite).spriteFrame = this.img_huiPai[0];
                node.color = cc.color(150, 150, 150);
            } else {
                node.getChildByName("img_hutype").getComponent(cc.Sprite).spriteFrame = this.img_huiPai[1];
                node.color = cc.color(255, 255, 255);
            }
            var cardID = Math.floor(Math.abs(key) / 100);
            this.ShowImage(node, 'EatCard_Self_', cardID);
            var huTypeStr = "";
            var huTypeMap = huInfoMap[key];
            for (var huType in huTypeMap) {
                var huPoint = huTypeMap[huType];
                if (huTypeStr == "") {
                    huTypeStr = huTypeStr + this.LabelName(huType) + "：" + huPoint;
                } else {
                    huTypeStr = huTypeStr + " " + this.LabelName(huType) + "：" + huPoint;
                }
            }
            var label = node.getChildByName("mapNode").getChildByName("img_tsk").getChildByName("label").getComponent(cc.Label);
            label.string = huTypeStr;
            node.active = true;
        };
    },
    //清除胡牌显示
    ClearHuPaiDis: function ClearHuPaiDis() {
        var Players = this.node.parent;
        for (var i = 0; i < Players.children.length; i++) {
            var huPaiNode = Players.children[i].getChildByName("hupai");
            for (var j = 0; j < huPaiNode.children.length; j++) {
                huPaiNode.children[j].getChildByName("mapNode").active = false;
            }
        }
    },
    //所有胡的牌点击事件
    Click_huPai: function Click_huPai(event) {
        console.log("Click_huPai : ", event);
        this.ClearHuPaiDis();
        var btnNode = event.target;
        btnNode.getChildByName("mapNode").active = true;
        this.FadeOutTip(btnNode.getChildByName("mapNode"));
    },
    FadeOutTip: function FadeOutTip(node) {
        var self = this;
        node.stopAllActions();
        node.active = false;
        node.opacity = 255;
        var seq = cc.sequence(cc.delayTime(2), cc.fadeOut(2.0), cc.callFunc(function () {
            node.active = false;
            node.opacity = 255;
        }, this));
        node.runAction(seq);
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
        //# sourceMappingURL=xjlshmj_winlost_child.js.map
        