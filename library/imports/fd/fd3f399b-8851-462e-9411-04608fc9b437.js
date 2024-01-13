"use strict";
cc._RF.push(module, 'fd3f3mbiFFGLpQRBGCPybQ3', 'jdmj_detail_child');
// script/ui/uiGame/jdmj/jdmj_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},

	huTypesShow: function huTypesShow(jiesuan, huData) {
		jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('point').getChildByName('num').getComponent(cc.Label).string = huData.point;
		if (huData.jinHuaType) {
			jiesuan.getChildByName('huTypes').getChildByName('point').active = true;
		} else {
			jiesuan.getChildByName('huTypes').getChildByName('point').active = false;
		}
		// jiesuan.getChildByName('huTypes').getChildByName('baipai').getChildByName('num').getComponent(cc.Label).string = huData.mingBaiNum;
	}

});

cc._RF.pop();