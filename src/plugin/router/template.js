import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//config
var createRoutesConfig = [];

createRoutesConfig.push({
    path: "/",
    component: resolve => require(["@/page/index"], resolve),
    name: "home"
});

export default new VueRouter({
    mode: "hash", //history
    routes: createRoutesConfig
});