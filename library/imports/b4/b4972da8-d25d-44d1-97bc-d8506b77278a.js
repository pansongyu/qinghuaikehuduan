"use strict";
cc._RF.push(module, 'b49722o0l1E0Ze82FBrdyeK', 'zpmjChildCreateRoom');
// script/ui/uiGame/zpmj/zpmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    OnShow: function OnShow() {
        this.zpmjToggleIndex = -1;
    },
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var taishusuanfa = this.GetIdxByKey('taishusuanfa');
        var suanfenfangsi = this.GetIdxByKey('suanfenfangsi');
        var zhangfenshezhi = this.GetIdxByKey('zhangfenshezhi');
        var angangfenshu = this.GetIdxByKey('angangfenshu');
        var zhuahua = this.GetIdxByKey("zhuahua");
        var jiesan = this.GetIdxByKey('jiesan');
        var xianShi = this.GetIdxByKey('xianShi');
        // let fangjian=[];
        var kexuanwanfa = [];
        var gaoji = [];
        // for(let i=0;i<this.Toggles['fangjian'].length;i++){
        //     if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
        //         fangjian.push(i);
        //     }
        // }
        for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
            }
        }
        sendPack = {
            "taishusuanfa": taishusuanfa,
            "suanfenfangsi": suanfenfangsi,
            "zhangfenshezhi": zhangfenshezhi,
            "angangfenshu": angangfenshu,
            "zhuahua": zhuahua,
            "jiesan": jiesan,
            "xianShi": xianShi,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            // "fangjian":fangjian,
            "gaoji": gaoji,
            "kexuanwanfa": kexuanwanfa
        };
        return sendPack;
    },
    RefreshAllToggles: function RefreshAllToggles(gameType) {
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        //this.node_RightLayout.removeAllChildren();
        this.DestroyAllChildren(this.node_RightLayout);
        var isHideZhadanfenshu = false;
        var isHideCBL = false; //是否隐藏除百六

        var helpIndex = 1; //01是总帮助
        for (var key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                var node = null;
                var dataKey = this.gameCreateConfig[key].Key;
                var toggleCount = this.gameCreateConfig[key].ToggleCount;
                var AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
                var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                if (this.clubData && 'fangfei' == dataKey) {
                    toggleCount = 1; //一个管理付，一个大赢家付
                    AtRows = [1];
                } else if (this.unionData && 'fangfei' == dataKey) {
                    toggleCount = 1; //一个盟主付`
                    AtRows = [1];
                }
                node = cc.instantiate(this.prefab_Toggles);
                node.active = true;
                //需要判断添更加多的Toggle
                var addCount = toggleCount - 1;
                if (addCount < 0) this.ErrLog('gameCreate Config ToggleCount error');else {
                    for (var i = 2; i <= toggleCount; i++) {
                        var prefabNode = node.getChildByName('Toggle1');
                        var newNode = cc.instantiate(prefabNode);
                        newNode.name = 'Toggle' + i;
                        node.addChild(newNode);
                    }
                }

                node.name = 'Toggles_' + dataKey;
                node.x = 10;
                var nodeHelp = node.getChildByName('btn_help');
                nodeHelp.active = false;
                if (this.gameCreateConfig[key].IsShowHelp) {
                    nodeHelp.name = 'btn_help0' + helpIndex;
                    nodeHelp.on('click', this.OnHelpBtnClick, this);
                    nodeHelp.active = true;
                    helpIndex++;
                }

                if (!this.Toggles[dataKey]) this.Toggles[dataKey] = [];

                var fristPos = { x: 0, y: 0 };
                var lastPos = { x: 0, y: 0 };
                for (var _i2 = 1; _i2 <= toggleCount; _i2++) {
                    var curNode = node.getChildByName('Toggle' + _i2);
                    curNode.isFirstNode = false;
                    if (curNode) {
                        //位置宽高设置下
                        //记录下第一个的位置方便换行
                        if (1 == _i2) {
                            fristPos.x = curNode.x;
                            fristPos.y = curNode.y;
                            lastPos.x = curNode.x;
                            lastPos.y = curNode.y;
                            curNode.isFirstNode = true;
                        } else if (1 < _i2) {
                            //第1个以后都是新增的
                            if (AtRows[_i2 - 2] != AtRows[_i2 - 1]) {
                                curNode.x = fristPos.x;
                                curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
                                node.height = node.height + curNode.height + this.rightPrefabSpacing;
                                curNode.isFirstNode = true;
                            } else {
                                // if ('fangfei' == dataKey) {
                                //     //房费节点比较长，需要再位移一点
                                //     curNode.x = lastPos.x + this.addPrefabWidth + 80;
                                // }else{
                                //     curNode.x = lastPos.x + this.addPrefabWidth;
                                // }
                                curNode.x = lastPos.x + parseInt(spacing[_i2 - 1]);
                                curNode.y = lastPos.y;
                            }
                        }
                        lastPos.x = curNode.x;
                        lastPos.y = curNode.y;

                        curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
                        var checkNode = curNode.getChildByName('checkmark');
                        var icon_selectBg = curNode.getChildByName('icon_selectBg');
                        var showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
                        //尝试获取缓存
                        var clubId = 0;
                        var roomKey = '0';
                        var unionId = 0;
                        var unionRoomKey = '0';
                        var linshi = null;
                        if (this.clubData) {
                            clubId = this.clubData.clubId;
                            roomKey = this.clubData.gameIndex;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
                        }
                        if (this.unionData) {
                            unionId = this.unionData.unionId;
                            unionRoomKey = this.unionData.roomKey;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
                        }
                        //第一次创建俱乐部房间没有roomKey为0
                        if (!linshi) linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0', unionId, unionRoomKey);
                        if (linshi) {
                            var linshiList = linshi.split(',');
                            for (var j = 0; j < linshiList.length; j++) {
                                //缓存可能出BUG(配置删除了按钮数量)
                                if (parseInt(linshiList[j]) > toggleCount) {
                                    linshiList = ['1'];
                                    break;
                                }
                            }
                            showList = linshiList;
                        }
                        if (this.clubData && 'fangfei' == dataKey) showList = [1];
                        if (this.unionData && 'fangfei' == dataKey) showList = [1];
                        if (dataKey == 'suanfenfangsi') {
                            if (linshi == 1) {
                                this.zpmjToggleIndex = 0;
                            }
                            if (linshi == 2) {
                                this.zpmjToggleIndex = 1;
                            }
                        } else if (dataKey == "taishusuanfa") {
                            if (parseInt(showList[0]) == 3) {
                                isHideCBL = false;
                            } else {
                                isHideCBL = true;
                            }
                        }
                        //尝试获取缓存
                        if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length) this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

                        if (1 == this.gameCreateConfig[key].ToggleType) {
                            //多选的图片设置下(不放上面是因为路径)
                            var imgPath = 'texture/ui/createRoom/icon_checkin02';
                            node.addComponent(cc.Toggle);
                            this.SetNodeImageByFilePath(checkNode, imgPath);
                            this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
                        }

                        for (var _j = 0; _j < showList.length; _j++) {
                            if (_i2 == parseInt(showList[_j])) {
                                checkNode.active = true;
                                break;
                            } else {
                                checkNode.active = false;
                            }
                        }
                        this.Toggles[dataKey].push(curNode);
                    }
                }
                this.UpdateTogglesLabel(node);
                this.UpdateLabelColor(node);
                this.node_RightLayout.addChild(node);
                var line = this.scroll_Right.node.getChildByName('line');
                var addline = cc.instantiate(line);
                addline.active = true;
                this.node_RightLayout.addChild(addline);
            }
        }
        this.setHelpBtnPos();
        this.scroll_Right.scrollToTop();
        //如果可以滚动，显示滚动提示节点
        if (this.node_RightLayout.height > this.scroll_Right.node.height) {
            this.scrollTip.active = true;
        } else {
            this.scrollTip.active = false;
        }
        if (this.zpmjToggleIndex == 0) {
            //选择算台制后，下方涨分设置和抓花不可见或不可选
            this.Toggles['zhangfenshezhi'][0].parent.active = false;
            this.Toggles['zhuahua'][0].parent.active = false;
            this.Toggles['angangfenshu'][0].parent.active = true;
        } else {
            this.Toggles['zhangfenshezhi'][0].parent.active = true;
            this.Toggles['zhuahua'][0].parent.active = true;
            this.Toggles['angangfenshu'][0].parent.active = false;
        }
        if (isHideCBL) {
            this.Toggles['kexuanwanfa'][6].active = false;
        } else {
            this.Toggles['kexuanwanfa'][6].active = true;
        }
    },
    OnToggleClick: function OnToggleClick(event) {
        this.FormManager.CloseForm("UIMessageTip");
        var toggles = event.target.parent;
        var toggle = event.target;
        var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
        var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
        var needClearList = [];
        var needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            // if('sss_dr' == this.gameType || 'sss_zz' == this.gameType){
            //     if(toggleIndex == 0){
            //         this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            //     }
            //     else if(toggleIndex == 1){
            //         this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //     }
            // }
        } else if ("taishusuanfa" == key) {
            if (toggleIndex == 2 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][6].active = true;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][6].parent);
            } else {
                this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active = false;
                this.Toggles['kexuanwanfa'][6].active = false;
            }
        } else if ("suanfenfangsi" == key) {
            this.zpmjToggleIndex = toggleIndex;
            if (this.zpmjToggleIndex == 0) {
                //选择算台制后，下方涨分设置和抓花不可见或不可选
                this.Toggles['zhangfenshezhi'][0].parent.active = false;
                this.Toggles['zhuahua'][0].parent.active = false;
                this.Toggles['angangfenshu'][0].parent.active = true;
            } else {
                this.Toggles['zhangfenshezhi'][0].parent.active = true;
                this.Toggles['zhuahua'][0].parent.active = true;
                this.Toggles['angangfenshu'][0].parent.active = false;
            }
        }
        if (toggles.getComponent(cc.Toggle)) {
            //复选框
            needShowIndexList = [];
            for (var i = 0; i < needClearList.length; i++) {
                var mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (mark && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!mark && i == toggleIndex) {
                        needShowIndexList.push(i);
                    }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();