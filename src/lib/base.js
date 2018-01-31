import Vue from "vue";

class Base{
    static _instance = null;

    static getInstance(){
        if (!Base._instance){
            Base._instance = new Base();
        }
        return Base._instance;
    }

    constructor(){
        if (!!Base._instance){
            throw new Error("This is a singleton class!");
        }
    }

    install(Vue){
        Vue.prototype.$base = this;
    }

    setCookie(key, value, expiredays, path, ifCopy){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        path = path || "/";

        //拷贝cookie不需要编码
        if (ifCopy !== true){
            value = encodeURIComponent(value);
        }
        document.cookie = key + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path;
    };

    getCookie(key, autoDelete){
        var cookie = document.cookie;
        if (cookie.length > 0){
            var start = cookie.indexOf(key + "=");
            var end = null;
            if (start!=-1){
                start = start + key.length+1;
                end = cookie.indexOf(";", start);
                if (end == -1){
                    end = cookie.length;
                }
                return decodeURIComponent(cookie.substring(start, end));
            }
        }

        if (autoDelete){
            this.deleteCookie(key);
        }
        return "";
    }

    deleteCookie(key) {
        var date = new Date();
        date.setTime(date.getTime() - 1);
        document.cookie= key + "=1;expires=" + date.toGMTString() + ";path=/;";
    }

    removeLocalStorage (key) {
        var localStorage = window.localStorage;
        if (localStorage){
            localStorage.removeItem(key);
            return true;
        }else{
            return false;
        }
    }

    setLocalStorage(key, value){
        var localStorage = window.localStorage;
        if (localStorage){
            if (typeof value != "object"){
                localStorage.setItem(key, value);
            }else{
                localStorage.setItem(key, JSON.stringify(value));
            }
            return true;
        }else{
            return false;
        }
    }

    message(){

    }

    getLocalStorage(key){
        var localStorage = window.localStorage;
        if (localStorage){
            return localStorage.getItem(key);
        }
    }

    addParaToUrl(url, key, value) {
        if (url.indexOf("?") == -1){
            url += "?";
        }else{
            url += "&";
        }
        url += key + "=" + encodeURIComponent(value);
        return url;
    }

    replaceState(url, state = {}, title = ""){
        history.replaceState(state, title, url);
    }

    /**
     * 检验是否登录过
     * 未登录直接跳转登录
     *
     */
    checkHaslogin(){
        var token = base.getCookie("token");
        return !!token;
    }
    
    //转义  元素的innerHTML内容即为转义后的字符 防止脚本注入
    htmlEncode(str){
        if (!!str && typeof str == "string"){
            let ele = document.createElement('span');
            ele.appendChild( document.createTextNode( str ) );
            return ele.innerHTML;
        }else{
            return str;
        }
    }
    
    gotoLogin(){
    
    }

    deepCopy(data) {
        if (typeof data != "object") {
            return data;
        } else {
            var result;
            if (data instanceof Array) {
                result = new Array();
            } else {
                result = new Object();
            }

            for (var key in data) {
                result[key] = this.deepCopy(data[key]);
            }
            return result;
        }
    }
    
    isNumber(v){
        let re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
        return re.test(v);
    }
    
    formatTime(date, fmt) {
        if (!date){
            return date;
        }
        if (this.isNumber(date)){
            date = new Date(parseInt(date));
        }
        
        if (typeof date === "string"){
            return date;
        }
        
        if (!fmt){
            fmt = "yyyy-MM-dd hh:mm:ss";
        }
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
}

/**
 * export出去
 * 形成单例模式
 */
var base = window.yaok = Base.getInstance();
Vue.use(base);


export default base;