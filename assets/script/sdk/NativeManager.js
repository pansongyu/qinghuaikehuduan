/*
 * 	NativeManager.js
 * 	移动端接口管理器
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 * change: "2014-10-28 20:24" hongdian 同步C++
 *
 */

var app = require('app');
/**
 * 类构造
 */
var NativeManager = app.BaseClass.extend({

	Init:function(){
		this.OCClassName = "NativeMgr";
		this.JavaClassName = "org/cocos2dx/javascript/NativeMgr";
		this.JavaArgTypeDict = {"Number":"I", "String":"Ljava/lang/String;", "Boolean":"Z", "Float":"F"};
		this.ComTool = app.ComTool();
		this.JS_Name = "NativeManager";
	},

	//调用native平台接口
	//funName:函数名
	//参数顺序列表argList=[{"Name":"Title", "Value":"xx"},{"Name":"Description", "Value":"xx"},{"Name":"URL", "Value":"xx"}]
	//returnType 返回值类型
	CallToNative:function(funName, argList, returnType){
		if(!cc.sys.isNative){
			this.ErrLog("CallToNative(%s) not native", funName);
			return
		}
		//加入子游戏名字，以便回调到各个小游戏，大厅统一用hall
		let subGameName = {"Name":"subGameName","Value":"hall"};
		argList.push(subGameName);
		if(this.ComTool.IsAndroid()){
			return this.CallToJava(funName, argList, returnType);
		}
		else if(this.ComTool.IsIOS()){
			if(funName=="getVersion" || funName=="checkVersion"){
				return;
			}
			return this.CallToOC(funName, argList, returnType);
		}
		else{
			this.ErrLog("CallToNative:%s error", cc.sys.os);
		}
	},

	/**
	 * 调用java接口
	 * javaFunName MyAPIManager.java 对应函数名
	 * argList argList 函数接受的参数列表
	 * returnType returnType 函数返回值类型
	 */
	CallToJava:function(javaFunName, argList, returnType){
		//jsb.reflection.callStaticMethod('org/cocos2dx/javascript/SDKManager',
		//'OnWeChatShare','(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',"当当猫","当当猫分享","www.ddmh5.com","0");

		let javaFunArgList = [];

		let javaFunSign = "(";

		let count = argList.length;
		for(let index=0; index<count; index++){
			let argInfo = argList[index];
			console.log("argInfo Name == " + argInfo.Name);
			console.log("argInfo Value == " + argInfo.Value);
			if(!argInfo.hasOwnProperty("Value")){
				this.ErrLog("CallToJava argInfo error", argInfo);
				return
			}
			let value = argInfo["Value"];
			let argType = Object.prototype.toString.call(value).slice("[object ".length, -1);
			let javaType = this.JavaArgTypeDict[argType];
			if(!javaType){
				this.ErrLog("CallToJava(%s, %j) error", javaFunName, argList);
				return
			}

			javaFunSign += javaType;

			javaFunArgList.push(value);
		}

		let returnValueType = this.JavaArgTypeDict[returnType];
		//如果有返回值
		if(returnValueType){
			javaFunSign += ")" + returnValueType;
		}
		else{
			javaFunSign += ")V";
		}
		javaFunArgList.unshift(this.JavaClassName, javaFunName, javaFunSign);


		try{
			this.SysLog("javaFunArgList CallToJava(%s)", JSON.stringify(javaFunArgList));
			return jsb.reflection.callStaticMethod.apply(this, javaFunArgList);
		}
		catch (error){
			this.ErrLog("CallToJava(%s,%s,%s) error:%s", javaFunName, JSON.stringify(argList), returnType, error.stack);
		}

	},

	/**
	 * 调用oc接口
	 * javaFunName MyAPIManager.java 对应函数名
	 * argList argList 函数接受的参数列表
	 * returnType returnType 函数返回值类型
	 */
	CallToOC:function(ocFunName, argList){
		//jsb.reflection.callStaticMethod(this.OCClassName,''OnWeChatShareWithTitle: Description: URL:Type:','红中麻将','红中麻将分享','www.ddmh5.com',"0");

		let ocFunArgList = [];
		ocFunArgList.push(this.OCClassName);

		let funString = ocFunName;
		let count = argList.length;
		for(let index=0; index < count; index++){
			let argInfo = argList[index];
			let name = argInfo["Name"];
			let value = argInfo["Value"];

			if(!name){
				this.ErrLog("CallToOC(%s) argInfo error", ocFunName, argInfo);
				return
			}
			if(index){
				funString += name + ":";
			}
			else{
				funString += "With" + name + ":";
			}

			ocFunArgList.push(value);
		}
		//插入函数签名
		ocFunArgList.splice(1, 0, funString);

		try{
			console.log("javaFunArgList CallToOC(%s)", JSON.stringify(ocFunArgList));
			return jsb.reflection.callStaticMethod.apply(this, ocFunArgList);
		}
		catch (error){
			this.ErrLog("CallToOC(%s,%s) error:%s", ocFunName, JSON.stringify(argList), error.stack);
		}

	},
})

var g_NativeManager = null

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_NativeManager){
		g_NativeManager = new NativeManager();
	}
	return g_NativeManager;
}