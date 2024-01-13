"use strict";
cc._RF.push(module, 'dbc1fbf1GdELohSJhAxq521', 'UIRecordAllResult_sys');
// script/ui/uiGame/sys/UIRecordAllResult_sys.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        roomID: cc.Node,
        jushu: cc.Node,
        endTime: cc.Node,

        MJPlayers: cc.Node,

        PokerPlayers: cc.Node,

        page_search: cc.EditBox,

        room_Beishu: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        // this.RegEvent("RoomEnd", this.Event_RoomEnd, this);
        this.maCardNode = this.GetWndNode("sp_cardNode/maCardNode");
        this.xingCardNode = this.GetWndNode("sp_cardNode/xingCardNode");
        this.dipaiLayout = this.node.getChildByName("dipaiLayout");
        this.px6gtTip = this.node.getChildByName("px6gtTip");
        this.ComTool = app.ComTool();
        this.SDKManager = app.SDKManager();
        this.NetManager = app.NetManager();
        this.PokerCard = app.PokerCard();
        this.WeChatManager = app.WeChatManager();
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.RegEvent("GameRecord", this.Event_GameRecord, this);
        this.lastChildName = null;
        this.lastRoomId = 0;
        //加载麻将资源，防止异步坑爹的bug
        this.LoadAllImages();
    },
    LoadAllImages: function LoadAllImages() {
        var _IntegrateImagePath,
            _this = this;

        var i = 11;

        var _loop = function _loop() {
            var imageName = ["EatCard_Self_", i].join("");
            var imageInfo = _this.IntegrateImage[imageName];
            if (!imageInfo) {
                return "continue";
            }
            if (app['majiang_' + imageName]) {
                return "continue";
            }
            var imagePath = imageInfo["FilePath"];
            var that = _this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return;
                }
                //记录精灵图片对象
                app['majiang_' + imageName] = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        };

        for (; i <= 58; i++) {
            var _ret = _loop();

            if (_ret === "continue") continue;
        }
        //------------------永州扯胡子
        this.IntegrateImagePath = (_IntegrateImagePath = {
            "zi_fangda_19": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_10"
            },
            "zi_fangda_10": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_1"
            },
            "zi_fangda_11": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_2"
            },
            "zi_fangda_12": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_3"
            },
            "zi_fangda_13": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_4"
            },
            "zi_fangda_14": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_5"
            },
            "zi_fangda_15": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_6"
            },
            "zi_fangda_16": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_7"
            },
            "zi_fangda_17": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_8"
            },
            "zi_fangda_18": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_9"
            },

            "zi_fangda_29": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_10"
            },

            "zi_fangda_20": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_1"
            },
            "zi_fangda_21": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_2"
            },
            "zi_fangda_22": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_3"
            },
            "zi_fangda_23": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_4"
            },
            "zi_fangda_24": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_5"
            },
            "zi_fangda_25": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_6"
            },
            "zi_fangda_26": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_7"
            },
            "zi_fangda_27": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_8"
            },
            "zi_fangda_28": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_9"
            },

            "zi_fangda_51": {
                "FilePath": "ui/uiGame/hhhgw/zi/bg_gui"
            }
        }, _defineProperty(_IntegrateImagePath, "zi_fangda_51", {
            "FilePath": "ui/uiGame/hhhgw/zi/bg_long"
        }), _defineProperty(_IntegrateImagePath, "zi_fangda_bg", {
            "FilePath": "ui/uiGame/hhhgw/zi/img_pb"
        }), _IntegrateImagePath);
        //------------------永州扯胡子
    },
    OnShow: function OnShow(roomId, playerAll, gameType) {
        var unionId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var roomKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var defaultPage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

        this.page = defaultPage;
        // this.FormManager.ShowForm('UITop', "UIRecordAllResult");
        this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
        var path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
        this.FormManager.ShowForm("UITop", path);

        this.gameTypeID = gameType;
        this.gameType = app.ShareDefine().GametTypeID2PinYin[gameType];
        this.HideDiPaiLayout();
        this.HideSpCardNode();
        if (this.gameType == "sss") {
            this.node.getChildByName("btn_replay").active = false;
        } else {
            this.node.getChildByName("btn_replay").active = true;
        }
        this.playerAll = playerAll;
        this.roomId = roomId;
        this.unionId = unionId;
        this.roomKey = roomKey;
        var Type = this.gametypeConfig[gameType]["Type"];
        //pk牌的type需要使用麻将的布局
        var gameNameList = ["bw", "pypp", "ctwsk", "ygwsk", "qcdg", "tsdg", "dhd", "ysdz", "wsk", "sdh", "lkwsk", "nzdl", "hndzp", "gxcdd", "glpp", "nzwsk", "gz", "xsy", "ctpk", "fczha", "xywsk", "jxyz", "qwwes", "bzp", "tgwsk"];
        //特殊处理 包王垂直布局
        if (Type == 1 || gameNameList.indexOf(this.gametypeConfig[gameType]['Name']) > -1) {
            this.MJPlayers.active = true;
            this.PokerPlayers.active = false;
            this.Players = this.MJPlayers;
            this.getWndNodePath = "scrollview/view/MJPlayers";
        } else {
            this.MJPlayers.active = false;
            this.PokerPlayers.active = true;
            this.Players = this.PokerPlayers;
            this.getWndNodePath = "PokerScrollView/view/PokerPlayers";
        }
        //动态生成节点
        this.LoadPrefabByGameType();
    },
    LoadPrefabByGameType: function LoadPrefabByGameType() {
        var prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_winlost_child";
        var that = this;
        app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab).then(function (prefab) {
            if (!prefab) {
                that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
                return;
            }
            that.InitNode(prefab);
        }).catch(function (error) {
            that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
        });
    },
    //------------------永州扯胡子
    ShowCardImage: function ShowCardImage(childNode) {
        childNode.active = true;
        var imageName = ["zi_fangda_", Math.floor(childNode.cardID / 100)].join("");
        if (childNode.cardID == 0) {
            imageName = ["zi_fangda_bg"].join("");
        }
        var imageInfo = this.IntegrateImagePath[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        var that = this;
        childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame = "";
        var childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
        this.SpriteShow(childSprite, imagePath);
    },
    SpriteShow: function SpriteShow(childSprite, imagePath) {
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
    },
    //------------------永州扯胡子
    InitNode: function InitNode(prefab) {
        var Player1Node = cc.instantiate(prefab);
        this.nowChildName = Player1Node.name;
        if (this.lastChildName != null && this.lastChildName == this.nowChildName && this.lastRoomId == this.roomId) {}
        //子节点跟之前一样，无需重新创建，直接return
        //由于未结束的战绩会时时改变，所以不能return
        // return;

        //清空之前的节点,生成新的节点
        this.lastChildName = this.nowChildName;
        this.lastRoomId = this.roomId;
        //this.Players.removeAllChildren();
        this.DestroyAllChildren(this.Players);
        Player1Node.name = 'player1';
        this.Players.addChild(Player1Node);

        // if (this.MJPlayers.active) {
        //     //添加手牌
        //     let ShowCardNode = this.GetWndNode(this.getWndNodePath + '/player1/showcard');
        //     let sp_in = ShowCardNode.getChildByName('sp_in');
        //     for (let i = 1; i <= this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount']; i++) {
        //         let cardNode = cc.instantiate(sp_in);
        //         cardNode.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount'] + 1)), 2);
        //         ShowCardNode.addChild(cardNode);
        //     }
        //     //添加吃牌
        //     let DownCardNode = this.GetWndNode(this.getWndNodePath + '/player1/downcard');
        //     let downNode01 = DownCardNode.getChildByName('down01');
        //     for (let i = 2; i <= 5; i++) {
        //         let downNode = cc.instantiate(downNode01);
        //         downNode.name = this.ComTool.StringAddNumSuffix("down", i, 2);
        //         DownCardNode.addChild(downNode);
        //     }
        //     //添加花牌
        //     if (this.nowChildName.indexOf("hua") >= 0) {
        //         let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacard');
        //         let hua01 = HuaCardNode.getChildByName('card01');
        //         for (let i = 2; i <= 8; i++) {
        //             let huaNode = cc.instantiate(hua01);
        //             huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
        //             HuaCardNode.addChild(huaNode);
        //         }
        //     }


        //     //预制体添加花牌（找不到更好的方法了 先用着--张泽新2020.3.12）
        //     if (this.gameType == "fdmj" || this.gameType == "dymj") {
        //         let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacard');
        //         let hua01 = HuaCardNode.getChildByName('card01');
        //         for (let i = 2; i <= 8; i++) {
        //             let huaNode = cc.instantiate(hua01);
        //             huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
        //             HuaCardNode.addChild(huaNode);
        //         }
        //     }
        //     if (this.gameType == "zpmj" || this.gameType == "namj" || this.gameType == "qzmj" || this.gameType == "zzmj" || this.gameType == "ssmj") {
        //         let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacardscrollView/view/huacard');
        //         let hua01 = HuaCardNode.getChildByName('card01');
        //         for (let i = 2; i <= 8; i++) {
        //             let huaNode = cc.instantiate(hua01);
        //             huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
        //             HuaCardNode.addChild(huaNode);
        //         }
        //     }


        // }
        this.InitPlayers();
        this.alldata = false;
        this.maxpage = 0;
        this.room_Beishu.active = false;
        this.NetManager.SendPack("game.CPlayerSetRoomRecord", { "roomID": this.roomId }, this.Event_GameRecord.bind(this));
    },
    InitPlayers: function InitPlayers() {
        var AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
        for (var i = 2; i <= this.playerAll.length; i++) {
            var PlayerSon = cc.instantiate(AddNode);
            PlayerSon.name = 'player' + i;
            PlayerSon.active = false;
            this.Players.addChild(PlayerSon);
        }
    },
    ShowRoomInfo: function ShowRoomInfo(roomEndResult) {
        var setID = roomEndResult["setID"];
        var time = roomEndResult["endTime"];
        if (setID > 0) {
            this.jushu.active = true;
            this.jushu.getComponent(cc.Label).string = "第" + setID + "局";
        } else {
            this.jushu.active = false;
        }

        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);
        if (this.playBackCode > 0) {
            this.node.getChildByName('btn_replay').active = true;
            this.node.getChildByName('btn_share').active = true;
            this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "回放码:" + this.playBackCode;
            cc.find('btn_replay', this.node).actvie = true;
        } else {
            this.node.getChildByName('btn_replay').active = false;
            this.node.getChildByName('btn_share').active = false;
            this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "";
            cc.find('btn_replay', this.node).actvie = false;
        }
        //第几局 第几轮
        var dataJsonRes = roomEndResult.dataJsonRes,
            roomID = roomEndResult.roomID;

        try {
            dataJsonRes = JSON.parse(dataJsonRes);
            //
            var roomKeyStr = "";
            if (this.roomKey != null) {
                roomKeyStr = "房间号:" + this.roomKey;
            }
            if (dataJsonRes['currentCirCle'] != null) {
                this.jushu.getComponent(cc.Label).string = roomKeyStr + ("\u7B2C" + dataJsonRes['setId'] + "\u5C40 \u7B2C" + dataJsonRes['currentCirCle'] + "\u624B");
            }
        } catch (e) {
            console.error(e);
        }
    },
    HideDiPaiLayout: function HideDiPaiLayout() {
        this.px6gtTip.active = false;
        for (var i = 0; i < this.dipaiLayout.children.length; i++) {
            this.dipaiLayout.children[i].active = false;
        }
        this.dipaiLayout.active = false;
    },
    HideSpCardNode: function HideSpCardNode() {
        this.maCardNode.active = false;
        this.xingCardNode.active = false;
    },
    GetPokeCard: function GetPokeCard(poker, cardNode) {
        if (0 == poker) {
            return;
        }
        var type = "";
        var type1 = "";
        var type2 = "";
        var num = "";
        var cardColor = this.GetCardColor(poker);
        var cardValue = this.GetCardValue(poker);
        var numNode = cardNode.getChildByName("num");
        numNode.active = true;
        if (cardValue == 15) {
            cardValue = 2;
        }
        if (cardColor == 0) {
            type = "bg_diamond1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_diamond_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 16) {
            type = "bg_club1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_club_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 32) {
            type = "bg_heart1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_heart_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 48) {
            type = "bg_spade1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_spade_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 64) {
            //双数小鬼   0x42-0x4e
            numNode.active = false; //2,3,4,5,6,7,8,9,a
            if (cardValue % 2 == 0) {
                //双数小鬼
                type1 = "icon_small_king_01";
                type2 = "icon_small_king";
            } else if (cardValue % 2 == 1) {
                //单数大鬼
                type1 = "icon_big_king_01";
                type2 = "icon_big_king";
            }
        }
        var numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
        var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
        var icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
        numSp.spriteFrame = this.PokerCard.pokerDict[num];
        iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
        icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
    },
    //获取牌值
    GetCardValue: function GetCardValue(poker) {
        return poker & this.PokerCard.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor: function GetCardColor(poker) {
        while (poker >= 80) {
            poker -= 80;
        }
        var color = poker & this.PokerCard.LOGIC_MASK_COLOR;
        return color;
    },
    Event_GameRecord: function Event_GameRecord(serverPack) {
        this.alldata = serverPack.pSetRoomRecords;
        this.maxpage = serverPack.pSetRoomRecords.length;
        this.playBackCode = serverPack.pSetRoomRecords[0].playbackCode;
        this.ShowData(this.page);
    },
    ShowData: function ShowData() {
        this.SetPageLabel();
        var data = this.Str2Json(this.alldata[this.page - 1].dataJsonRes);
        this.playBackCode = this.alldata[this.page - 1].playbackCode;
        this.InitShowPlayerInfo(data);
        this.ShowRoomInfo(this.alldata[this.page - 1]);
        this.ShowPX6GTDiPai(data);
    },
    SetPageLabel: function SetPageLabel() {
        this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
        this.SetWndProperty("page2/editbox_page", "text", this.page);
    },
    InitShowPlayerInfo: function InitShowPlayerInfo(setEnd) {
        for (var i = 0; i < this.playerAll.length; i++) {
            var PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (i + 1));
            if (PlayerNode) {
                PlayerNode.active = false;
            } else {
                break;
            }
        }
        var posResultList = setEnd.posResultList;
        var count = 0;
        for (var _i = 0; _i < posResultList.length; _i++) {
            if (!posResultList[_i].pid) continue;
            var _PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (count + 1));
            _PlayerNode.active = true;
            _PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, _i);
            count++;
        }
    },
    ShowPX6GTDiPai: function ShowPX6GTDiPai(setEnd) {
        for (var i = 0; i < this.dipaiLayout.length; i++) {
            this.dipaiLayout.children[i].active = false;
        }
        //6滚筒显示埋底 6张牌
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_PX6GT) {
            var diPai = setEnd["diPai"];
            if (diPai.length > 0) {
                this.dipaiLayout.active = true;
                var nodeDemo = this.dipaiLayout.children[0];
                for (var _i2 = 0; _i2 < diPai.length; _i2++) {
                    var card = diPai[_i2];
                    var cardNode = this.dipaiLayout.children[_i2];
                    if (!cardNode) {
                        cardNode = cc.instantiate(nodeDemo);
                        this.dipaiLayout.addChild(cardNode);
                    }
                    cardNode.active = true;
                    this.GetPokeCard(card, cardNode);
                }
            }
        }
        //升级显示埋底8张牌
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_SJ) {
            var _diPai = setEnd["diPai"];
            // diPai = [2, 22, 25, 26, 28, 29, 30, 65];//测试用
            if (_diPai.length > 0) {
                this.dipaiLayout.active = true;
                var _nodeDemo = this.dipaiLayout.children[0];
                for (var _i3 = 0; _i3 < _diPai.length; _i3++) {
                    var _card = _diPai[_i3];
                    var _cardNode = this.dipaiLayout.children[_i3];
                    if (!_cardNode) {
                        _cardNode = cc.instantiate(_nodeDemo);
                        this.dipaiLayout.addChild(_cardNode);
                    }
                    _cardNode.active = true;
                    this.GetPokeCard(_card, _cardNode);
                }
            } else {
                console.error("没有底牌数据", setEnd);
            }
        }
        //------------------永州扯胡子
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_YZCHZ) {
            var maPai = setEnd["maPai"];
            var xingPai = setEnd["xingPai"];
            var allXingNum = setEnd["allXingNum"];
            this.HideSpCardNode();
            if (maPai > 0) {
                this.maCardNode.active = true;
                this.maCardNode.getChildByName("pai").cardID = maPai * 100;
                this.ShowCardImage(this.maCardNode.getChildByName("pai"));
            }
            if (xingPai > 0) {
                this.xingCardNode.active = true;
                this.xingCardNode.getChildByName("pai").cardID = xingPai * 100;
                this.ShowCardImage(this.xingCardNode.getChildByName("pai"));
                this.xingCardNode.getChildByName("num").getComponent(cc.Label).string = "x" + allXingNum;
            }
        }
        // ------------------wxls
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_WXLS) {
            var publicCard = setEnd["publicCard"];
            if (publicCard == "") {
                this.dipaiLayout.active = false;
                return;
            }
            this.dipaiLayout.active = true;
            var _nodeDemo2 = this.dipaiLayout.children[0];
            var _cardNode2 = this.dipaiLayout.children[0];
            if (!_cardNode2) {
                _cardNode2 = cc.instantiate(_nodeDemo2);
                this.dipaiLayout.addChild(_cardNode2);
            }
            _cardNode2.active = true;
            this.GetPokeCard(publicCard, _cardNode2);
        }
        //------------------永州扯胡子
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_last") {
            if (this.page == 1) {
                app.SysNotifyManager().ShowSysMsg("NowFirstPage");
                return;
            }
            this.page -= 1;
            this.ShowData();
        } else if (btnName == "btn_next") {
            if (this.page == this.maxpage) {
                app.SysNotifyManager().ShowSysMsg("NowLastPage");
                return;
            }
            this.page += 1;
            this.ShowData();
        } else if (btnName == "btn_share") {
            this.Click_btn_Share();
        } else if (btnName == "btn_replay") {
            this.NetManager.SendPack("game.CPlayerPlayBack", {
                "playBackCode": this.playBackCode,
                "chekcPlayBackCode": true
            }, this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
            return;
        } else if (btnName == "btn_search") {
            if (isNaN(this.page_search.string) == true) {
                return false;
            }
            var page_search = parseInt(this.page_search.string);
            if (page_search < 1) {
                this.page = 1;
            } else if (page_search >= this.maxpage) {
                this.page = this.maxpage;
            } else {
                this.page = page_search;
            }
            this.ShowData();
        } else {
            this.ErrLog("OnClick not find btnName", btnName);
        }
    },
    OnPack_VideoData: function OnPack_VideoData(serverPack) {
        //记录当前的switchData,退出的时候要调用
        var switchRecord = {
            action: "OpenUIRecordAllResult",
            playerAll: this.playerAll,
            roomId: this.roomId,
            unionId: this.unionId,
            roomKey: this.roomKey,
            gameType: this.gameTypeID,
            page: this.page
        };
        cc.sys.localStorage.setItem("switchRecord", JSON.stringify(switchRecord));
        app.Client.VideoCheckSubGame(serverPack.Name.toLowerCase(), this.playBackCode);
    },
    OnVideoFailed: function OnVideoFailed(serverPack) {
        app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
    },
    Click_btn_Share: function Click_btn_Share() {
        var heroName = app.HeroManager().GetHeroProperty("name");
        var gameId = app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()];
        var gameName = app.ShareDefine().GametTypeID2Name[gameId];
        var title = "回放码为【" + this.playBackCode + "】";
        var desc = "【" + heroName + "】邀请您观看【" + gameName + "】中牌局回放记录";
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var cityId = app.HeroManager().GetHeroProperty("cityId");
        var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl") + heroID + "&cityid=" + cityId;
        console.log("回放码==" + this.playBackCode);
        this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
    },
    Str2Json: function Str2Json(jsondata) {
        if (jsondata === "") {
            return false;
        }
        var json = JSON.parse(jsondata);
        return json;
    }
});

cc._RF.pop();