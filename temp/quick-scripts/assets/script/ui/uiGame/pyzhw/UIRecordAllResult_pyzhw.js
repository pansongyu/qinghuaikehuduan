(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/pyzhw/UIRecordAllResult_pyzhw.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4e5d7LUX2VLIbCDMWEHe9zP', 'UIRecordAllResult_pyzhw', __filename);
// script/ui/uiGame/pyzhw/UIRecordAllResult_pyzhw.js

"use strict";

var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,
		players: cc.Node,
		cardPrefab: cc.Prefab,
		page_search: cc.EditBox,
		huaSeSprite: [cc.SpriteFrame]
	},

	OnCreateInit: function OnCreateInit() {
		this.FormManager = app.FormManager();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.SDKManager = app.SDKManager();
		this.NetManager = app.NetManager();
		this.WeChatManager = app.WeChatManager();
		this.PokerCard = app.PokerCard();
		this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
		this.RegEvent("GameRecord", this.Event_GameRecord, this);
		this.lastChildName = null;
		this.lastRoomId = 0;
		this.koudilayout = this.GetWndNode("bottom/koudilayout");
		this.flower = this.GetWndComponent("bottom/bg_poker/flower", cc.Sprite);
	},
	OnShow: function OnShow(roomId, playerAll, gameType) {
		var unionId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
		var path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
		this.FormManager.ShowForm("UITop", path);
		this.huaSeSpriteDict = {
			spade: this.huaSeSprite[0],
			heart: this.huaSeSprite[1],
			club: this.huaSeSprite[2],
			diamond: this.huaSeSprite[3]
		};

		this.playerAll = playerAll;
		this.roomId = roomId;
		this.unionId = unionId;
		this.getWndNodePath = "players";
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
		this.DestroyAllChildren(this.players);
		Player1Node.name = 'player1';
		this.players.addChild(Player1Node);
		this.InitPlayers();
		this.koudilayout.removeAllChildren();
		for (var i = 0; i < 10; i++) {
			var node = cc.instantiate(this.cardPrefab);
			this.koudilayout.addChild(node);
			node.active = false;
		}
		this.alldata = false;
		this.page = 1;
		this.maxpage = 0;
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", { "roomID": this.roomId }, this.Event_GameRecord.bind(this));
	},
	InitPlayers: function InitPlayers() {
		var AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
		for (var i = 2; i <= this.playerAll.length; i++) {
			var PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			PlayerSon.active = false;
			this.players.addChild(PlayerSon);
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
		console.log("InitShowPlayerInfo", data);
		var zhuColor = data["liangZhu"];
		this.ShowZhuCardColor(zhuColor);
		var kouDi = data["kouDi"];
		this.ShowKouDi(kouDi);
		var zhuangBaoFen = data["zhuangBaoFen"];
		var zhuangJianFen = data["zhuangJianFen"];
		this.SetWndProperty("room_info/labelbaofen/baofen", "text", zhuangBaoFen);
		this.SetWndProperty("room_info/labeljianfen/jianfen", "text", zhuangJianFen);
	},
	ShowZhuCardColor: function ShowZhuCardColor(zhuColor) {
		this.flower.spriteFrame = this.huaSeSpriteDict[zhuColor];
	},
	ShowKouDi: function ShowKouDi(cardList) {
		for (var i = 0; i < this.koudilayout.children.length; i++) {
			var node = this.koudilayout.children[i];
			var value = cardList[i];
			if (value) {
				this.GetPokeCard(value, node);
				node.getChildByName("poker_back").active = false;
				node.active = true;
			} else {
				node.active = false;
			}
		}
	},
	SetPageLabel: function SetPageLabel() {
		this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
		this.SetWndProperty("page2/editbox_page", "text", this.page);
	},
	InitShowPlayerInfo: function InitShowPlayerInfo(setEnd) {
		var dPos = setEnd["dPos"];
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
			_PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, _i, dPos);
			count++;
		}
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
		// let gameName = app.ShareDefine().GametTypeID2PinYin[serverPack];
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
        //# sourceMappingURL=UIRecordAllResult_pyzhw.js.map
        