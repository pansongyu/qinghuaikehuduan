(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/fcgp/fcgp_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '56ae07r5FhB4oBE9tILWAU0', 'fcgp_winlost_child', __filename);
// script/ui/uiGame/fcgp/fcgp_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        icon_fct: cc.SpriteFrame,
        icon_ct: cc.SpriteFrame,
        icon_winlost: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        var point = player.point;

        //玩家分数
        var winNode = this.node.getChildByName("lb_win_num");
        var loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if (point > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        } else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }

        //比赛分
        var lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            } else {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        } else {
            lb_sportsPointTitle.active = false;
        }

        //剩余牌数
        this.node.getChildByName("lb_shengyu").active = true;
        var shengyu = this.node.getChildByName("lb_shengyu").getComponent(cc.Label);

        shengyu.string = player.shouCard.length;

        //炸弹分
        this.node.getChildByName("lb_bombsize").active = true;
        var bombsize = this.node.getChildByName("lb_bombsize").getComponent(cc.Label);

        bombsize.string = player.boomPoint;

        //头游
        this.node.getChildByName("img_touyou").active = player.endType == "ONE";

        //全关
        this.node.getChildByName("img_quanguan").active = player.quanGuangJiaBei > 1;

        // //显示春天或者反春天
        // let icon_robClose = this.node.getChildByName("icon_robClose");
        // icon_robClose.active = player.existChunTian;

        // if (player.robClose == -1) {
        //     icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
        // }else if (player.robClose == 1) {
        //     icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;    
        // }else{
        //     icon_robClose.active = false;
        // }


        var playerInfo = null;
        for (var i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                break;
            }
        }

        var head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        var playerName = "";
        playerName = playerInfo.name;
        if (playerName.length > 6) {
            playerName = playerName.substring(0, 6) + '...';
        }
        var name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        var id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
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
        //# sourceMappingURL=fcgp_winlost_child.js.map
        