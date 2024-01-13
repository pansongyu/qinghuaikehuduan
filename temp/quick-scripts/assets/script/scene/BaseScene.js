(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/BaseScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '988f3gR69dG+JhS8n3UPT9U', 'BaseScene', __filename);
// script/scene/BaseScene.js

"use strict";

/*
    场景基类接口
*/
var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		BackgroundLayer: cc.Prefab,
		SceneEffectLayer: cc.Prefab,
		UILayer: cc.Prefab,
		GuideLayer: cc.Prefab,
		TopLayer: cc.Prefab
	},

	//--------------回掉函数----------------
	// 加载创建
	OnLoad: function OnLoad() {

		var SceneManager = app.SceneManager();
		this.LocalDataManager = app.LocalDataManager();
		//获取当前的地图ID
		var sceneType = SceneManager.GetSceneType();
		this.sceneType = sceneType;
		this.JS_Name = sceneType;

		this.SoundManager = app.SoundManager();
		this.SysDataManager = app.SysDataManager();
		this.ShareDefine = app.ShareDefine();

		this.SceneInfo = this.SysDataManager.GetTableDict("SceneInfo");

		this.LayerLv_Background = 0;
		this.LayerLv_ModelShadow = 1;
		this.LayerLv_Model = 2;
		this.LayerLv_ModelHP = 3;
		this.LayerLv_SceneEffect = 4;
		this.LayerLv_UI = 5;
		this.LayerLv_Guide = 6;
		this.LayerLv_Top = 7;
		this.LayerLv_Debug = 8;

		this.node.on("touchstart", this.OnTouchStart, this);
		this.node.on("touchmove", this.OnTouchMove, this);
		this.node.on("touchend", this.OnTouchEnd, this);
		this.node.on("touchcancel", this.OnTouchCancel, this);

		this.node.on("SpriteModelMoveToEnd", this.OnSpriteModelMoveToEnd, this);
		this.node.on("SpriteModelBeHitEnd", this.OnSpriteModelBeHitEnd, this);

		//--------------创建场景层--------------
		this.InitLayer();

		this.ShowMap();

		this.OnCreate();
	},

	//初始化场景层相关
	InitLayer: function InitLayer() {

		this.BackgroundLayerComponent = null;
		this.SceneEffectLayerNodeComponent = null;
		this.TopLayerNodeComponent = null;
		this.GuideLayerNodeComponent = null;

		this.ModelShadowLayerNode = null;
		this.ModelLayerNode = null;
		this.ModelHPLayerNode = null;

		this.UILayerNode = null;

		//-----------可选层---------------
		//需要显示场景背景是创建的层
		if (this.BackgroundLayer) {
			var backgroundLayerNode = cc.instantiate(this.BackgroundLayer);
			this.node.addChild(backgroundLayerNode, this.LayerLv_Background);
			this.BackgroundLayerComponent = backgroundLayerNode.getComponent("BackgroundLayer");
			this.BackgroundLayerComponent.OnCreate(this.sceneType);
		}

		//需要创建场景模型是才需要的层 如果存在ModelLayer 如果不需要显示阴影和HP允许ModelShadowLayer，ModelHPLayer不存在
		if (this.ModelLayer) {
			this.ModelLayerNode = cc.instantiate(this.ModelLayer);
			this.node.addChild(this.ModelLayerNode, this.LayerLv_Model);
			this.ModelLayerNode.getComponent("ModelLayer").OnCreate(this.sceneType);
		}

		if (this.ModelShadowLayer) {
			this.ModelShadowLayerNode = cc.instantiate(this.ModelShadowLayer);
			this.node.addChild(this.ModelShadowLayerNode, this.LayerLv_ModelShadow);
			this.ModelShadowLayerNode.getComponent("ModelShadowLayer").OnCreate(this.sceneType);
		}

		if (this.ModelHPLayer) {
			this.ModelHPLayerNode = cc.instantiate(this.ModelHPLayer);
			this.node.addChild(this.ModelHPLayerNode, this.LayerLv_ModelHP);
			this.ModelHPLayerNode.getComponent("ModelHPLayer").OnCreate(this.sceneType);
		}

		//需要播放场景特效是创建的层
		if (this.SceneEffectLayer) {
			var sceneEffectLayerNode = cc.instantiate(this.SceneEffectLayer);
			this.node.addChild(sceneEffectLayerNode, this.LayerLv_SceneEffect);
			this.SceneEffectLayerNodeComponent = sceneEffectLayerNode.getComponent("SceneEffectLayer");
			this.SceneEffectLayerNodeComponent.OnCreate(this.sceneType);
		}

		//新手引导层
		if (this.GuideLayer) {
			var guideLayerNode = cc.instantiate(this.GuideLayer);
			this.node.addChild(guideLayerNode, this.LayerLv_Guide);
			this.GuideLayerNodeComponent = guideLayerNode.getComponent("GuideLayer");
			this.GuideLayerNodeComponent.OnCreate(this.sceneType);
		}

		//----------以下是必须存在的层-----------------

		//场景UI层
		if (this.UILayer) {
			this.UILayerNode = cc.instantiate(this.UILayer);
			this.node.addChild(this.UILayerNode, this.LayerLv_UI);
			this.UILayerNode.getComponent("UILayer").OnCreate(this.sceneType);
		} else {
			this.ErrLog("InitLayer not find UILayer");
		}

		//置顶模态层
		if (this.TopLayer) {
			var topLayerNode = cc.instantiate(this.TopLayer);
			this.node.addChild(topLayerNode, this.LayerLv_Top);
			this.TopLayerNodeComponent = topLayerNode.getComponent("TopLayer");
			this.TopLayerNodeComponent.OnCreate(this.sceneType);
		} else {
			this.ErrLog("InitLayer not find TopLayer");
		}

		this.debugModel = null;
		var debugModel = app.Client.GetDebugModel();
		if (debugModel) {
			this.node.addChild(debugModel.node, this.LayerLv_Top);
			this.debugModel = debugModel;
		}
	},

	//-------------点击事件--------------
	OnTouchStart: function OnTouchStart(event) {},

	OnTouchMove: function OnTouchMove(event) {},

	OnTouchEnd: function OnTouchEnd(event) {},

	OnTouchCancel: function OnTouchCancel(event) {},

	//场景模型移动结束回掉
	OnSpriteModelMoveToEnd: function OnSpriteModelMoveToEnd(event) {},

	//模型被击移动结束
	OnSpriteModelBeHitEnd: function OnSpriteModelBeHitEnd(event) {},

	//每帧回掉
	update: function update(dt) {
		try {
			var nowTick = Date.now();
			if (this.GuideLayerNodeComponent) {
				this.GuideLayerNodeComponent.OnUpdate(nowTick);
			}

			if (this.debugModel) {
				this.debugModel.OnUpdate(dt);
			}

			this.TopLayerNodeComponent.OnUpdate(nowTick);

			this.OnUpdate(dt);
		} catch (error) {
			this.ErrLog("update：%s", error.stack);
		}
	},

	//100毫秒毁掉
	OnBaseTimer: function OnBaseTimer(passSecond) {
		this.OnTimer(passSecond);
	},

	//场景准备退出前
	OnBeforeExitScene: function OnBeforeExitScene() {

		if (this.SceneEffectLayerNodeComponent) {
			this.SceneEffectLayerNodeComponent.OnBeforeExitScene();
		}

		//退出场景移除debug
		if (this.debugModel) {
			this.node.removeChild(this.debugModel.node);
			this.debugModel = null;
		}

		this.TopLayerNodeComponent.OnBeforeExitScene();

		if (this.GuideLayerNodeComponent) {
			this.GuideLayerNodeComponent.OnBeforeExitScene();
		}
	},

	//进入场景
	OnSwithSceneEnd: function OnSwithSceneEnd() {},

	//显示动态设置的默认界面
	OnShowDefaultForm: function OnShowDefaultForm() {},

	//应用切入后台
	OnEventHide: function OnEventHide() {},

	//应用显示
	OnEventShow: function OnEventShow() {},

	//-----------置顶模态层--------------
	//显示顶层特效
	OnTopEvent: function OnTopEvent(eventType) {
		this.TopLayerNodeComponent.OnTopEvent(eventType);
	},

	//--------------新手引导-------------------

	//显示新手引导控件
	ShowHelp: function ShowHelp(eventID, eventNode) {
		if (!this.GuideLayerNodeComponent) {
			this.ErrLog("ShowHelp(%s) error", eventID);
			return;
		}
		this.GuideLayerNodeComponent.ShowHelp(eventID, eventNode);
	},

	//--------------操作函数------------------
	//显示地图背景图
	ShowMap: function ShowMap() {
		// let mapID = app.SceneManager().GetMapID();
		// if(!mapID){
		//  return
		// }
		// if(!this.BackgroundLayerComponent){
		//  this.ErrLog("ShowMap not find BackgroundLayerComponent");
		//  return
		// }
		// this.BackgroundLayerComponent.ShowMap(mapID);
	},

	//场景震动
	OnShakeScene: function OnShakeScene() {
		var rightDeltaPos = cc.v2(6, 0);
		var leftDeltaPos = cc.v2(-6, 0);

		var action = cc.sequence(cc.moveBy(0.025, cc.v2(3, 0)), cc.moveBy(0.025, leftDeltaPos), cc.moveBy(0.025, rightDeltaPos), cc.moveBy(0.025, cc.v2(-3, 0)));

		this.UILayerNode.runAction(action);

		if (this.BackgroundLayerComponent) {
			var cloneAction = action.clone();
			this.BackgroundLayerComponent.node.runAction(cloneAction);
		}
	},

	//--------------模型相关-----------------

	//创建场景精灵模型
	CreateSceneSpriteModel: function CreateSceneSpriteModel(modelName, imageName, modelRes, pos) {
		var userData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var isShowHead = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
		var isShowShadow = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
		var zOrlderLv = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
	},

	//创建界面精灵模型
	CreateSceneSpriteModelByImagePath: function CreateSceneSpriteModelByImagePath(modelName, imagePath, modelRes, pos) {
		var userData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var isShowHead = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
		var isShowShadow = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
		var zOrlderLv = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
		var fileNameList = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
	},

	//创建模型完成回调
	OnCreateSceneSpriteModelEnd: function OnCreateSceneSpriteModelEnd(modelName, imageName, modelRes, userData, pos, modelComponent, zOrlderLv) {},

	DeleteSceneSpriteModel: function DeleteSceneSpriteModel(modelName) {},

	//获取模型父类
	GetModelParent: function GetModelParent(imageName, modelRes, userData) {

		if (!this.ModelLayerNode) {
			this.ErrLog("GetModelParent(%s) not ModelLayerNode", imageName);
			return;
		}
		//如果创建的是没有贴图的模型
		//TODO:模型预制自身包含图片 需要获取图片名字创建一个父类
		if (!imageName) {
			return this.ModelLayerNode;
		}

		var parent = this.ModelLayerNode.getChildByName(imageName);
		if (!parent) {
			this.Log("创建模型父类(%s)", imageName);
			parent = new cc.Node(imageName);
			this.ModelLayerNode.addChild(parent);
		}

		return parent;
	},

	//---------------特效相关---------------------

	//创建场景特效
	AddSceneEffect: function AddSceneEffect(effectName, effectRes) {
		var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var userData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		return this.SceneEffectLayerNodeComponent.AddSceneEffect(effectName, effectRes, repeatCount, userData);
	},

	DeleteSceneEffect: function DeleteSceneEffect(modelComponent) {
		this.SceneEffectLayerNodeComponent.DeleteSceneEffect(modelComponent);
	},

	//--------------子类重载-----------------
	OnCreate: function OnCreate() {},

	//每帧回掉
	OnUpdate: function OnUpdate(dt) {},

	OnTimer: function OnTimer(passSecond) {},
	//切换账号
	OnReload: function OnReload() {}
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
        //# sourceMappingURL=BaseScene.js.map
        