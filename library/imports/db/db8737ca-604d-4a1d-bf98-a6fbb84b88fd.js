"use strict";
cc._RF.push(module, 'db873fKYE1KHb+Ypvu4S4j9', 'UIJoinClub');
// script/ui/club/UIJoinClub.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        numLabels: [cc.Label]
    },

    OnCreateInit: function OnCreateInit() {
        this.InitCommon();
        this.InitEvent();
    },
    InitCommon: function InitCommon() {
        this.labelString = [];
    },
    InitEvent: function InitEvent() {
        //基础网络包
        this.RegEvent("OnReqJoinNtf", this.Event_ReqJoinNtf);
    },

    Event_ReqJoinNtf: function Event_ReqJoinNtf(event) {
        var state = event.joinStatus;
        var notFind = app.ClubManager().Enum_JoinClub_NotFind;
        var clubFull = app.ClubManager().Enum_JoinClub_ClubFull;
        var numMax = app.ClubManager().Enum_JoinClub_NumMax;
        var inList = app.ClubManager().Enum_JoinClub_InList;
        var joinIng = app.ClubManager().Enum_JoinClub_JoinIng;
        var existClub = app.ClubManager().Enum_JoinClub_ExistClub;
        if (state == notFind) {
            this.ShowSysMsg("MSG_CLUB_JOIN_NotFind");
        } else if (state == clubFull) {
            this.ShowSysMsg("MSG_CLUB_JOIN_ClubFull");
        } else if (state == numMax) {
            this.ShowSysMsg("MSG_CLUB_JOIN_NumMax");
        } else if (state == inList) {
            this.ShowSysMsg("MSG_CLUB_JOIN_InList");
        } else if (state == joinIng) {
            this.ShowSysMsg("MSG_CLUB_JOIN_JoinIng");
            this.Click_btn_reset();
        } else if (state == existClub) {
            this.ShowSysMsg("MSG_CLUB_JOIN_ExistClub");
            this.Click_btn_reset();
        }
    },
    //--------------显示函数-----------------
    OnShow: function OnShow() {
        this.Click_btn_reset();
    },

    OnEventShow: function OnEventShow(event) {
        var argDict = event.detail;
        var bReConnect = argDict["bReConnect"];
    },
    OnEventHide: function OnEventHide(event) {},
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(type, msgID, []);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_Join' == btnName) {
            this.Click_btn_Join();
        } else if ('btn_return' == btnName) {
            this.Click_btn_return();
        } else if ('btn_reset' == btnName) {
            this.Click_btn_reset();
        } else if ('btn_clear' == btnName) {
            this.Click_btn_clear();
        } else if (btnName.startsWith('btn_num')) {
            var str = btnName.substring(btnName.length - 1);
            this.Click_btn_Num(str);
        }
    },
    Click_btn_Join: function Click_btn_Join() {
        if (6 != this.labelString.length) {
            app.SysNotifyManager().ShowSysMsg('MSG_CLUB_JOIN_NotFind');
            return;
        }
        var str = this.labelString.join('');
        var clubId = parseInt(str);
        app.ClubManager().SendReqJoinClub(clubId);
        this.CloseForm();
    },
    Click_btn_return: function Click_btn_return() {
        this.CloseForm();
    },
    Click_btn_reset: function Click_btn_reset() {
        for (var i = 0; i < this.numLabels.length; i++) {
            this.numLabels[i].string = '';
        }this.labelString = [];
    },
    Click_btn_clear: function Click_btn_clear() {
        if (0 == this.labelString.length) {
            return;
        }
        this.numLabels[this.labelString.length - 1].string = '';
        this.labelString.pop();
    },
    Click_btn_Num: function Click_btn_Num(str) {
        if (6 <= this.labelString.length) return;

        this.labelString.push(str);
        this.numLabels[this.labelString.length - 1].string = str;
    },

    OnClose: function OnClose() {}
});

cc._RF.pop();