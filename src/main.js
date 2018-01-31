// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'

//引入museui
import "@/plugin/museui"

//引入skirt插件
import "@/plugin/skirt"

//引入vue-router
import router from '@/plugin/router'

//引入vuex
import store from "@/plugin/vuex"

//引入语言包
import i18n from '@/plugin/lang'

//引入yaok函数库
import base from '@/lib/base'

router.beforeEach(function (to, from, next) {
    next();
    return;
    let ifLoginPage = to.name == 'page.account.login' || to.name == 'page.account.selectBrand' || to.name.indexOf("page.test") > -1;
    if (store.state.hasLogin){
        if (ifLoginPage){
            store.commit("logOut");
        }
        store.commit("loading", {
            type: "sys"
        });
        next();
    }else{
        if (!ifLoginPage){
            next({name: "page.account.login"});
        }else{
            next();
        }
    }
});


router.afterEach(route => {
    setTimeout(function () {
        store.commit("hideLoading", "sys");
    }, 100);
});

//来关闭生产模式下给出的提示
Vue.config.productionTip = false;
Vue.config.devtools = true;

import App from './App'
//启动应用
new Vue({
    el: '#app',
    i18n,
    store,
    router,
    base,
    template: '<App/>',
    components: {App}
});