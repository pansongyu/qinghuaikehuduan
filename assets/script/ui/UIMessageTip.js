var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_info:cc.Label,


    },

    OnCreateInit: function () {
        this.SysNotifyManager = app.SysNotifyManager();

    },

    OnShow:function (msgID) {
        this.ShowLabelString(msgID);

    },
    ShowLabelString:function (msgID) {
        let desc = this.SysNotifyManager.GetSysMsgContentByMsgID(msgID);
        let reg = /\/n/g;
        desc = desc.replace(reg, "\n");
        reg = /\/t/g;
        desc = desc.replace(reg, "\t");
        this.lb_info.string = desc;
    },



    GetMsgWndSize:function(){
        return this.lb_info.node.getContentSize();
    },
    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){

    },

});