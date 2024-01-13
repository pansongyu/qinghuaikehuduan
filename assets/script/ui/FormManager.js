/*
    场景管理器
*/

var app = require('app');

var FormManager = app.BaseClass.extend({

    //初始化
    Init:function(){
        this.JS_Name = "FormManager";

        let SysDataManager = app.SysDataManager();
        this.SceneInfo = app.SysDataManager().GetTableDict("SceneInfo");

        this.HeroManager = app.HeroManager();
        this.ShareDefine = app.ShareDefine();
        this.SysNotifyManager = app.SysNotifyManager();

        //已经创建的界面字典
        this.loadFormDict = {};

        this.showFormDict = {};

        //正在执行创建的界面
        this.createingFormDict = {};

        //界面控件显示条件字典
        // {
        //     formName:{
        //         wndPath:{"WndParentPath":"","WndPath":"aaa/btn01"}
        //     }
        // }
        this.formWndShowInfo = {};

        //切换场景默认需要显示的界面
        this.defaultFormNameList = [];

        //是否关闭功能控制
        this.isCloseFunButton = false;

        this.InitData();

        this.Log("Init");
    },

    InitData:function(){

        // for(let index in this.FormWndShowInfo){
        //     let formWndShowInfo = this.FormWndShowInfo[index];
        //     let formName = formWndShowInfo["FormName"];
        //     let wndPath = formWndShowInfo["WndPath"];

        //     let wndPathNameList = wndPath.split("/");

        //     let wndParentPath = "";

        //     if(wndPathNameList.length == 1){
        //         wndParentPath = "";
        //     }
        //     else{
        //         wndParentPath = wndPathNameList.join("/");
        //     }

        //     let wndInfo = this.formWndShowInfo.SetDefault(formName, {});
        //     if(wndInfo.hasOwnProperty(wndPath)){
        //         this.ErrLog("formWndShowInfo(%s) have find(%s)", formName, wndPath);
        //         continue
        //     }
        //     wndInfo[wndPath] = {
        //                         "ConditionType":formWndShowInfo["ConditionType"],
        //                         "ConditionValue":formWndShowInfo["ConditionValue"],
        //                         "ShowType":formWndShowInfo["ShowType"],
        //                         "WndParentPath":wndParentPath,
        //                     };
        // }
    },
    formPath2RealPath:function(formPath){
        if(formPath.indexOf('/')<1){
            return 'ui/'+formPath;
        }
        return formPath;
    },
    formPath2formName:function(formPath){
        if(formPath.indexOf('/')>-1){
            let split=formPath.split('/');
            return split[(split.length)-1];
        }else{
            return formPath;
        }
    },

    //----------------操作接口--------------------

    //创建界面
    CreateForm:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        // let formPath = "";

        // let promise = null;
        // for(let idx in this.folder){
        //     formPath = this.folder[idx].folderPath + formName;
        //     promise = app.ControlManager().CreateLoadPromise(formPath);
        // }

        let that = this;
        return app.ControlManager().CreateLoadPromise(formPath)
        .then(function(prefab){
            if(that.loadFormDict.hasOwnProperty(formPath)){
                that.Log("CreateForm(%s)重复创建界面", formPath);
                return that.loadFormDict[formPath];
            }

            let formNode = cc.instantiate(prefab);
            let formComponent = formNode.getComponent(formName);
            if(!formComponent){
                that.ErrLog("CreateForm(%s) not find Component", formName);
                return
            }
            formComponent.OnCreate(formName);
            that.loadFormDict[formPath] = formNode;
            return formComponent
            
        })
        .catch(function(error){
            that.ErrLog("CreateForm(%s) error:%s", formName, error.stack);
        })
    },
    //显示界面
    ShowForm:function(...argList){
        if(!argList.length){
            this.ErrLog("ShowForm Need FormName");
            return app.bluebird.resolve(null);
        }
        let formPath = argList.shift();
        // console.error("formPath: ", formPath);
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        //如果已经加载过的界面,则设置界面显示
        if(this.loadFormDict.hasOwnProperty(formPath)){
            let formNode = this.loadFormDict[formPath];
            if(!formNode){
                this.ErrLog("ShowForm Error:formName %s",formName);
                return;
            }
            if(formNode.name!=""){
                let formComponent = formNode.getComponent(formName);
                formComponent.ShowForm(argList);
                return app.bluebird.resolve(formComponent);
            }else{
                delete this.loadFormDict[formPath];
            }
        }

        //如果已经在创建中
        if(this.createingFormDict.hasOwnProperty(formPath)){
            this.ErrLog("ShowForm createingFormDict have find(%s)",formName);
            return app.bluebird.resolve(null);
        }

        this.createingFormDict[formPath] = 1;

        let that = this;

        app.Client.OnEvent("ModalLayer", "CreateForm");

        return this.CreateForm(formPath)
                    .then(function(formComponent){

                        delete that.createingFormDict[formPath];

                        if(formComponent){
                            formComponent.ShowForm(argList);
                        }
                        else{
                            that.ErrLog("CreateForm(%s) fail", formPath);
                        }
                        
                        app.Client.OnEvent("ModalLayer", "CreateFormEnd");

                        return formComponent
                    })
                    .catch(function(error){
                        that.ErrLog("ShowForm error:%s", error.stack);
                        app.Client.OnEvent("ModalLayer", "CreateFormEnd");
                    })

    },
    CloseFormReal:function(formPath,isDestory=false){
        this.CloseForm(formPath,isDestory);
        delete this.loadFormDict[formPath];
    },
    //关闭界面
    CloseForm:function(formPath,isDestory=false){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        if(!this.loadFormDict.hasOwnProperty(formPath)){
            this.Log("CloseForm(%s) not load", formPath);
            return
        }
        let formNode = this.loadFormDict[formPath];
        if(!formNode){
            this.ErrLog("CloseForm Error:formName %s",formPath);
            return;
        }
        if(formNode.name==""){
            delete this.loadFormDict[formPath];
            return;
        }
        try {
            let formComponent = formNode.getComponent(formName);
            if(formComponent){
                formComponent.CloseForm(isDestory);
            }
            else{
                this.ErrLog("CloseForm Error:formName %s,nodeName %s",formName,formNode.name);
            }
        } catch(error) {
            this.ErrLog("CloseForm Error:formName %s,nodeName %s formPath %s",formName,formNode.name,formPath);
        }
    },

    //关闭所有亲友圈相关界面
    CloseAllClubForm:function(){
        for (let formPath in this.loadFormDict) {
            if (formPath.indexOf("club") != -1) {
                this.CloseForm(formPath);
            }
        }
    },

    //开启和关闭界面
    ShowOrCloseForm:function(...argList){
        if(!argList.length){
            this.ErrLog("ShowOrCloseForm Need FormName");
            return false
        }
        let formPath = argList.shift();
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        if(!this.loadFormDict.hasOwnProperty(formPath)){
            argList.unshift(formPath)
            //调用更新界面函数
            this.ShowForm.apply(this, argList);
            return true
        }
        let formNode = this.loadFormDict[formPath];
        let formComponent = formNode.getComponent(formName);
        formComponent.ShowOrCloseForm(argList);        
    },
    //获取界面字典里的指定名字对象的同名脚本
    GetFormComponentByFormName:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        if(!this.loadFormDict.hasOwnProperty(formPath)){
            this.Log("GetFormComponentByFormName(%s) not load", formPath);
            return
        }
        return this.loadFormDict[formPath].getComponent(formName);
    },

    //界面是否显示中
    IsFormShow:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        if(!this.loadFormDict.hasOwnProperty(formPath)){
            this.Log("IsFormShow(%s) not load", formPath);
            return false
        }
        return this.loadFormDict[formPath].getComponent(formName).IsFormShow();
    },

    //获取界面控件显示条件字典
    GetFormWndShowInfo:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        if(this.isCloseFunButton){
            return {}
        }

        if(!this.formWndShowInfo.hasOwnProperty(formPath)){
            this.Log("GetFormWndShowInfo not find:%s", formPath);
            return {}
        }
        return this.formWndShowInfo[formPath];
    },



    SetIsCloseFunButton:function(){
        this.isCloseFunButton = !this.isCloseFunButton
    },

    GetIsCloseFunButton:function(){
        return this.isCloseFunButton
    },
    
    AddShowingForm:function(formPath, formComponent){
        formPath =this.formPath2RealPath(formPath);
        this.showFormDict[formPath] = formComponent;
    },

    RemoveShowingForm:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        delete this.showFormDict[formPath];
    },

    //显示界面控件功能函数
    ShowFunWnd:function(formPath){
        formPath =this.formPath2RealPath(formPath);
        formName=this.formPath2formName(formPath);
        let formComponent = this.GetFormComponentByFormName(formName);
        if(!formComponent){
            this.ErrLog("ShowFunWnd(%s) not find");
            return
        }
        let node = formComponent.node;

        let wndInfo = this.GetFormWndShowInfo(formPath);
        let heroLv = this.HeroManager.GetHeroProperty("lv");
        let passMaxTowerLv = 0;

        for(let wndPath in wndInfo){

            let conditionInfo = wndInfo[wndPath];

            let wndParentPath = conditionInfo["WndParentPath"];
            let conditionType = conditionInfo["ConditionType"];
            let conditionValue = conditionInfo["ConditionValue"];
            let showType = conditionInfo["ShowType"];

            let wndNode = cc.find(wndPath, node);
            if(!wndNode){
                this.ErrLog("ShowFunWnd not find:%s", wndPath);
                continue
            }

            let wndParent = "";
            if(!wndParentPath){
                wndParent = node;
            }
            else{
                wndParent = cc.find(wndParentPath, node);
                if(!wndParent){
                    this.ErrLog("ShowFunWnd(%s) not find", wndParentPath);
                    continue
                }
            }

            let isOpen = false;

            if(conditionType == "HeroLv"){
                if(heroLv >= conditionValue){
                    isOpen = true;
                }
                else{
                    isOpen = false;
                }
            }
            else if(conditionType == "PassMaxTowerLv"){
                if(passMaxTowerLv >= conditionValue){
                    isOpen = true;
                }
                else{
                    isOpen = false;
                }
            }
            else{
                isOpen = false
            }
            
            if(isOpen){

                if(showType == this.ShareDefine.FormWnd_NotShow){
                    wndNode.active = true;
                }
                else if(showType == this.ShareDefine.FormWnd_EffectLock){
                    formComponent.DeleteWndEffect(wndPath, "FunLock");
                }
                else{
                    this.ErrLog("wndPath(%s) showType:%s error", wndPath, showType);
                }
            }
            else{
                if(showType == this.ShareDefine.FormWnd_NotShow){
                    wndNode.active = false;
                }
                else if(showType == this.ShareDefine.FormWnd_EffectLock){
                    formComponent.AddWndEffect(wndPath, "FunLock", "Lock");
                }
                else{
                    this.ErrLog("wndPath(%s) showType:%s error", wndPath, showType);
                }
            }
        }
    },

    CheckFunButtonIsOpen:function(formPath, wndPath, isNotify=true){
        formPath =this.formPath2RealPath(formPath);
        let formName=this.formPath2formName(formPath);
        let wndInfo = this.GetFormWndShowInfo(formPath);
        if(!wndInfo.hasOwnProperty(wndPath)){
            return true
        }
        let conditionType = wndInfo[wndPath]["ConditionType"];
        let conditionValue = wndInfo[wndPath]["ConditionValue"];

        let heroLv = this.HeroManager.GetHeroProperty("lv");
        let passMaxTowerLv = 0;

        if(conditionType == "PassMaxTowerLv"){
            if(passMaxTowerLv >= conditionValue){
                return true
            }
            if(isNotify){
                this.SysNotifyManager.ShowSysMsg("FunBtnNotOpen_PassMaxTowerLv", [conditionValue-1]);
            }
            return false
        }
        else if(conditionType == "HeroLv"){
            if(heroLv >= conditionValue){
                return true
            }
            if(isNotify){
                this.SysNotifyManager.ShowSysMsg("FunBtnNotOpen_HeroLv", [conditionValue]);
            }
            return false
        }
        else{
            this.ErrLog("CheckFunButtonIsOpen(%s) conditionType:%s error", wndPath, conditionType);
            return false
        }
    },

    //增加默认显示的界面
    AddDefaultFormName:function(formPath){
        formPath=this.formPath2RealPath(formPath);
        if(this.defaultFormNameList.InArray(formPath)){
            return
        }
        this.defaultFormNameList.push(formPath);
    },

    GetDefaultFormNameList:function(){
        return this.defaultFormNameList;
    },

    ClearDefaultFormNameList:function(){
        this.defaultFormNameList = [];
    },
    //------------------回调函数--------------------------

    //开始切换场景
    OnBeforeExitScene:function(sceneName,isDestory=true){
        this.Log("OnBeforeExitScene(%s)", sceneName);
        //关闭所有界面
        for(let formPath in this.loadFormDict){
            this.CloseForm(formPath,isDestory);
        }
    },
    isInArray:function(value,arrayList){
        let length=arrayList.length;
        for(let i=0;i<length;i++){
            if(value==arrayList[i]){
                return true;
            }
        }
        return false;
    },
    LoadSceneDefaultForm:function(sceneName){

        this.Log("LoadSceneDefaultForm(%s)", sceneName);

        let bluebirdList = [];

        let loadFormNameList = [];
        let NoAddScene=['clubScene','fightScene','launchScene','loginScene','mainScene']; //四个基础场景不用添加uimore，uimark
        let BaseForm=['UIMark','UIVoice','UIMore'];
        if(this.isInArray(sceneName,NoAddScene)==false){
            //添加游戏预制品
            let GamePrefab=this.SceneInfo[sceneName].gamePrefab;

            //3D切换
            let is3DShow=app.LocalDataManager().GetConfigProperty("SysSetting", "is3DShow");
            if(is3DShow==0 && GamePrefab=='game/XYMJ/ui/UIXYMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/XYMJ/ui/UIXYMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/PTMJ/ui/UIPTMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/PTMJ/ui/UIPTMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/PT13MJ/ui/UIPT13MJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/PT13MJ/ui/UIPT13MJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/ZJMJ/ui/UIZJMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/ZJMJ/ui/UIZJMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/WZMJ/ui/UIWZMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/WZMJ/ui/UIWZMJ2DPlay';
                 BaseForm=[];
            }
            if(is3DShow==0 && GamePrefab=='game/YCMJ/ui/UIYCMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/YCMJ/ui/UIYCMJ2DPlay';
                 BaseForm=[];
            }

            if(GamePrefab==0){
                this.ErrLog("LoadSceneDefaultForm sceneName(%s)  not GamePrefabhave find: (%s)",sceneName,GamePrefab);
            }
            BaseForm.unshift(GamePrefab);
            //添加三个必须预制品
            for(let i=0;i<BaseForm.length;i++){
                let formName=BaseForm[i];
                //如果界面已经创建
                if(this.loadFormDict.hasOwnProperty(formName)){
                    continue
                }
                //如果界面已经在创建中
                if(this.createingFormDict.hasOwnProperty(formName)){
                    continue
                }

                loadFormNameList.push(formName);
                bluebirdList.push(this.CreateForm(formName));
            }
        }
        let count = this.defaultFormNameList.length;
        for(let index=0; index<count; index++){
            let formName = this.defaultFormNameList[index];

            if(loadFormNameList.InArray(formName)){
                continue
            }
            loadFormNameList.push(formName);
            bluebirdList.push(this.CreateForm(formName));
        }

        //如果是主场景UIMain默认加载
        // if(sceneName == "mainScene" && !loadFormNameList.InArray("UINewMain")){
        //     bluebirdList.push(this.CreateForm("UINewMain"));
        // }

        //如果存在需要加载的界面资源
        if(bluebirdList.length){

            app.Client.OnEvent("ModalLayer", "CreateForm");

            return app.bluebird.all(bluebirdList)
                .then(function(){
                    app.Client.OnEvent("ModalLayer", "CreateFormEnd");
                })
        }
    },

    //切换完场景
    OnSwithSceneEnd:function(sceneName){

        this.Log("OnSwithSceneEnd(%s)", sceneName);

        let BaseForm=['UIMark','UIVoice','UIMore'];
        let NoAddScene=['clubScene','fightScene','launchScene','loginScene','mainScene']; //四个基础场景不用添加uimore，uimark
        if(this.isInArray(sceneName,NoAddScene)==false){
            //添加游戏预制品
            let GamePrefab=this.SceneInfo[sceneName].gamePrefab;
            //3D切换
            let is3DShow=app.LocalDataManager().GetConfigProperty("SysSetting", "is3DShow");
            if(is3DShow==0 && GamePrefab=='game/XYMJ/ui/UIXYMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/XYMJ/ui/UIXYMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/PTMJ/ui/UIPTMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/PTMJ/ui/UIPTMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/PT13MJ/ui/UIPT13MJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/PT13MJ/ui/UIPT13MJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/ZJMJ/ui/UIZJMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/ZJMJ/ui/UIZJMJ2DPlay';
            }
            if(is3DShow==0 && GamePrefab=='game/WZMJ/ui/UIWZMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/WZMJ/ui/UIWZMJ2DPlay';
                 BaseForm=[];
            }
            if(is3DShow==0 && GamePrefab=='game/YCMJ/ui/UIYCMJPlay'){
                 //2D场景需要切换
                 GamePrefab='game/YCMJ/ui/UIYCMJ2DPlay';
                 BaseForm=[];
            }
            if(GamePrefab==0){
                this.ErrLog("LoadSceneDefaultForm sceneName(%s)  not GamePrefabhave find: (%s)",sceneName,GamePrefab);
            }
            BaseForm.unshift(GamePrefab);
            //显示三个必须预制品
            for(let i=0;i<BaseForm.length;i++){
                this.ShowForm(BaseForm[i]);
            }
        }
    },
    _isOrientationH:function(){
        let frameSize = cc.view.getFrameSize();
        return frameSize.width > frameSize.height;
    },
});


var g_FormManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_FormManager){
        g_FormManager = new FormManager();
    }
    return g_FormManager;
}
