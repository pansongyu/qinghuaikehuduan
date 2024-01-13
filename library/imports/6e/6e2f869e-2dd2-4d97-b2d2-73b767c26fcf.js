"use strict";
cc._RF.push(module, '6e2f8aeLdJNl7LSc7dnwm/P', 'hbwhmj_winlost_child');
// script/ui/uiGame/hbwhmj/hbwhmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        fengDingImg: [cc.SpriteFrame]
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
        var laiZiPiList = [];
        var specialLaiZiPiList = [];
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        if (setEnd.laiZiPiList.length > 0) {
            laiZiPiList = setEnd.laiZiPiList;
        }
        if (setEnd.specialLaiZiPiList.length > 0) {
            specialLaiZiPiList = setEnd.specialLaiZiPiList;
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, laiZiPiList, specialLaiZiPiList, maiMaList);
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
        var laiZiPiList = arguments[4];
        var specialLaiZiPiList = arguments[5];
        var maiMaList = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, laiZiPiList, specialLaiZiPiList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, laiZiPiList, specialLaiZiPiList);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
        // this.ShowPlayerPiaoJingList(PlayerNode.getChildByName('zhongma'), HuList.piaoJingList, jin1, jin2);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isBaoHu = HuList["isBaoHu"];
        var fengDingType = HuList["fengDingType"];
        var fanShu = HuList["fanShu"];
        var isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('show').getChildByName("img_baopai").active = isBaoHu;
        if (fengDingType > 0) {
            ShowNode.getChildByName('show').getChildByName("img_ding").active = true;
            ShowNode.getChildByName('show').getChildByName("img_ding").getComponent(cc.Sprite).spriteFrame = this.fengDingImg[fengDingType - 1];
        } else {
            ShowNode.getChildByName('show').getChildByName("img_ding").active = false;
        }
        //番数
        ShowNode.getChildByName("lb_fanshu").getComponent(cc.Label).string = "番数:x" + fanShu;
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
        if (childNode.getChildByName("pi")) {
            childNode.getChildByName("pi").active = false;
        }

        if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = true;
            }
        } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("pi")) {
                childNode.getChildByName("pi").active = true;
            }
        }
    },

    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {

        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (huPoint == 0) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            } else {
                if (this.IsShowMulti2(huType)) {
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
                } else if (this.IsNoShowScore(huType)) {
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
                } else {
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
                    // this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + huPoint);
                }
            }
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

    ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, laiZiPiList, specialLaiZiPiList) {
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCardByHBWHMJ(cardIDList, handCard, jin1, laiZiPiList, specialLaiZiPiList);
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var laiZiPiList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var specialLaiZiPiList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

        ShowNode.active = 1;
        var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByHBWHMJ(publishcard, this.posCount, jin1, laiZiPiList, specialLaiZiPiList);
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
        huTypeDict["GSKH"] = "杠上开花";
        huTypeDict["HDLY"] = "海底捞";
        huTypeDict["JiangJiangHu"] = "将一色";
        huTypeDict["PPHu"] = "碰碰胡";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["QuanQiuR"] = "全求人";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["ZYS"] = "字一色";
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["DianPao"] = "点炮";
        huTypeDict["Gang"] = "碰杠";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["JieGang"] = "直杠";
        huTypeDict["Jin"] = "癞子";
        huTypeDict["JinGang"] = "癞子皮";
        huTypeDict["Zhong"] = "红中杠";
        huTypeDict["ChiFaCai"] = "发财杠";
        huTypeDict["Zhuang"] = "庄";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["YingHua"] = "硬胡";
        huTypeDict["PengDa"] = "开口";

        return huTypeDict[huType];
    },
    IsNoShowScore: function IsNoShowScore(huType) {
        var multi2 = [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },

    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = ["DianPao", "Gang", "AnGang", "JieGang", "Jin", "JinGang", "Zhong", "ChiFaCai", "Zhuang", "ZiMo", "YingHua", "PengDa"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    }
});

cc._RF.pop();