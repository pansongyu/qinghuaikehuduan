"use strict";
cc._RF.push(module, '2e0bfx7YFBBebOW0T33T6Bc', 'ntcp_winlost_child');
// script/ui/uiGame/ntcp/ntcp_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		sp_in: cc.Node,
		downNode: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
		this.sp_in = this.node.getChildByName("showcard").getChildByName("sp_in");
	},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		var jin1 = setEnd.jin;
		var jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		var dPos = setEnd.dPos;
		var posResultList = setEnd["posResultList"];
		var posHuArray = new Array();
		var posCount = posResultList.length;
		for (var i = 0; i < posCount; i++) {
			var posInfo = posResultList[i];
			var pos = posInfo["pos"];
			var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		var PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.zhuaNiaoList);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index]["isTing"]);

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
		var zhuaNiaoList = arguments[5];

		this.showLabelNum = 1;
		this.posResultInfo = HuList;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		// this.ShowDetailScores(PlayerNode.getChildByName('scores'));
		this.ShowPiaoMaiState(PlayerNode);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcardntcp'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcardntcp'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},

	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
		ShowNode.active = 1;
		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}

		var handCardNode = ShowNode.getChildByName('handCard');
		handCardNode.removeAllChildren();
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var cardNode = cc.instantiate(this.sp_in);
			handCardNode.addChild(cardNode);
			this.ShowJinBg(cardID, cardNode, jin1, jin2);
			this.ShowImage(cardNode, cardID, jin1, jin2);
		}

		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowJinBg: function ShowJinBg(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publicCardList) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		ShowNode.active = 1;
		var count = 0;
		if (typeof publicCardList != "undefined") {
			count = publicCardList.length;
		}

		var handCardNode = ShowNode.getChildByName('downCard');
		handCardNode.removeAllChildren();
		for (var index = 0; index < count; index++) {
			var publicInfoList = publicCardList[index];
			var cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			var opType = publicInfoList[0];
			//如果是暗杠,前面3个盖牌，最后一个显示牌
			if (opType == this.ShareDefine.OpType_AnGang) {
				cardIDList = [0, 0, 0, cardIDList[3]];
			}

			var downNode = cc.instantiate(this.downNode);
			ShowNode.addChild(downNode);

			downNode.active = true;
			var cardCount = cardIDList.length;
			for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				var cardID = cardIDList[cardIndex];
				var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				var childNode = cc.find(paiChildName, downNode);
				if (!childNode) {
					continue;
				}
				childNode.active = true;
				this.ShowImage(childNode, cardID);
			}
			//设置多余的卡牌位置空
			for (var _cardIndex = cardCount + 1; _cardIndex <= this.PaiChildCount; _cardIndex++) {
				var _paiChildName = this.ComTool.StringAddNumSuffix("card", _cardIndex, 2);
				var _childNode = cc.find(_paiChildName, downNode);
				if (!_childNode) {
					continue;
				}
				var cardSprite = _childNode.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;
				_childNode.active = false;
			}
		}
	},

	ShowImage: function ShowImage(childNode, cardID) {
		//显示贴图
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}

		var imagePath = "ui/uiGame/ntcp/card/" + Math.floor(cardID / 100);
		if (app['majiang_' + imagePath]) {
			childSprite.spriteFrame = app['majiang_' + imagePath];
		} else {
			var that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return;
				}
				childSprite.spriteFrame = spriteFrame;
				app['majiang_' + imagePath] = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
		}
	},

	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		var isTing = HuList["isTing"];
		// let isDisoolve = HuList["isDisoolve"];

		ShowNode.getChildByName('ting').active = isTing;
		// ShowNode.getChildByName('jiesanzhe').active = isDisoolve;

	},
	ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
		huacardscrollView.active = true;
		// if (hualist.length > 0) {
		//     this.huaNum.active = true;
		//     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		// }
		// else {
		//     this.huaNum.active = false;
		//     this.huaNum.getComponent(cc.Label).string = "";
		// }
		var view = huacardscrollView.getChildByName("view");
		var ShowNode = view.getChildByName("huacard");
		var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);
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
	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName, isTing) {
		/*huLbIcon
  *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
  *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
  */
		var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof huType == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点炮';
			huNode.color = new cc.Color(192, 221, 245);
			huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			huNode.getComponent(cc.LabelOutline).Width = 2;
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else if (huType == this.ShareDefine.HuType_GSKH) {
			huNode.getComponent(cc.Label).string = '杠上花';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},

	ShowDetailScores: function ShowDetailScores(scoreNodes) {
		scoreNodes.getChildByName("lb_huPoint").getComponent(cc.Label).string = "胡牌: " + this.posResultInfo["huPoint"];
		scoreNodes.getChildByName("lb_gangPoint").getComponent(cc.Label).string = "杠分: " + this.posResultInfo["gangPoint"];
		scoreNodes.getChildByName("lb_piaoPoint").getComponent(cc.Label).string = "漂分: " + this.posResultInfo["piaoPoint"];
		scoreNodes.getChildByName("lb_genPoint").getComponent(cc.Label).string = "跟庄: " + this.posResultInfo["genPoint"];
	},

	ShowPiaoMaiState: function ShowPiaoMaiState(PlayerNode) {
		var lb_piaoFen = PlayerNode.getChildByName("lb_piaoFen").getComponent(cc.Label);
		var lb_mai = PlayerNode.getChildByName("lb_mai").getComponent(cc.Label);

		var piaoFenStr = "";
		// if (this.posResultInfo["piaoFen"] == 0) piaoFenStr = "不漂" + this.posResultInfo["piaoFen"];
		// else if (this.posResultInfo["piaoFen"] != -1) piaoFenStr = "漂" + this.posResultInfo["piaoFen"];
		lb_piaoFen.string = piaoFenStr;

		var maiStr = "";
		// if (this.posResultInfo["piaoFen"] == 1) maiStr = "买";
		// else if (this.posResultInfo["piaoFen"] == 0) maiStr = "不买";
		lb_mai.string = maiStr;
	},

	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = huInfoAll["huTypeMap"];
		if (!huInfo) {
			huInfo = huInfoAll.endPoint.huTypeMap;
		}
		// let huInfo = huInfoAll.huTypeMap;
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (this.IsShowMulti(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
			} else if (this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "个");
			} else if (this.IsNoShowScore(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	//分数
	IsShowScore: function IsShowScore(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	IsNoShowScore: function IsNoShowScore(huType) {
		this.noShowScore = ["ChengBao", "BeiChengBao"];
		var multi2 = this.noShowScore || [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	//个数
	IsShowNum: function IsShowNum(huType) {
		var multi2 = [
			// "JieGang",		//接杠
			// "Gang",			//补杠
			// "AnGang",		//暗杠
		];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti: function IsShowMulti(huType) {
		var multi2 = [
			// "QingYiSe",		//清一色
			// "HunYiSe",		//混一色
			// "Long",			//一条龙
			// "PPHu",			//对对胡
			// "QD",			//七对
			// "HHQD",			//豪华七对
			// "GSKH",			//杠上开花
			// "DDC",			//大吊车
			// "ZhuangFan",	//庄翻
		];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = this.GetHuTypeDict();

		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function GetHuTypeDict() {
		var huTypeDict = {};
		huTypeDict["DiHu"] = "底胡";
		huTypeDict["YZ"] = "丫子";
		huTypeDict["ZM"] = "自摸";
		huTypeDict["TZH"] = "塌子胡";
		huTypeDict["DD"] = "单吊";
		huTypeDict["GK"] = "杠开";
		huTypeDict["QH"] = "清胡";
		huTypeDict["DWQ"] = "单文钱";
		huTypeDict["SWQ"] = "双文钱";
		huTypeDict["SanWQ"] = "三文钱";
		huTypeDict["SiWQ"] = "四文钱";
		huTypeDict["CH"] = "成胡";
		huTypeDict["Xi"] = "喜";
		huTypeDict["SL"] = "双龙";
		huTypeDict["SLJH"] = "三老聚会";
		huTypeDict["MP"] = "闷飘";
		huTypeDict["PH"] = "飘胡";
		huTypeDict["PHT"] = "飘胡";
		huTypeDict["TH"] = "天胡";
		huTypeDict["DH"] = "地胡";
		huTypeDict["XiEr"] = "喜儿";
		huTypeDict["QX"] = "穷喜";
		huTypeDict["TT"] = "天听";
		huTypeDict["HDLY"] = "海底捞月";
		huTypeDict["LDF"] = "输底胡";

		return huTypeDict;
	}
	// GetHuTypeDict -end-


});

cc._RF.pop();