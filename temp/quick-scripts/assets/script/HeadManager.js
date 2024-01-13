(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/HeadManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c9d8fbDGGtAxKkiyEpR3QFz', 'HeadManager', __filename);
// script/HeadManager.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoom.js
 *  @todo: 房间
 *
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
var HeadManager = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init: function Init() {
        this.JS_Name = "HeadManager";

        this.OnReload();

        this.Log("Init");
    },

    OnReload: function OnReload() {
        this.headInfos = [];
        var MaxPlayerNum = app.ShareDefine().MaxPlayerNum;
        for (var i = 0; i < MaxPlayerNum; i++) {
            this.headInfos.push(null);
        }
    },
    SetHeadInfo: function SetHeadInfo(pos, headNode) {
        var MaxPlayerNum = app.ShareDefine().MaxPlayerNum;
        if (pos >= MaxPlayerNum || pos < 0) return;

        this.headInfos[pos] = headNode;
    },
    GetComponentByPos: function GetComponentByPos(pos) {
        var MaxPlayerNum = app.ShareDefine().MaxPlayerNum;
        if (pos >= MaxPlayerNum || pos < 0) return null;

        var component = this.headInfos[pos].getComponent('UIPublicHead');
        if (component) return component;
        return null;
    },
    GetAllHeadInfo: function GetAllHeadInfo() {
        return this.headInfos;
    }
    //-----------------------回调函数-----------------------------

});

var g_HeadManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_HeadManager) g_HeadManager = new HeadManager();
    return g_HeadManager;
};

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
        //# sourceMappingURL=HeadManager.js.map
        