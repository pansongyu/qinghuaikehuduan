"use strict";
cc._RF.push(module, '3b5e28d1yNCj4mObHdIkxHq', 'nzmjChildCreateRoom');
// script/ui/uiGame/nzmj/nzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"kexuanwanfa": kexuanwanfa,
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
	AdjustSendPack: function AdjustSendPack(sendPack) {
		return sendPack;
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();