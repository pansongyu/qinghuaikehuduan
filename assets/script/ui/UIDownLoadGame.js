var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
    extends: require("BaseForm"),

    properties: {
        bgNode:cc.Sprite,
        lb_gameName:cc.Label,
        downLoadProgressBar:cc.ProgressBar,
        lb_progress:cc.Label,
        imgBgMajiang:cc.SpriteFrame,
        imgBgPoker:cc.SpriteFrame,
        btn_exit:cc.Node,
        btn_cancle:cc.Node,
        btn_downloadGame:cc.Node,
        btn_updateGame:cc.Node,
        btn_enterGame:cc.Node,
    },

    OnCreateInit: function () {
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.selectGameName = "";
        this.isDownLoading = false;
    },

    OnShow: function (gameName, roomKey = 0, createRoomSendPack = null, playBackCode = 0, practiceId = 0, isEnterGame = false, clubId = 0, unionData = null, haveEnterFunction = null,isChangeRoom=false,password="",existQuickJoin=false) {
        if (gameName == "sss_zz" || gameName == "sss_dr") {
            gameName = "sss";
        }
        console.log("downloadSubgame Name === " + gameName);
        this.selectGameName = gameName;
        this.selectRoomKey = roomKey;
        this.createRoomSendPack = createRoomSendPack;
        this.playBackCode = playBackCode;
        this.practiceId = practiceId;
        this.isEnterGame = isEnterGame;
        this.haveEnterFunction = haveEnterFunction;
        this.clubId = clubId;
        this.password=password;
        this.existQuickJoin=existQuickJoin;
        this.unionData = unionData;
        this.isChangeRoom=isChangeRoom;
        let gametypeNum = app.ShareDefine().GametTypeNameDict[gameName.toUpperCase()];
        let gametypeData = this.gametypeConfig[gametypeNum];
        if (!gametypeData) {
            console.log("配表找不到游戏ID："+gametypeNum);
            return;
        }
        if (gametypeData.Type == 1) {
            //麻将
            this.bgNode.spriteFrame = this.imgBgMajiang;
        }else{
            //扑克
            this.bgNode.spriteFrame = this.imgBgPoker;
        }
        let appName=this.GetAppName();
        if(appName=="baodao" && (gameName=="nn" || gameName=="fqpls")){
            if(gameName=="nn"){
                this.lb_gameName.string = "妞妞";
            }else{
                this.lb_gameName.string = "十三支";
            }
        }else{
            this.lb_gameName.string = gametypeData.Name_1;
        }
        



        this.downLoadProgressBar.progress = 0;
        this.lb_progress.string = "";
        this.btn_exit.active = false;
        this.btn_cancle.active = false;
        this.btn_downloadGame.active = false;
        this.btn_updateGame.active = false;
        this.btn_enterGame.active = false;
        if(!cc.sys.isNative){
            this.btn_exit.active = true;
            return;
        }
        let that = this;
        //判断子游戏有没有下载
        if (SubgameManager.isSubgameDownLoad(gameName)) {
            //已下载，判断是否需要更新
            SubgameManager.needUpdateSubgame(gameName, (success) => {
                if (success) {
                    //子游戏需要更新;
                    console.log("子游戏需要更新");
                    that.btn_exit.active = false;
                    that.btn_cancle.active = true;
                    that.btn_downloadGame.active = false;
                    that.btn_updateGame.active = true;
                    that.btn_enterGame.active = false;
                } else {
                    //子游戏不需要更新;
                    console.log("子游戏不需要更新");
                    that.lb_progress.string = "无需更新，直接进入游戏...";
                    that.btn_exit.active = false;
                    that.btn_cancle.active = false;
                    that.btn_downloadGame.active = false;
                    that.btn_updateGame.active = false;
                    that.btn_enterGame.active = false;
                    if (that.isEnterGame) {
                        app.Client.EnterSubGame(that.selectGameName,null,that.selectRoomKey);
                        that.CloseForm();
                    }else{
                        app.Client.OnEvent('OnUpdateGameEnd', {});
                        app.SysNotifyManager().ShowSysMsg("游戏更新完成", [], 3);
                        let clubDataTemp = null;
                        if (that.clubId > 0) {
                            clubDataTemp = {};
                            clubDataTemp.clubId = that.clubId;
                            clubDataTemp.password = that.password;
                            clubDataTemp.existQuickJoin = that.existQuickJoin;
                            clubDataTemp.roomKey = '0';
                            clubDataTemp.gameIndex = 0;//用来判断保存还是创建
                            clubDataTemp.enableGameType = '';//不禁用的按钮
                        }
                        app.FormManager().CloseForm('UIMoreGame');
                        app.FormManager().CloseForm('UITop');
                        app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UIMoreGame");
                        app.FormManager().ShowForm('UICreatRoom',{"gameList":app.Client.GetAllGameId()},gameName,clubDataTemp,that.unionData);
                        that.CloseForm();
                    }
                    
                }
            }, () => {
                console.log("子游戏更新失败");
                //下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
                that.btn_exit.active = false;
                that.btn_cancle.active = false;
                that.btn_downloadGame.active = false;
                that.btn_updateGame.active = false;
                that.btn_enterGame.active = false;
                that.lb_progress.string = "子游戏更新失败，直接进入游戏...";
                that.btn_exit.active = false;
                that.btn_cancle.active = false;
                that.btn_downloadGame.active = false;
                that.btn_updateGame.active = false;
                that.btn_enterGame.active = false;
                if (that.isEnterGame) {
                    app.Client.EnterSubGame(that.selectGameName,null,that.selectRoomKey);
                }else{
                    app.Client.OnEvent('OnUpdateGameEnd', {});
                    app.SysNotifyManager().ShowSysMsg("子游戏更新失败...", [], 3);
                    let clubDataTemp = null;
                    if (that.clubId > 0) {
                        clubDataTemp = {};
                        clubDataTemp.clubId = that.clubId;
                        clubDataTemp.password = that.password;
                        clubDataTemp.roomKey = '0';
                        clubDataTemp.gameIndex = 0;//用来判断保存还是创建
                        clubDataTemp.enableGameType = '';//不禁用的按钮
                    }
                    app.FormManager().CloseForm('UIMoreGame');
                    app.FormManager().CloseForm('UITop');
                    app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UIMoreGame");
                    app.FormManager().ShowForm('UICreatRoom',{"gameList":app.Client.GetAllGameId()},gameName,clubDataTemp,that.unionData);
                    that.CloseForm();
                }
            });
        }else{
            //未下载
            console.log("子游戏未下载");
            this.btn_exit.active = true;
            this.btn_cancle.active = false;
            this.btn_downloadGame.active = true;
            this.btn_updateGame.active = false;
            this.btn_enterGame.active = false;
        }
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if (this.isDownLoading) {
                this.ShowSysMsg("正在下载游戏...");
                return;
            }
        if(btnName == "btn_exit"){
            this.CloseForm();
        }
        else if (btnName == "btn_cancle"){
            this.CloseForm();
        }
        else if (btnName == "btn_downloadGame" || btnName == "btn_updateGame"){
            this.CheckGameDown();
            //this.DownloadSubgame(this.selectGameName, btnNode);
        }
        else if (btnName == "btn_enterGame"){
            app.Client.EnterSubGame(this.selectGameName,null,that.selectRoomKey);
        }
        else{
            this.ErrLog("OnClick(%s) not find",btnName);
        }
    },
    /*
    * 检测子游戏是否可以下载
    */
    CheckGameDown:function(){
        if (!SubgameManager.UIRLFILE_root || SubgameManager.UIRLFILE_root.length < 2) {
            SubgameManager.UIRLFILE_root = app.Client.GetClientConfigProperty("UpdateGame")
        }
        let checkUrl= SubgameManager.UIRLFILE_root + this.selectGameName+"/remote-assets/version.manifest";
        console.log("检查子游戏下载地址: " + checkUrl);
        let file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') +'hall/checkdown.manifest';
        this.downFile2Local(checkUrl,file);
    },

    downFile2Local:function(url, fileName){
        let self=this;
        var downloader = new jsb.Downloader();
        downloader.setOnFileTaskSuccess(function(){
            console.log("downFile2Local: version.manifest  is down success");    
            self.DownloadSubgame(self.selectGameName,{});
        });
        downloader.setOnTaskError(function(){ 
            app.SysNotifyManager().ShowSysMsg("更新文件获取失败，检查您的手机网络，稍后重试");
        });
        downloader.createDownloadFileTask(url, fileName);//创建下载任务
    },

    DownloadSubgame:function(name,btnNode){
        this.btn_exit.active = false;
        this.btn_cancle.active = false;
        this.btn_downloadGame.active = false;
        this.btn_updateGame.active = false;
        this.btn_enterGame.active = false;
        //下载子游戏/更新子游戏
        if(!cc.sys.isNative) return;
        let that = this;
        SubgameManager.downloadSubgame(name, (progress,downloadedBytes,totalBytes) => {
            if (isNaN(progress)) {
                progress = 0;
            }
            that.isDownLoading = true;
            that.downLoadProgressBar.progress = progress;
            console.log("downloadedBytes == " + downloadedBytes + ",totalBytes == " + totalBytes);
            if (downloadedBytes > 0 && (downloadedBytes + 1000) >= totalBytes) {
                console.log("资源下载完成");
                that.lb_progress.string = "游戏正在安装，请稍后";
            }else{
                that.lb_progress.string = "下载中 " + parseInt(progress * 100) + "%";
            }
        }, function(success) {
            that.isDownLoading = false;
            if (success) {
                that.downLoadProgressBar.progress = 1;
                that.lb_progress.string = "下载完成";
                let curGameList = app.Client.GetAllGameId();
                let argDict = {
                    "gameList":curGameList,
                };
                app.Client.OnEvent("ShowGameListByLocation", argDict);
                that.EnterSubGameByType(name);
            } else {
                console.log('下载失败');
                app.SysNotifyManager().ShowSysMsg("下载游戏失败...", [], 3);
                that.btn_exit.active = true;
                that.btn_cancle.active = false;
                that.btn_downloadGame.active = true;
                that.btn_updateGame.active = false;
                that.btn_enterGame.active = false;
                //下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
                if (SubgameManager.isSubgameDownLoad(that.selectGameName)) {
                    that.EnterSubGameByType(name);
                }
            }
        });
    },
    EnterSubGameByType:function(name){
        let that = this;
        if (that.practiceId != 0) {
            that.btn_exit.active = false;
            that.btn_downloadGame.active = false;
            that.btn_updateGame.active = false;
            that.btn_enterGame.active = false;
            app.NetManager().SendPack("room.CBaseGoldRoom", {"practiceId":that.practiceId}, function(event){
                that.CloseForm();
                let gameType = event.gameType;
                name = app.ShareDefine().GametTypeID2PinYin[gameType];
                app.Client.EnterSubGame(name,null,that.selectRoomKey);
            }, function(event){
                console.log("进入房间失败...");
                that.CloseForm();
            });
            return;
        }
        if (that.selectRoomKey != 0) {
            that.btn_exit.active = false;
            that.btn_downloadGame.active = false;
            that.btn_updateGame.active = false;
            that.btn_enterGame.active = false;
            if(that.haveEnterFunction){
                that.CloseForm();
                that.haveEnterFunction();
                return;
            }
            if(this.isChangeRoom==false){
                app.NetManager().SendPack("room.CBaseEnterRoom", {"roomKey":that.selectRoomKey,"posID":-1,"clubId":that.clubId,"password":that.password,"existQuickJoin":that.existQuickJoin}, function(event){
                    that.CloseForm();
                    //app.SysNotifyManager().ShowSysMsg("加入房间成功", [], 3);
                }, function(event){
                    console.log("进入房间失败...");
                    that.CloseForm();
                });
            }else{
                app.NetManager().SendPack("room.CBaseChangeRoom", {"roomKey":that.selectRoomKey,"posID":-1,"clubId":that.clubId,"password":that.password,"existQuickJoin":that.existQuickJoin}, function(event){
                    that.CloseForm();
                }, function(event){
                    console.log("进入房间失败...");
                    that.CloseForm();
                });
            }
            return;
        }
        if (that.playBackCode != 0) {
            that.CloseForm();
            that.btn_exit.active = false;
            that.btn_enterGame.active = false;
            let videoData = {action:"showVideo", backCode:that.playBackCode};
            app.Client.EnterSubGame(name, videoData);
            return;
        }
        if (that.createRoomSendPack != null) {
            that.btn_exit.active = false;
            that.btn_downloadGame.active = false;
            that.btn_updateGame.active = false;
            that.btn_enterGame.active = false;
            if (that.createRoomSendPack.clubId && that.createRoomSendPack.clubId != 0) {
                app.NetManager().SendPack("club.CClubCreateRoom", that.createRoomSendPack, function(event){
                    console.log("创建房间成功");
                }, function(event){
                    console.log("创建房间失败");
                });
                that.CloseForm();
            }else{
                app.NetManager().SendPack("room.CBaseCreateRoom", that.createRoomSendPack, function(event){
                    that.CloseForm();
                }, function(event){
                    that.CloseForm();
                });
            }
            return;
        }
        if (that.isEnterGame) {
            app.Client.EnterSubGame(that.selectGameName,null,that.selectRoomKey);
            return;
        }else{
            app.Client.OnEvent('OnUpdateGameEnd', {});
            app.SysNotifyManager().ShowSysMsg("游戏更新完成", [], 3);
            let clubDataTemp = null;
            if (that.clubId > 0) {
                clubDataTemp = {};
                clubDataTemp.clubId = that.clubId;
                clubDataTemp.roomKey = '0';
                clubDataTemp.gameIndex = 0;//用来判断保存还是创建
                clubDataTemp.enableGameType = '';//不禁用的按钮
            }
            app.FormManager().CloseForm('UIMoreGame');
            app.FormManager().CloseForm('UITop');
            app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UIMoreGame");
            app.FormManager().ShowForm('UICreatRoom',{"gameList":app.Client.GetAllGameId()},name,clubDataTemp,that.unionData);
            that.CloseForm();
            return;
        }
    },
	Click_Btn_EnterGame:function () {
        let msgID = "MSG_Enter_GAME";
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, []);
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if(msgID == "MSG_Enter_GAME"){
            
        }
        else if("MSG_EXIT_GAME")
            cc.game.end();
    },
});