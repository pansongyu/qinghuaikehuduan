(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dzzj/dzzjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2656bYC8GBDu463tPhAE7ur', 'dzzjChildCreateRoom', __filename);
// script/ui/uiGame/dzzj/dzzjChildCreateRoom.js

"use strict";

/*
 创建房间子界面
 */
var app = require("app");

var ygwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var lianmai = this.GetIdxByKey('lianmai');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "kexuanwanfa": kexuanwanfa,
            "lianmai": lianmai,
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
        if (sendPack.playerNum != "4") {}
        return sendPack;
    },

    OnToggleClick: function OnToggleClick(event) {
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
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
            this.UpdateTogglesLabel(toggles);
            this.UpdateOnClickToggle();
        } else if ("fangjian" == key) {
            /*// 小局托管解散,解散次数不超过5次,
             // 托管2小局解散,解散次数不超过3次",
             if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
             this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
             this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
             } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
             this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
             this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
             }*/
            if (toggleIndex == 4) {
                if (this.Toggles['fangjian'][5].getChildByName('checkmark').active) {
                    return;
                }
            }
            if (toggleIndex == 5) {
                if (this.Toggles['fangjian'][4].getChildByName('checkmark').active) {
                    return;
                }
            }
        } else {}
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
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["fangjian"]) {
            this.Toggles["fangjian"][2].active = false;
            this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
        }
    }

});

module.exports = ygwskChildCreateRoom;

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
        //# sourceMappingURL=dzzjChildCreateRoom.js.map
        