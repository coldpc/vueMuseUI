import concat from "./concat"
import menu from "./menu"

class LangMessage{
    zh_CN = {};
    en_US = {};

    constructor(configList){
        this.initMessage(configList);
    }

    initMessage(configList){
        for (let i = 0, l = configList.length; i < l; i++) {
            this.addMessage(configList[i])
        }
    }

    addMessage(config){
        for (let key in config){
            this.zh_CN[key] = config[key].zh_CN;
            this.en_US[key] = config[key].en_US;
        }
    }
}

export default  new LangMessage([concat, menu]);
