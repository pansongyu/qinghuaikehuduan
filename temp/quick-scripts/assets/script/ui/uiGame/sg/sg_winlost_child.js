(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sg/sg_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ea38efpY+xJq6ebGQJQU1uU', 'sg_winlost_child', __filename);
// script/ui/uiGame/sg/sg_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		sp_cardBack: [cc.SpriteFrame]
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
		this.Type = { //CardType
			0: "乌隆",
			1: "对子",
			2: "两对",
			3: "三条",
			4: "充扎",
			5: "爽枉充投",
			6: "叁贵",
			7: "顺子",
			8: "同花",
			9: "一对同花",
			10: "两对同花",
			11: "葫芦",
			12: "铁支",
			13: "同花顺",
			14: "五同",
			15: "六同",
			16: "五鬼",

			84: "三顺子",
			85: "三同花",
			86: "六对半",
			87: "三顺子",
			88: "三同花",
			89: "六对半",
			90: "六对半",
			91: "四套三条",
			92: "三分天下",
			93: "三同花顺",
			94: "一条龙",
			100: "至尊清龙"
		};
		console.log("pokercard", this.PokerCard);
	},
	ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		var player = setEnd.posResultList[index];
		//倍数
		//this.node.getChildByName("lb_beiShu").active = true;
		//let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

		//beishu.string = player.doubleNum;

		//底分
		this.node.getChildByName("lb_difen").active = false;
		// let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
		// difen.string = player.baseMark;


		//显示底牌
		var cardNode = this.node.getChildByName("card");
		cardNode.active = false;
		for (var i = 0; i < cardNode.children.length; i++) {
			cardNode.children[i].active = false;
		}
		var lb_point_win = this.node.getChildByName("lb_win_num");
		var lb_point_lose = this.node.getChildByName("lb_lose_num");
		this.GetLabelByNode(lb_point_win).string = "";
		this.GetLabelByNode(lb_point_lose).string = "";
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = player["isOwner"];
		// let isQiPai = player["isQiPai"];
		// this.node.getChildByName("jiegou").active = player["isJieGuo"];
		// if (isQiPai) {
		// 	let qiPai = -4;
		// 	let cardList = [];
		// 	for (let i = 0; i < player["privateCards"].length; i++) {
		// 		cardList.push(0);
		// 	}
		// 	this.ShowPrivateCards(cardList, isQiPai);
		// 	this.ShowChipValue(qiPai);
		// } else {
		this.ShowPrivateCards(player["cardList"]);
		// this.ShowChipValue(player["value"], player["isShowValue"]);
		var info = this.GetSGPokerTypeStr(player["cardList"], player["crawType"]);
		this.node.getChildByName("cardType").getComponent(cc.Label).string = info.typeStr;
		// }

		this.ShowPointValue(player["point"]);
		/*//比赛分消耗
  console.log("比赛分消耗", player);
  let lb_sportsPoint = this.node.getChildByName("lb_sportsPointTitle").getChildByName("lb_sportsPoint");
  if (typeof(player["sportsPoint"]) != "undefined") {
  	if (sportsPoint > 0) {
  		lb_sportsPoint.getComponent(cc.Label).string = "比赛分:+" + sportsPoint;
  	} else {
  		lb_sportsPoint.getComponent(cc.Label).string = "比赛分:" + sportsPoint;
  	}
  	lb_sportsPoint.active = true;
  } else {
  	lb_sportsPoint.active = false;
  }*/
	},
	GetSGPokerTypeStr: function GetSGPokerTypeStr(cards, cardType) {
		var bSpecialNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		//specialNum 8点倍数
		if (3 != cards.length) return;
		var data = {};
		data.typeStr = '';
		data.isBigCard = false;
		data.beiShu = 0;
		data.useRedColor = true;
		if (0 == cardType) {
			var curValue = this.GetSGValue(cards);
			data.typeStr = curValue.toString();
			data.typeStr += '点';
			if (curValue < 8) data.beiShu = 1;else if (8 == curValue && !bSpecialNum) data.beiShu = 2;else data.beiShu = 3;

			data.useRedColor = false;
		} else if (101 == cardType || 102 == cardType) {
			if (101 == cardType) data.typeStr = '单公';else data.typeStr = '双公';

			var _curValue = this.GetSGValue(cards);
			if (_curValue < 8) data.beiShu = 1;else if (8 == _curValue && !bSpecialNum) data.beiShu = 2;else data.beiShu = 3;
			// curValue += 97;//to a
			// data.typeStr += String.fromCharCode(curValue);
			// data.typeStr += '电';
			data.typeStr += _curValue.toString();
			data.typeStr += '点';
			data.useRedColor = false;
		} else if (103 == cardType) {
			data.typeStr = '混三功';
			data.beiShu = 5;
			data.isBigCard = true;
		} else if (104 == cardType) {
			data.typeStr = '小三功';
			data.beiShu = 7;
			data.isBigCard = true;
		} else if (105 == cardType) {
			data.typeStr = '大三功';
			data.beiShu = 9;
			data.isBigCard = true;
		} else if (106 == cardType) {
			data.typeStr = '至尊';
			data.beiShu = 9;
			data.isBigCard = true;
		}
		return data;
	},
	GetSGValue: function GetSGValue(cards) {
		var value0 = this.GetCardValue(cards[0]);
		var value1 = this.GetCardValue(cards[1]);
		var value2 = this.GetCardValue(cards[2]);
		if (value0 >= 10) value0 = 10;
		if (value1 >= 10) value1 = 10;
		if (value2 >= 10) value2 = 10;
		var needValue = value0 + value1 + value2;
		needValue = needValue % 10;
		return needValue;
	},
	ShowPrivateCards: function ShowPrivateCards(privateCards, isQiPai) {
		var cardList = this.node.getChildByName("card");
		cardList.active = true;
		for (var i = 0; i < privateCards.length; i++) {
			var cardValue = privateCards[i];
			var cardNode = cardList.children[i];
			cardNode.active = true;
			if (i + 1 == privateCards.length) {
				this.ShowCard(cardValue, cardNode, true, isQiPai);
			} else {
				this.ShowCard(cardValue, cardNode, false, isQiPai);
			}
		}
	},
	ShowChipValue: function ShowChipValue(value, isShowValue) {
		var lb_dianShu = this.node.getChildByName("lb_dianshu");
		var dianShu = "";
		if (isShowValue) {
			if (value == 0) {
				dianShu = "";
			}
			if (value > 0) {
				dianShu = value + "点";
			}
			if (value == -3) {
				dianShu = "大小王";
			}
			if (value == -2) {
				dianShu = "炸弹";
			}
			if (value == -1) {
				dianShu = "三条";
			}
		} else {
			dianShu = "";
			if (value == -4) {
				dianShu = "弃牌";
			}
		}
		this.GetLabelByNode(lb_dianShu).string = dianShu;
	},
	ShowPointValue: function ShowPointValue(setPoint) {
		var lb_point_win = this.node.getChildByName("lb_win_num");
		var lb_point_lose = this.node.getChildByName("lb_lose_num");
		if (setPoint > 0) {
			this.GetLabelByNode(lb_point_win).string = "+" + setPoint;
			lb_point_win.active = true;
			lb_point_lose.active = false;
		} else {
			this.GetLabelByNode(lb_point_lose).string = "+" + setPoint;
			lb_point_lose.active = true;
			lb_point_win.active = false;
		}
	},
	ShowCard: function ShowCard(cardType, node, isShowIcon1, isQiPai) {
		var newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(newPoker, node, isShowIcon1);
		var poker_back = node.getChildByName("poker_back");
		poker_back.active = false;
		if (newPoker == 0) {
			var cardBack = this.sp_cardBack[0]; //默认蓝色的
			if (isQiPai) {
				cardBack = this.sp_cardBack[1]; //弃牌灰色的
			}
			poker_back.getComponent(cc.Sprite).spriteFrame = cardBack;
			poker_back.active = true;
		} else {
			poker_back.active = false;
		}
	},
	GetLabelByNode: function GetLabelByNode(node) {
		var label = node.getComponent(cc.Label);
		return label;
	},
	GetPokeCard: function GetPokeCard(poker, cardNode) {
		var isShowIcon1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		var isShowLandowner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
		var hideBg = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
		var isRazz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
		var isPartnerCard = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

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
		if (cardColor == 0) {
			type = "bg_diamond1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			/*if (cardValue > 10 && cardValue < 14) {
   	type2 = "bg_red_" + cardValue;
   	// type1 = "";
   	// type2 = "bg_diamond_" + cardValue;
   }*/
			num = "red_" + cardValue;
		} else if (cardColor == 16) {
			type = "bg_club1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			/*if (cardValue > 10 && cardValue < 14) {
   	type2 = "bg_blue_" + cardValue;
   	// type1 = "";
   	// type2 = "bg_club_" + cardValue;
   }*/
			num = "black_" + cardValue;
		} else if (cardColor == 32) {
			type = "bg_heart1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			/*if (cardValue > 10 && cardValue < 14) {
   	type2 = "bg_red_" + cardValue;
   	// type1 = "";
   	// type2 = "bg_heart_" + cardValue;
   }*/
			num = "red_" + cardValue;
		} else if (cardColor == 48) {
			type = "bg_spade1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			/*if (cardValue > 10 && cardValue < 14) {
   	type2 = "bg_blue_" + cardValue;
   	// type1 = "";
   	// type2 = "bg_spade_" + cardValue;
   }*/
			num = "black_" + cardValue;
		} else if (cardColor == 64) {
			//双数小鬼   0x42-0x4e
			numNode.active = false; //2,3,4,5,6,7,8,9,a
			/*if (cardValue % 2 == 0) {//双数小鬼
   	type1 = "icon_small_king_01";
   	type2 = "icon_small_king";
   } else if (cardValue % 2 == 1) {//单数大鬼
   	type1 = "icon_big_king_01";
   	type2 = "icon_big_king";
   }*/
			if (cardValue % 2 == 0) {
				type1 = "icon_big_king_01";
				type2 = "icon_big_king";
			} else if (cardValue % 2 == 1) {
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			}
		}
		var numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		var icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		/*numSp.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
  iconSp.spriteFrame = this.pokerAtlas.getSpriteFrame(type1);
  icon1_Sp.spriteFrame = this.pokerAtlas.getSpriteFrame(type2);*/
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
		if (hideBg) {
			cardNode.getChildByName("poker_back").active = false;
		}
	},
	//获取牌值
	GetCardValue: function GetCardValue(poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function GetCardColor(poker) {
		while (poker >= 256) {
			poker -= 256;
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
        //# sourceMappingURL=sg_winlost_child.js.map
        