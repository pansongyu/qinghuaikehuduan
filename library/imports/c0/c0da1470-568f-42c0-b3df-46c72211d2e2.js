"use strict";
cc._RF.push(module, 'c0da1RwVo9CwLPfRsciEdLi', 'UIShareImg');
// script/ui/UIShareImg.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        touxiang: cc.Node,
        erweima: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.SDKManager = app.SDKManager();
        this.WeChatHeadImage = this.touxiang.getChildByName('head_img').getComponent("WeChatHeadImage");
    },
    OnShow: function OnShow() {
        var heroName = app.HeroManager().GetHeroProperty("name");
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var cityId = app.HeroManager().GetHeroProperty("cityId");
        var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");

        var shareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;;
        var imgUrl = "http://fb.qicaiqh.com/makeQRcode.php?url=" + shareUrl;
        var that = this;

        cc.loader.load({ url: imgUrl, type: 'png' }, function (err, texture) {
            if (texture instanceof cc.Texture2D) {
                var frame = new cc.SpriteFrame(texture);
                that.erweima.getComponent(cc.Sprite).spriteFrame = frame;
            } else {
                that.ErrLog("texture not Texture2D");
            }
        });

        this.touxiang.getChildByName('lb_name').getComponent(cc.Label).string = heroName;
        this.WeChatHeadImage.OnLoad();
        this.WeChatHeadImage.ShowHeroHead(heroID);
        this.scheduleOnce(this.ShareScreen, 1);
    },
    ShareScreen: function ShareScreen() {
        this.SDKManager.ShareScreen('1');
        this.scheduleOnce(this.CloseForm, 3.5);
    }
});

cc._RF.pop();