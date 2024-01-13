(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUserSetReservedBaoMingFei.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '955c7djb65PBarimd8r4OAP', 'UIUserSetReservedBaoMingFei', __filename);
// script/ui/club/UIUserSetReservedBaoMingFei.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data) {
        this.data = data;
        this.node.getChildByName("ValueEditBox").getComponent(cc.EditBox).string = data.reservedValue;
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = "当前预留值：" + data.reservedValue;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_sure") {
            var sendPack = {};
            sendPack.clubId = this.data.clubId;
            sendPack.pid = this.data.pid;
            sendPack.type = this.data.type;
            var valueStr = this.node.getChildByName("ValueEditBox").getComponent(cc.EditBox).string;
            if (parseFloat(valueStr) != null && parseFloat(valueStr) >= 0) {
                sendPack.value = parseFloat(valueStr);
            } else {
                app.SysNotifyManager().ShowSysMsg("预留分成值请输入大于等于0的数字", [], 3);
                return;
            }
            sendPack.promotionCalcActiveItemList = this.data.promotionCalcActiveItemList;
            var self = this;
            app.NetManager().SendPack("club.CClubFixedShareChangeMulti", sendPack, function (serverPack) {
                app.Client.OnEvent('OnClubFixedShareChangeMulti', serverPack);
                self.CloseForm();
            }, function () {});
        } else if (btnName == "btn_close" || btnName == "btn_cancel") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
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
        //# sourceMappingURL=UIUserSetReservedBaoMingFei.js.map
        