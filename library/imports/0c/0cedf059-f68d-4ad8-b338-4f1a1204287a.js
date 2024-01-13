"use strict";
cc._RF.push(module, '0cedfBZ9o1K2LM4TxoSBCh6', 'bsmjChildCreateRoom');
// script/ui/uiGame/bsmj/bsmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// CreateSendPack -start-
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var fengDing = this.GetIdxByKey('fengDing');
		var wangpai = this.GetIdxByKey('wangpai');
		var wanfa = this.GetIdxByKey('wanfa');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var zhuama = this.GetIdxByKey('zhuama');
		var mashu = this.GetIdxByKey('mashu');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"fengDing": fengDing,
			"wangpai": wangpai,
			"wanfa": wanfa,
			"kexuanwanfa": kexuanwanfa,
			"zhuama": zhuama,
			"mashu": mashu,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard

		};
		return sendPack;
	},
	// CreateSendPack -end-

	AdjustSendPack: function AdjustSendPack(sendPack) {
		if (sendPack.zhuama == 0) {
			this.RemoveRadioSelect(sendPack, "mashu");
		}

		return sendPack;
	},

	OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
		var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (this.Toggles["mashu"]) {
			if (this.Toggles['zhuama'][0].getChildByName('checkmark').active) {
				this.Toggles['mashu'][0].parent.active = false;
			} else {
				this.Toggles['mashu'][0].parent.active = true;
			}
		}

		// 	勾选“只可自摸”，则不可勾选“炮胡算1分”和“炮胡9分起”；
		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa'][5].active = false;
				this.Toggles['kexuanwanfa'][6].active = false;
			} else {
				this.Toggles['kexuanwanfa'][5].active = true;
				this.Toggles['kexuanwanfa'][6].active = true;
			}

			// 	“炮胡算1分”和“炮胡9分起”不能同时勾选；
			if (this.Toggles['kexuanwanfa'][5].getChildByName('checkmark').active) {
				this.Toggles['kexuanwanfa'][6].active = false;
			} else {
				this.Toggles['kexuanwanfa'][6].active = true;
			}
			// 	“炮胡算1分”和“炮胡9分起”不能同时勾选；
			if (this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active) {
				this.Toggles['kexuanwanfa'][5].active = false;
			} else {
				this.Toggles['kexuanwanfa'][5].active = true;
			}
		}
	},

	OnToggleClick: function OnToggleClick(event) {
		this.FormManager.CloseForm("UIMessageTip");
		var toggles = event.target.parent;
		var toggle = event.target;
		var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
		var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
		var needClearList = [];
		var needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		} else if ('kexuanwanfa' == key) {
			// if(toggleIndex <2){
			//    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
			//    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
			// }
			// 	勾选“只可自摸”，则不可勾选“炮胡算1分”和“炮胡9分起”；
			if (toggleIndex == 2) {
				if (!this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][5].active = false;
					this.Toggles['kexuanwanfa'][6].active = false;
				} else {
					this.Toggles['kexuanwanfa'][5].active = true;
					this.Toggles['kexuanwanfa'][6].active = true;
				}
			}
			// 	“炮胡算1分”和“炮胡9分起”不能同时勾选；
			if (toggleIndex == 5) {
				if (!this.Toggles['kexuanwanfa'][5].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][6].active = false;
				} else {
					this.Toggles['kexuanwanfa'][6].active = true;
				}
			}
			// 	“炮胡算1分”和“炮胡9分起”不能同时勾选；
			if (toggleIndex == 6) {
				if (!this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][5].active = false;
				} else {
					this.Toggles['kexuanwanfa'][5].active = true;
				}
			}
		} else if ('zhuama' == key) {
			// if(toggleIndex <2){
			//    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
			//    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
			// }
			if (toggleIndex == 0) {
				// if (!this.Toggles['zhuama'][0].getChildByName('checkmark').active) {
				// 	this.Toggles['mashu'][0].parent.active = false;
				// } else {
				// 	this.Toggles['mashu'][0].parent.active = true;
				// }
				this.Toggles['mashu'][0].parent.active = false;
			} else {
				this.Toggles['mashu'][0].parent.active = true;
			}
		}
		// else if('kexuanwanfa' == key){
		//     // let quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
		//     // if (quanzimo && toggleIndex == 0) {
		//     //     app.SysNotifyManager().ShowSysMsg("全自摸不能选择有金必游",[],3);
		//     //     return;
		//     // }
		// }else if ('beishu' == key) {
		//     // let quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
		//     // if (quanzimo) {
		//     //     if (0 == toggleIndex) return;
		//     //     app.SysNotifyManager().ShowSysMsg("全自摸只能选择四倍",[],3);
		//     //     return;
		//     // }
		// }else if ('wanfa' == key) {
		//     // if (1 == toggleIndex) {//全自摸倍数默认为最低倍
		//     //     this.ClearToggleCheck(this.Toggles['beishu'], [0]);
		//     //     this.UpdateLabelColor(this.Toggles['beishu'][0].parent);
		//     //     //全自摸不能游金必游
		//     //     this.ClearToggleCheck(this.Toggles['kexuanwanfa']);
		//     //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
		//     // }
		// }
		if (toggles.getComponent(cc.Toggle)) {
			//复选框
			needShowIndexList = [];
			for (var i = 0; i < needClearList.length; i++) {
				var mark = needClearList[i].getChildByName('checkmark').active;
				//如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
				if (mark && i != toggleIndex) {
					needShowIndexList.push(i);
				}
				//如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
				else if (!mark && i == toggleIndex) {
						needShowIndexList.push(i);
					}
			}
		}
		this.ClearToggleCheck(needClearList, needShowIndexList);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
	}
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();