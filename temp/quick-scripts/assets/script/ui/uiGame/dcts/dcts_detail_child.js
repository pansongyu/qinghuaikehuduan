(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dcts/dcts_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '544418I8htBP5tNwA7PmhmU', 'dcts_detail_child', __filename);
// script/ui/uiGame/dcts/dcts_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowPlayerData: function ShowPlayerData(resultsList, playerAll, idx) {
		this.node.getChildByName("icon_win").active = false;
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = false;
		var data = resultsList[idx];
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = data["isOwner"];
		var userInfo = this.node.getChildByName("user_info");
		if (userInfo) {
			userInfo.getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
			userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
			for (var index in playerAll) {
				var player = playerAll[index];
				if (player.pid == data.pid) {
					userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
					break;
				}
			}
		}
		this.node.getChildByName("lb_win").getComponent(cc.Label).string = data.winCount || 0;
		this.node.getChildByName("lb_lose").getComponent(cc.Label).string = data.loseCount || 0;
		this.node.getChildByName("lb_count_gou").getComponent(cc.Label).string = data.jieGuoCount || '';
		if (data.point >= 0) {
			this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + data.point;
			this.node.getChildByName("lb_win_num").active = true;
			this.node.getChildByName("lb_lose_num").active = false;
		} else {
			this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = data.point;
			this.node.getChildByName("lb_win_num").active = false;
			this.node.getChildByName("lb_lose_num").active = true;
		}
		//比赛分
		if (typeof data.sportsPoint != "undefined") {
			this.node.getChildByName("lb_sportsPoint").active = true;
			if (data.sportsPoint > 0) {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + data.sportsPoint;
			} else {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = data.sportsPoint;
			}
		} else {
			this.node.getChildByName("lb_sportsPoint").active = false;
		}
		var maxPoint = 0;
		for (var i = 0; i < resultsList.length; i++) {
			var _data = resultsList[i];
			if (_data.point > maxPoint) {
				maxPoint = _data.point;
			}
		}
		//显示大赢家图标
		this.node.getChildByName("icon_win").active = data.point >= maxPoint;
		this.node.getChildByName("lb_shangCnt").getComponent(cc.Label).string = data.roomTotalShangNum;
		//显示总赏数、胜局数
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
        //# sourceMappingURL=dcts_detail_child.js.map
        