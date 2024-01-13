"use strict";
cc._RF.push(module, '22f310iLWRPFZKrBg89FeLI', 'fqsbpChildCreateRoom');
// script/ui/uiGame/fqsbp/fqsbpChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fqsbpChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var kexuanwanfa = [];
		for (var i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles["fangjian"].length; _i++) {
			if (this.Toggles["fangjian"][_i].getChildByName("checkmark").active) {
				fangjian.push(_i);
			}
		}
		var gaoji = [];
		for (var _i2 = 0; _i2 < this.Toggles["gaoji"].length; _i2++) {
			if (this.Toggles["gaoji"][_i2].getChildByName("checkmark").active) {
				gaoji.push(_i2);
			}
		}
		//打枪倍数
		var daqiang = this.GetIdxByKey("daqiang");
		//用牌
		var yongpai = this.GetIdxByKey("yongpai");
		//底分
		var difen = this.GetIdxByKey("difen");
		//限时
		var xianShi = this.GetIdxByKey("xianShi");
		//解散
		var jiesan = this.GetIdxByKey("jiesan");
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"yongpai": yongpai,
			"daqiang": daqiang,
			"difen": difen,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"sign": 1
		};
		return sendPack;
	},
	UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
		var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (this.Toggles["renshu"] && this.Toggles["yongpai"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
				this.Toggles["yongpai"][0].active = true;
				this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
				this.Toggles["yongpai"][1].active = false;
			} else if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
				this.Toggles["yongpai"][0].getChildByName("checkmark").active = false;
				this.Toggles["yongpai"][0].active = false;
				this.Toggles["yongpai"][1].getChildByName("checkmark").active = true;
				this.Toggles["yongpai"][1].active = true;
			}
		}
		var curKey = TogglesNode.name.substring('Toggles_'.length, TogglesNode.name.length);
		var reg = /\/s/g;
		for (var key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				if (curKey == this.gameCreateConfig[key].Key) {
					var AAfangfeiDatas = [];
					var WinfangfeiDatas = [];
					var FangZhufangfeiDatas = [];
					var clubGuanLiFangFeiDatas = [];
					var clubWinFangFeiDatas = [];
					var clubAAFangFeiDatas = [];
					var unionGuanliFangFeiDatas = [];
					var title = this.gameCreateConfig[key].Title.replace(reg, ' ');
					TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
					var descList = [];
					if ("jushu" != curKey) {
						//局数读roomcost
						descList = this.gameCreateConfig[key].ToggleDesc.split(',');
						if (this.clubData && "fangfei" == curKey) {
							descList = ["管理付"];
						} else if (this.unionData && "fangfei" == curKey) {
							descList = ['盟主付'];
						}
						if (descList.length != TogglesNode.children.length - 2) {
							//减去标题和帮助按钮
							this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
							break;
						}
					}
					var jushuIndex = -1;
					var renshuIndex = -1;
					var renshu = []; //0表示读房主支付配置
					if ("renshu" == curKey || "fangfei" == curKey || "jushu" == curKey || "leixing" == curKey) {
						var publicCosts = this.getCostData(renshu);
						if (this.Toggles["renshu"]) {
							renshu = this.getCurSelectRenShu();
						}
						var SpiltCosts = this.getCostData(renshu);
						var curCostData = null;
						if (0 == renshu.length) {
							curCostData = publicCosts;
						} else {
							curCostData = SpiltCosts;
						}
						if (this.Toggles["jushu"]) {
							jushuIndex = 0;
							for (var i = 0; i < this.Toggles["jushu"].length; i++) {
								var mark = this.Toggles["jushu"][i].getChildByName("checkmark").active;
								if (mark) {
									jushuIndex = i;
									break;
								}
								jushuIndex++;
							}
							for (var _i3 = 0; _i3 < curCostData.length; _i3++) {
								this.Toggles["jushu"][_i3].getChildByName("label").getComponent(cc.Label).string = curCostData[_i3].SetCount + '局';
							}
						}
						if (this.Toggles["fangfei"] && -1 != jushuIndex) {
							if (jushuIndex < publicCosts.length) {
								AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

								clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
								clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
								clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
								//赛事房费
								unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
							}
							if (jushuIndex < SpiltCosts.length) {
								AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

								clubGuanLiFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCostCount);
								clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
								clubAAFangFeiDatas.push(SpiltCosts[jushuIndex].ClubAaCostCount);
								//赛事房费
								unionGuanliFangFeiDatas.push(SpiltCosts[jushuIndex].UnionCostCount);
							}
						}
					}
					if ("jushu" != curKey) {
						var descInde = 0;
						for (var _i4 = 0; _i4 < TogglesNode.children.length; _i4++) {
							if (TogglesNode.children[_i4].name.startsWith("Toggle")) {
								TogglesNode.children[_i4].getChildByName("label").getComponent(cc.Label).string = descList[descInde];
								descInde++;
							}
						}
					}

					if (0 != AAfangfeiDatas.length) {
						var needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
						var ffNodes = this.Toggles["fangfei"];
						var hasHideNode = false;
						var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
						for (var s = 0; s < ffNodes.length; s++) {
							var needNode = ffNodes[s].getChildByName("fangfeiNode");
							needNode.active = true;
							if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
								needNode.parent.x = needNode.parent.x - spacing[s] - 80;
								hasHideNode = false;
							}
							//如果房费配的是0，则隐藏
							if (needCount <= 0 && 1 == s || needCount <= 0 && 2 == s) {
								//
								needNode.parent.active = false;
								hasHideNode = true;
								console.log("如果房费配的是0，则隐藏", ffNodes);
								continue;
							}
							var disCost = -1;
							if (this.clubData == null && this.unionData == null) {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								} else if (1 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								} else {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
							} else if (this.clubData == null && this.unionData != null) {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
							} else {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
								// else if(1==s){
								//     needNode.getChildByName('icon').active=false;
								//     needNode.getChildByName('icon_qk').active=true;
								//     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
								//     needNode.getChildByName('needNum').clubWinnerPayConsume = clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
								//     ffNodes[s].getChildByName('editbox').active=false;
								// }else{
								//     needNode.getChildByName('icon').active=false;
								//     needNode.getChildByName('icon_qk').active=true;
								//     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
								//     needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
								//     ffNodes[s].getChildByName('editbox').active=false;
								// }
							}
						}
					}
				}
			}
		}
		if (this.Toggles["gaoji"]) {
			for (var _i5 = 0; _i5 < this.Toggles["gaoji"].length; _i5++) {
				var ToggleDesc = this.Toggles["gaoji"][_i5].getChildByName("label").getComponent(cc.Label).string;
				if (ToggleDesc == "30秒未准备自动踢出房间") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["gaoji"][_i5].active = false;
						this.Toggles["gaoji"][_i5].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["gaoji"][_i5].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		} else if (this.Toggles["kexuanwanfa"]) {
			for (var _i6 = 0; _i6 < this.Toggles["kexuanwanfa"].length; _i6++) {
				var _ToggleDesc = this.Toggles["kexuanwanfa"][_i6].getChildByName("label").getComponent(cc.Label).string;
				if (_ToggleDesc == "比赛分不能低于0") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["kexuanwanfa"][_i6].active = false;
						this.Toggles["kexuanwanfa"][_i6].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["kexuanwanfa"][_i6].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		}
	},
	getCostData: function getCostData(renshu) {
		//renshu =0 房主支付
		var costs = [];
		if (renshu.length != 2) {
			return costs;
		}
		var allSelectCityData = app.HeroManager().GetCurSelectCityData();
		var curselectId = allSelectCityData[0]['selcetId'];
		if (this.clubData != null) {
			curselectId = this.clubData.cityId;
		} else if (this.unionData != null) {
			curselectId = this.unionData.cityId;
		}
		var sign = 1;
		for (var key in this.roomcostConfig) {
			//先匹配是否是当前城市，key的前7位是城市id
			// console.log("key city === " + parseInt(key.substring(0, 7)));
			// console.log("curselectId === " + curselectId);
			if (parseInt(key.substring(0, 7)) != curselectId) {
				continue;
			}
			if (this.gameType.toUpperCase() == this.roomcostConfig[key]["GameType"] && parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax && sign == this.roomcostConfig[key]["Sign"]) {
				costs.push(this.roomcostConfig[key]);
			}
		}
		if (0 == costs.length) {
			console.log("roomcost Config error");
		}
		return costs;
	}
});

module.exports = fqsbpChildCreateRoom;

cc._RF.pop();