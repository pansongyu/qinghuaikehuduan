/*
 BaseChildForm 子界面基类(又界面控制创建和销毁,一般是BaseForm的子界面,或者BaseChildForm的子界面(可以无限嵌套下去))
 */

var app = require("app");


var BaseChildForm = cc.Class({

	extends: require("BaseForm"),

	properties: {
		frontNode:cc.Node,
		backNode:cc.Node,
        deviation:0,
	},

	OnCreate:function(parent, childComponentName, index, userData, pos=null){
		this.JS_Name = [childComponentName, index].join("_");

		this.Parent = parent;

		//界面数据
		this._dataInfo = {
			"FormName":childComponentName,
			"UserData":userData,
			"ChildIndex":index,
		};

		//注册父类事件分发
		this.parentEventFuncDict = {};

		this.InitBaseData();

		this.OnCreateInit();

		this.ShowFormName();

		if(pos){
			this.node.setPosition(pos);
		}

        this.initClickX = 0;

		this.InitScrollEffect();

    },

	//------------回掉函数----------------

	//被对象池回收
	unuse: function () {
		this.node.stopAllActions();
		this.DeleteFormAllEffect();
		this.ClearFormAllChildComponent();
	},

	//对象池释放复用
	reuse: function () {
		this.node.active = true;
	},

	// 加载创建界面
	OnLoad: function () {

	},

	//销毁界面
	Destroy:function(){

		this.OnDestroy();
		//销毁节点
		this.node.destroy();
	},


	//显示界面
	ShowForm:function(...argList){
		try {
			this.node.active = true;
			this.OnShow.apply(this, argList);
		}
		catch(error){
			this.ErrLog("ShowForm:%s", error.stack);
		}

	},

	//关闭界面
	CloseForm:function(){
		this.node.active = false;
		this.OnClose();
	},

	//开启或者关闭界面
	ShowOrCloseForm:function(){
		this.ErrLog("ShowOrCloseForm cant call")
	},

	//响应父类事件
	OnParentEvent:function(eventName, argDict){
		let parentEventFunc = this.parentEventFuncDict[eventName];
		if(!parentEventFunc){
			this.Log("OnParentEvent(%s) not parentEventFunc", eventName);
			return;
		}
		parentEventFunc.apply(this, [argDict]);
	},

	//--------------获取接口-----------------
	//界面是否显示中
	IsFormShow:function(){
		this.ErrLog("IsFormShow cant call")
	},

	//-------------获取接口-------------------
	//获取界面父类
	GetParent:function(){
		return this.Parent;
	},

	//-------------滑动出现删除控件效果-----------------
	InitScrollEffect:function () {
		if(this.frontNode){
            this.frontNode.on("touchmove", this.OnFront_TouchMove, this);
            this.frontNode.on("touchstart", this.OnFront_TouchStart, this);
            this.frontNode.on("touchend", this.OnFront_TouchEnd, this);
            this.frontNode.on("touchcancel", this.OnFront_TouchCancel, this);
		}
    },
	OnFront_TouchEnd:function (event) {
        // let MoveNodeParent = this.frontNode.parent;
        // let MoveNodeWorldPositionX = MoveNodeParent.parent.convertToWorldSpaceAR(MoveNodeParent.getPosition()).x + MoveNodeParent.width/2;
        // let DeleteBtnNodeWorldPositionX = this.backNode.parent.convertToWorldSpaceAR(this.backNode.getPosition()).x;
		// this.Log(MoveNodeWorldPositionX, DeleteBtnNodeWorldPositionX);
    },
	OnFront_TouchCancel:function () {

    },
	OnFront_TouchStart:function (event) {
        let width = cc.director.getWinSize().width / 2;
		let ClickPositionX = event.getLocationX() - width;
		let frontPosition = this.frontNode.getPositionX();
        this.DistanceX = ClickPositionX - frontPosition;
    },
	OnFront_TouchMove:function (event) {
		if(!this.backNode){
			this.ErrLog("OnFront_TouchMove not find backNode %s", this.backNode);
			return;
		}
		if(!this.DistanceX){
			this.ErrLog("OnFront_TouchMove not find initClickX %s", this.initClickX);
			return;
		}
        let width = cc.director.getWinSize().width / 2;
        let touchPosX = event.getLocation().x - width;
        let nodeX = touchPosX - this.DistanceX ;
        if(nodeX >= 0){
            nodeX = 0;
        }
        let deviation = this.backNode.width+this.deviation;
        if(nodeX <= -deviation){
            nodeX = -deviation;
        }
		this.frontNode.setPositionX(nodeX);
    },
	//------------快捷功能函数-------------

	//注冊事件函数
	RegEvent:function(eventName, func){
		this.ErrLog("RegEvent cant call")
	},

	/**
	 * 注册父类相应事件回调函数
	 */
	RegParentEvent:function(event, func){
		this.parentEventFuncDict[event] = func;
	},

	//-------------点击函数-------------
	//关闭界面
	OnClick_Close:function(){
		this.ErrLog("OnClick_Close cant call")
	},
	//--------------子类重载接口---------------

	//每次显示界面被调用
	OnShow:function(){
	},


});

module.exports = BaseChildForm;


