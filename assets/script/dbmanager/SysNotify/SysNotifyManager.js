/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SysNotifyManager.js
 *  @todo: 系统通知模块
 *  
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *  
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *  
 */
var app = require('app');

/**
 * 类构造
 */
var SysNotifyManager = app.BaseClass.extend({
	
	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = "SysNotifyManager";
		
		this.SysDataManager = app.SysDataManager();
		this.NewSysMsg = this.SysDataManager.GetTableDict("NewSysMsg");

		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();

		//缓存的正则表达式字典
		this.regExpDict = {};

		app.NetManager().RegNetPack("S1010_SystemMessage", this.OnPack_ServerSysMsg, this);

		this.Log("create SysNotifyManager");
		
	},


	//-----------------------回调函数-----------------------------
	/**
	 * 接收封包
	 */
	OnPack_ServerSysMsg:function(serverPack){
		//系统提示码
		let msgID = serverPack.key;
		let argList = serverPack.p||[];

		let count = argList.length;
		let msgArgList = [];
		for(let index=0; index<count; index++){

			let data = argList[index];

			if(data["StringValue"]){
				msgArgList.push(data["StringValue"]);
			}
			else{
				msgArgList.push(data["IntValue"]);
			}
		}

		this.ShowSysMsg(msgID, msgArgList);

		app.Client.OnEvent("ServerSysMsg", {"MsgID":msgID, "MsgArgList":msgArgList});
	},

	//-----------------------获取函数-----------------------------

	//获取系统提示文本
	GetSysMsgContentByMsgID:function(msgID, paramList){

		if(!paramList){
			paramList = [];
		}
		//如果查找不到系统提示码,则为纯文本弹框提示直接播放不解码
		if(!this.NewSysMsg.hasOwnProperty(msgID)){
			this.SysLog("GetSysMsgContentByMsgID(%s) NewSysMsg.txt not find", msgID);
			return msgID;
		}
		let msgInfo = this.NewSysMsg[msgID];
		let msgContent = msgInfo['Content'];

		return this.TranslateMsgContent(msgContent, paramList);

	},

	/**
	 * 替换消息文本
	 * @param msgID 消息ID
	 * @return 无返回值
	 * @remarks 
	 */
	TranslateMsgContent:function(msgContent, paramList){

		let count = paramList.length;

		// 替换文本
		for(let index=0; index<=count; index++){

			let param = paramList[index];
			let argIndex = index + 1;
			let regExpObj = null;


			let regKeyString = this.ComTool.StringAddNumSuffix("S", argIndex, 1);
			if(msgContent.indexOf(regKeyString) != -1){

				if(this.regExpDict.hasOwnProperty(regKeyString)){
					regExpObj = this.regExpDict[regKeyString];
				}
				else{
					regExpObj = new RegExp("{" + regKeyString + "}", "g");
					this.regExpDict[regKeyString] = regExpObj
				}
				msgContent = msgContent.replace(regExpObj, param);
			}
		}

		return msgContent
	},
	
	/**
	 * 显示系统提示
	 * @param msgID
	 */
	ShowSysMsg:function(msgID, msgArgList=[], msgPos = 4){
		if (typeof(msgID) == "undefined") {
			console.log("弹窗提示内容为空");
			return;
		}
		this.Log("ShowSysMsg(%s):", msgID, msgArgList);

		let msgContent = "";
		//如果查找不到系统提示码,则为纯文本弹框提示直接播放不解码
		if(this.NewSysMsg.hasOwnProperty(msgID)){
			let msgInfo = this.NewSysMsg[msgID];
			msgPos = msgInfo["Pos"];

			msgContent = msgInfo['Content'];
			msgContent = this.TranslateMsgContent(msgContent, msgArgList);
		}
		else{
			// msgPos = 4;
			msgContent = msgID;
		}


		//出现位置 1系统广播(不允许主动调用这种类型,只能又聊天系统频道下发)
		if(msgPos == 1){
			this.ErrLog("ShowSysMsg(%s) error", msgID);
		}
		//只触发事件不显示提示,由事件自己决定(服务端下发客户端弹2次确认框等待点击)
		else if(msgPos == 2){

		}
		//浮动提示
		else if(msgPos == 3){
			app.FormManager().ShowForm("UIMessage_Drift", msgID, msgArgList, msgContent);
		}
		//"确定" 弹框提示
		else if(msgPos == 4){
			app.FormManager().ShowForm("UIMessage", "OnSys", this.ShareDefine.ConfirmOK, msgID, msgArgList, msgContent);

		}
		//"是","否"" 弹框提示
		else if(msgPos == 5){
			let ConfirmManager = app.ConfirmManager();
			ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
			ConfirmManager.ShowConfirm(this.ShareDefine.ConfirmYN, msgID, msgArgList)
		}
		else{
			this.ErrLog("ShowSysMsg(%s) msgPos(%s) error", msgID, msgPos);
		}
	},

    OnConFirm:function(clickType, msgID, backArgList){
    	if(clickType == "Sure"){
    		this.Log("打开客服QQ");
    	}
    },

})


var g_SysNotifyManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_SysNotifyManager)
		g_SysNotifyManager = new SysNotifyManager();
	return g_SysNotifyManager;
	
}
