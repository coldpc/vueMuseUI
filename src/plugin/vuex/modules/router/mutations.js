import * as types from './mutationsTypes';
import ArrayApi from "@/lib/utils/ArrayApi";

import initData from './getInitData'

//引入vue-router
import router from '@/plugin/router'

//引入vuex
import store from "@/plugin/vuex"

const mutations = {
    [types.PUSH] (state, config) {
        removeActive(state.data);
        state.id++;
        
        // 未登录直接跳转
        if (!store.state.hasLogin) {
            goto(config);
            state.data = [Object.assign({}, initData)];
            return;
        }
        
        let currentRoute = router.currentRoute;
        if (currentRoute.name === config.name) {
            config.route = currentRoute;
        }
        
        // 查找相同的路由
        let query = config.query || {};
        let name = config.name;
        
        // 找到路由还要比较参数值是否一样
        let findExitRoute = ArrayApi.getDataByAttr(state.data, 'name', name);
        if (findExitRoute.length === 0) {
            config.active = true;
            config.id = state.id;
            state.data.push(config);
            goto(config);
        }else {
            // 比较参数
            let activeRoute;
            for (let i = 0; i < findExitRoute.length; i++) {
                if (checkIsSameQuery(findExitRoute[i].query, query)){
                    activeRoute = findExitRoute[i];
                    break;
                }
            }
    
            // 先设置true
            findExitRoute = findExitRoute[0];
            findExitRoute.active = true;
            
            // 参数不一致或者已经关闭过得 要重新加载
            if (!activeRoute || activeRoute.closed) {
                findExitRoute.query = config.query;
                findExitRoute.title = config.title;
                findExitRoute.needReload = true;
                state.data.splice(ArrayApi.searchIndexByAttr(state.data, 'name', findExitRoute.name), 1);
                state.data.push(findExitRoute);
                goto(findExitRoute);
            }else{
                goto(findExitRoute);
            }
            findExitRoute.closed = false;
        }
    },
    
    [types.RESET](state) {
        state.data = [Object.assign({}, initData)];
    },
    
    [types.RELOAD](state, config) {
        let name;
        if (typeof config === 'object') {
            name = config.name;
        }else {
            name = config;
        }
        
        // 先看看存在config不
        config = ArrayApi.getDataByAttr(state.data, 'name', name)[0];
        if (!config) {
            return;
        }
        
        config.needReload = true;
        if (router.currentRoute.name === config.name) {
            let index = ArrayApi.searchIndexByAttr(state.data, 'name', config.name);
            state.data.splice(index, 1, config);
        }
    },
    
    [types.FOCUS](state, config) {
        let index = ArrayApi.searchIndexByAttr(state.data, 'id', config.id);
        removeActive(state.data);
        config.active = true;
        config.needReload = false;
        state.data.splice(index, 1, config);
        goto(config);
    },
    
    [types.REMOVE](state, config) {
        let data = state.data,
            removeSelf = false;
        if (!config) {
            removeSelf = true;
        }

        if (removeSelf) {
            config = ArrayApi.getDataByAttr(data, 'active', true)[0];
        }
        // 首页不可以被移除 或者关闭
        if (config.name === initData.name){
            return;
        }
        
        // 查找移除的路由
        let deleteIndex = ArrayApi.searchIndexByAttr(data, 'id', config.id);
        
        // // 关闭必须释放
        config.closed = true;
        config.needReload = true;
        // let matched = config.route.matched[0];
        // matched.instances.default.$destroy();
        // matched.components = findRouteComponent(config).component;
        // delete matched.components.crid;
        // delete matched.instances.default;
        
        // goto(config);
        // router.currentRoute.matched[0].instances.default.$destroy();
        
        // 获取当前的激活路由 关闭的是激活的路由
        if (config.active || removeSelf) {
            let enableData = ArrayApi.getDataByAttr(data, 'closed', true, true);
            let index = enableData.length - 1;
            if (config.name === enableData[index].name) {
                index -= 1;
            }
            let activeConfig = enableData[index];
            activeConfig.active = true;
            config.active = false;
            goto(activeConfig);
        }
        data.splice(deleteIndex, 1, config);
    }
};

function findRouteComponent(config) {
    return ArrayApi.getDataByAttr(router.options.routes, 'name', config.name)[0];
}

function checkIsSameQuery(query1, query2, isOnce) {
    let isSame = true;
    query1 = query1 || {};
    query2 = query2 || {};
    for (let key in query1) {
        if (query1[key] != query2[key]){
            isSame = false;
            break;
        }
    }
    
    if (!!isOnce) {
        return isSame;
    }
    
    return isSame && checkIsSameQuery(query2, query1, true);
}

// 跳转
function goto(routerConfig, call) {
    router.replace(routerConfig, function (route) {
        // component // crid
        routerConfig.route = route;
        if (typeof call === 'function') {
            call(routerConfig);
        }
    });
}

function replacePage(routerConfig) {
    router.replace(routerConfig);
}

// 去掉active
function removeActive(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].active = false;
    }
}

export default mutations;