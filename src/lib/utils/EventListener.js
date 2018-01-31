export default class EventListener{

    static getThisFuncKey = "this_func_key";
    static getThisKey = "this_key";

    events = {};
    constructor(){}

    /**
     *
     * @param _this 侦听器所属对象
     * @param funcName 执行回调函数的名称 必须支持 _this[funcName]获取
     * @returns {Object} 返回唯一实例 必须通过这个对象解除事件侦听
     *
     */
    getListener(_this, funcName){
        var o = new Object();
        o[EventListener.getThisKey] = _this;
        o[EventListener.getThisFuncKey] = funcName;
        return o;
    }

    //侦听事件
    addEventListener(name, call){
        if (this.events.hasOwnProperty(name)){
            this.events[name].push(call);
        }else{
            this.events[name] = [call];
        }
    }

    //移除事件
    removeEventListener(name, call){
        var event = this.events[name];
        if (event) {
            var listener;
            for (var i = 0, l = event.length; i < l; i++) {
                listener = event[i];
                if (listener == call) {
                    event.splice(i, 1);
                    break;
                }
            }
        }
    }

    //触发事件
    dispatch(name, ...args){
        var event = this.events[name];
        if (event) {
            var listener;
            for (var i = 0, l = event.length; i < l; i++) {
                listener = event[i];
                if (typeof listener == "function") {
                    listener(...args);
                }else if(typeof listener == "object"){

                    //解决this的指向问题
                    let _this = listener[EventListener.getThisKey];
                    let funcKey = listener[EventListener.getThisFuncKey];
                    if (_this && typeof _this[funcKey] == "function"){
                        _this[funcKey](...args);
                    }
                }
            }
        }
    }
}