/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
	},
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['HU']='胡';
        LabelArray['DDHU']='七对';
        LabelArray['HYS']='混一色';
        LabelArray['PPHU']='碰碰胡';
        LabelArray['GSKH']='杠上开花';
        LabelArray['QGH']='抢杠胡';
        LabelArray['QYS']='清一色';
        LabelArray['SSBK']='十三烂';
        LabelArray['SSBK_Qing']='七星十三烂';
        LabelArray['ZiYiSe']='字一色';
        LabelArray['TIANHU']='天胡';
        LabelArray['DIHU']='地胡';
        LabelArray['ZHENHU']='真胡';
        LabelArray['LIANGGANG']='连杠';
        LabelArray['LIDALIQIANG']='立打立抢';
        LabelArray['GANGPOINT']='杠分';
        LabelArray['LGAG']='连杠暗杠';
        LabelArray['LGJG']='连杠接杠';
        return LabelArray[huType];
    },
});
