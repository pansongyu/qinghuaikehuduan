"use strict";
cc._RF.push(module, '55c09djZjxAbYY4r3ienxvT', 'zxmjChildCreateRoom');
// script/ui/uiGame/zxmj/zxmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zxChildCreateRoom = cc.Class({
				extends: require("BaseChildCreateRoom"),

				properties: {},
				//需要自己重写
				CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
								var sendPack = {};
								var difen = this.GetIdxByKey('difen');
								var laizi = this.GetIdxByKey('laizi');
								var xuanpiao = this.GetIdxByKey('xuanpiao');
								var fangjian = this.GetIdxsByKey('fangjian');
								var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
								var xianShi = this.GetIdxByKey('xianShi');
								var jiesan = this.GetIdxByKey('jiesan');
								var gaoji = this.GetIdxsByKey('gaoji');

								sendPack = {
												"difen": difen,
												"laizi": laizi,
												"xuanpiao": xuanpiao,
												"fangjian": fangjian,
												"kexuanwanfa": kexuanwanfa,
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

				UpdateOnClickToggle: function UpdateOnClickToggle() {
								/*if (this.Toggles["wanfa"]) {
            if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles["wanfa"][0].parent.active = false;
            } else {
                this.Toggles["wanfa"][0].parent.active = true;
            }
        }*/
				}
});

module.exports = zxChildCreateRoom;

cc._RF.pop();