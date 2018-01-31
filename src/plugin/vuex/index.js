import Vue from "vue";
import Vuex from "vuex";
import i18n from '@/plugin/lang'

//引入yaok函数库
import base from '@/lib/base'

//品牌
import brand from './modules/brand/index'

// 路由
import router from './modules/router/index'


Vue.use(Vuex);


//初始化是否登录状态
const top = 100;
const left = 220;
const lang = {
    chinese: "zh_CN",
    english: "en_US"
};

let hasLogin = base.checkHaslogin();
let routeView = {top: top};
if (hasLogin){
    routeView.left = left;
}else{
    routeView.left = 0;
    routeView.top = 0;
}

//设置语言
i18n.locale = base.getCookie("locale") || lang.chinese;

export default new Vuex.Store({
    state: {
        count: 0,
        i18n: i18n,

        hasLogin: hasLogin,

        lang: lang,

        messagePlugin: {ifShow:false},
        loadingPlugin: {ifShow: false},

        routeView: routeView,
        routerWrapper: null
    },
    mutations: {
        increment (state) {
            state.count++
        },

        locale(state){
            state.i18n.locale = state.i18n.locale ==  state.lang.english ? state.lang.chinese : state.lang.english;
            base.setCookie("locale", state.i18n.locale, 100);
        },

        login(state){
            base.setCookie("o_token", "AJDKJDKAJDUY888DAJAK", 100);
            state.hasLogin = true;

            state.routeView.left = left;
            state.routeView.top = top;
        },

        logOut(state){
            base.deleteCookie("o_token");
            state.hasLogin = false;
            state.routeView.left = 0;
            state.routeView.top = 0;
        },

        toggleRouteViewLeft(state) {
            let l = parseInt(state.routeView.left);
            l = l == left ? 0 : left;
            state.routeView = {
                left: l,
                top: top
            };
        },

        //主容器
        setRouterWrapper(state, el){
            state.routerWrapper = el;
        },

        //text size
        loading(state, info){
            if (!info){
                info = {};
            }
            if (typeof info == "string"){
                info = {info: info};
            }

            info.ifShow = true;
            state.loadingPlugin = info;
        },
        hideLoading(state, type){
            if (state.loadingPlugin.type == type){
                state.loadingPlugin = {ifShow: false};
            }
        },
        //message title cancel ok close
        confirm(state, info){
            if (typeof info == "string"){
                info = {message: info};
            }

            info.ifConfirm = true;
            info.ifShow = true;
            state.messagePlugin = info;
        },
        //消息
        message(state, info){
            if (typeof info == "string"){
                info = {message: info};
            }
            info.ifConfirm = false;
            info.ifShow = true;
            state.messagePlugin = info;
        },

        hideMessage(state){
            state.messagePlugin = {ifShow: false};
        }
    },

    getters:{
        hasLogin(state){
            return state.hasLogin
        },

        routeView(state){
            return state.routeView;
        },

        routerWrapper(state){
            return state.routerWrapper
        },

        messageInfo(state){
            return state.messagePlugin;
        },

        loadingInfo(state){
            return state.loadingPlugin;
        },

        locale(state){
            return state.i18n.locale;
        }
    },


    actions: {
        login({ commit, dispatch }) {
            commit('login');
            dispatch('router/reset');
        },
        logout({ commit, dispatch }) {
            commit('logout');
            dispatch('router/reset');
        }
    },

    modules: {
        brand,
        router
    }
});
