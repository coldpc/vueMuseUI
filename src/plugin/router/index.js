import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//config
var createRoutesConfig = [
{path: "/page/account/alterPassword", component: resolve => require(["@/page/account/alterPassword"], resolve), name: "page.account.alterPassword"},
{path: "/page/account/login", component: resolve => require(["@/page/account/login"], resolve), name: "page.account.login"},
{path: "/page/account/selectBrand", component: resolve => require(["@/page/account/selectBrand"], resolve), name: "page.account.selectBrand"},
{path: "/page/activity/activity", component: resolve => require(["@/page/activity/activity"], resolve), name: "page.activity.activity"},
{path: "/page/activity/addItem", component: resolve => require(["@/page/activity/addItem"], resolve), name: "page.activity.addItem"},
{path: "/page/activity/edit", component: resolve => require(["@/page/activity/edit"], resolve), name: "page.activity.edit"},
{path: "/page/activity/list", component: resolve => require(["@/page/activity/list"], resolve), name: "page.activity.list"},
{path: "/page/activity/maintain", component: resolve => require(["@/page/activity/maintain"], resolve), name: "page.activity.maintain"},
{path: "/page/activity/signIn", component: resolve => require(["@/page/activity/signIn"], resolve), name: "page.activity.signIn"},
{path: "/page/activity/signInPlugin", component: resolve => require(["@/page/activity/signInPlugin"], resolve), name: "page.activity.signInPlugin"},
{path: "/page/brandGlobal/detail", component: resolve => require(["@/page/brandGlobal/detail"], resolve), name: "page.brandGlobal.detail"},
{path: "/page/index", component: resolve => require(["@/page/index"], resolve), name: "page.index"},
{path: "/page/item/assignCountry", component: resolve => require(["@/page/item/assignCountry"], resolve), name: "page.item.assignCountry"},
{path: "/page/item/assignDetail", component: resolve => require(["@/page/item/assignDetail"], resolve), name: "page.item.assignDetail"},
{path: "/page/item/assignStore", component: resolve => require(["@/page/item/assignStore"], resolve), name: "page.item.assignStore"},
{path: "/page/item/create", component: resolve => require(["@/page/item/create"], resolve), name: "page.item.create"},
{path: "/page/item/detail", component: resolve => require(["@/page/item/detail"], resolve), name: "page.item.detail"},
{path: "/page/item/edit", component: resolve => require(["@/page/item/edit"], resolve), name: "page.item.edit"},
{path: "/page/item/list", component: resolve => require(["@/page/item/list"], resolve), name: "page.item.list"},
{path: "/page/item/maintain", component: resolve => require(["@/page/item/maintain"], resolve), name: "page.item.maintain"},
{path: "/page/order/detail", component: resolve => require(["@/page/order/detail"], resolve), name: "page.order.detail"},
{path: "/page/order/orderList", component: resolve => require(["@/page/order/orderList"], resolve), name: "page.order.orderList"},
{path: "/page/order/orderPlugin", component: resolve => require(["@/page/order/orderPlugin"], resolve), name: "page.order.orderPlugin"},
{path: "/page/orgPartner/articleList", component: resolve => require(["@/page/orgPartner/articleList"], resolve), name: "page.orgPartner.articleList"},
{path: "/page/orgPartner/createArticle", component: resolve => require(["@/page/orgPartner/createArticle"], resolve), name: "page.orgPartner.createArticle"},
{path: "/page/orgPartner/selectItems", component: resolve => require(["@/page/orgPartner/selectItems"], resolve), name: "page.orgPartner.selectItems"},
{path: "/page/store/create", component: resolve => require(["@/page/store/create"], resolve), name: "page.store.create"},
{path: "/page/store/edit", component: resolve => require(["@/page/store/edit"], resolve), name: "page.store.edit"},
{path: "/page/store/editStore", component: resolve => require(["@/page/store/editStore"], resolve), name: "page.store.editStore"},
{path: "/page/store/list", component: resolve => require(["@/page/store/list"], resolve), name: "page.store.list"},
{path: "/page/store/selectProduct", component: resolve => require(["@/page/store/selectProduct"], resolve), name: "page.store.selectProduct"},
{path: "/page/store/selectProductPlugin", component: resolve => require(["@/page/store/selectProductPlugin"], resolve), name: "page.store.selectProductPlugin"},
{path: "/page/store/storeItems", component: resolve => require(["@/page/store/storeItems"], resolve), name: "page.store.storeItems"},
{path: "/page/store/storeItemsPlugin", component: resolve => require(["@/page/store/storeItemsPlugin"], resolve), name: "page.store.storeItemsPlugin"},
{path: "/page/store/storePlugin", component: resolve => require(["@/page/store/storePlugin"], resolve), name: "page.store.storePlugin"},
{path: "/page/test/activity", component: resolve => require(["@/page/test/activity"], resolve), name: "page.test.activity"},
{path: "/page/test/checkbox", component: resolve => require(["@/page/test/checkbox"], resolve), name: "page.test.checkbox"},
{path: "/page/test/ds", component: resolve => require(["@/page/test/ds"], resolve), name: "page.test.ds"},
{path: "/page/test/dsv", component: resolve => require(["@/page/test/dsv"], resolve), name: "page.test.dsv"},
{path: "/page/test/grid", component: resolve => require(["@/page/test/grid"], resolve), name: "page.test.grid"},
{path: "/page/test/map", component: resolve => require(["@/page/test/map"], resolve), name: "page.test.map"},
{path: "/page/test/SelectItem", component: resolve => require(["@/page/test/SelectItem"], resolve), name: "page.test.SelectItem"},
{path: "/page/test/suggest", component: resolve => require(["@/page/test/suggest"], resolve), name: "page.test.suggest"},
{path: "/page/test/tab", component: resolve => require(["@/page/test/tab"], resolve), name: "page.test.tab"},
{path: "/page/test/tform", component: resolve => require(["@/page/test/tform"], resolve), name: "page.test.tform"},
{path: "/page/test", component: resolve => require(["@/page/test"], resolve), name: "page.test"}
];

createRoutesConfig.push({
    path: "/",
    component: resolve => require(["@/page/index"], resolve),
    name: "home"
});

export default new VueRouter({
    mode: "hash", //history
    routes: createRoutesConfig
});