import _store from "@/plugin/vuex"
import axios from 'axios';
import Qs from 'qs';
import EventListener from "@/lib/utils/EventListener"

const protocol = "http://";

/******请求类型**********/
const contentType = {
    form: "application/x-www-form-urlencoded;charset=UTF-8",
    json: "application/json",
    file: "multipart/form-data",
    key: 'Content-Type'
};

const defaultMethod = "post";
const defaultPath = "/vendor";
// const defaultPath = "/vendor/";


/************拦截config ********************/
axios.interceptors.request.use(function (config) {
    if (config.headers[contentType.key] == contentType.form) {
        config.data = Qs.stringify(config.data);
    }
    return config;

}, function (error) {

    return Promise.reject(error);

});

/**********拦截响应********************/
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return error;
});


axios.defaults.timeout = 20 * 60 * 1000;//响应时间
axios.defaults.method = "post";//请求方式
axios.defaults.baseURL = protocol + location.host;//响应时间
axios.defaults.headers.post['Content-Type'] = contentType.form;

/**
 *
 * @param state state状态容器
 * @param o 模块 模块名称
 * @returns {*|{}}
 */
function createDataModule(config = {}, name) {
    let item, module = {};

    for (var key in config) {
        item = config[key];
        //判断是否为枚举
        if (key !== "enumeration") {
            item.url = (item.path || defaultPath) + item.url;
            module[key] = new BaseDataCenter(item, name + "." + key + "." + "event");
        } else {
            let o = Object.assign({}, module[key]);
            module[key] = Object.assign(o, item);
        }
    }
    return module;
}

class BaseDataCenter extends EventListener {
    contentType = contentType;

    constructor(item, eventName) {
        super();
        this.item = item;
        this.eventName = eventName;
    }

    //params method
    execute(config = {}) {
        let item = this.item;
        config.method = config.method || item.method || defaultMethod;
        config.data = config.data !== undefined ? config.data : {};
        config.url = config.url || item.url;
        config.__ = this;
        config.contentType = contentType[item.contentType] || item.contentType || contentType.form;

        //get方式无法从data post数据
        if (config.method == "get" && config.data){
            config.params = Object.assign(config.params || {}, config.data);
        }

        //设置header
        config.headers = {[contentType.key]: config.contentType};

        if (item.onUploadProgress){
            config.onUploadProgress = item.onUploadProgress;
        }

        //遮罩
        let mask = config.mask;
        if (!!mask) {
            _store.commit("loading");
            config.$v = "service";
        }

        //发起ajax请求
        this.doAjax(config);
    }

    doAjax(cof){
        axios.request(cof).then(function (response) {
            let [res, config] = [response.data, response.config];

            //去除遮罩
            if (config.$v) {
                _store.commit("hideLoading");
                delete config.$v;
            }

            if (!!res) {

                //成功返回数据
                if (res.code == 0) {
                    if (typeof config.success == "function") {
                        config.success(res.data, res);
                    }

                    var _this = config.__;
                    _this.dispatch(_this.eventName, res.data, res);

                } else {

                    //异常返回
                    if (typeof config.failed == "function") {
                        config.failed(res.message);
                    }else if(res.code == -2){
                        // 跳转登录
                        _store.commit("logOut");
                        location.href = location.protocol + "//" + location.host + '/#/page/account/login';
                        location.reload();
                    }else {
                        config.__.ctrlFailedMessage(res.message);
                    }
                }

            } else {

                //无任何返回数据
                if (typeof config.failed == "function") {
                    config.failed(response.message);
                } else {
                    config.__.ctrlFailedMessage(response.message);
                }
            }

            //请求完成回调
            if (typeof config.complete == 'function'){
                config.complete(res);
            }

            delete config.__;
            delete response.config;
            config = null;

        }).catch(function (error) {

            //移除遮罩
            if (cof.$v) {
                _store.commit("hideLoading", cof.$v);
                delete cof.$v;
            }

            cof.__.ctrlError(error);

            //请求完成回调
            if (typeof cof.complete == 'function'){
                cof.complete(error);
            }

            //清除cof
            cof = null;
        });
    }

    ctrlError(error) {
        console.log(error);
    }

    ctrlFailedMessage(message = "unkonw error") {
        _store.commit("message", message);
    }
}

export {BaseDataCenter, createDataModule}
