<template>
    <div id="app">
        <brand></brand>

        <sk-location>
            <template slot="location" scope="props">
                <div v-if="hasLogin" class="sk-home-left-part transition" :style="{width: props.left}">
                    <menu-list :has-login="hasLogin"></menu-list>
                </div>
            </template>
        </sk-location>

        <sk-location>
            <template slot="location" scope="props">
                <div scope="props" v-if="hasLogin" :style="{left: props.left}" class="sk-home-top-part transition">
                    <div class="top-part-con">
                        <div class="left-part top-part">
                            <div @click="toggleMenu">
                                <mu-icon-button icon="list"></mu-icon-button>
                            </div>
                        </div>
                        <div class="right-part top-part">
                            <div class="right-menu">
                                <span>{{$t("connectService")}}:</span>
                                <a style="margin-left: 4px;" href="mailto:customercare@yaok.com">customercare@yaok.com</a>
                            </div>
                            <div class="right-menu">
                                <mu-icon-menu :anchorOrigin="{horizontal: 'right', vertical: 'top'}" :targetOrigin="{horizontal: 'right', vertical: 'top'}" icon="more_vert" :value="locale" @change="languageItemSwitch">
                                    <mu-menu-item value="zh_CN" title="中文" />
                                    <mu-menu-item value="en_US" title="English" />
                                </mu-icon-menu>
                            </div>
                            <div class="right-menu" @click="exit">
                                <mu-icon-button label="退出" icon="settings_power"/>
                            </div>
                        </div>
                    </div>
                    <div class="bar-progress-con">
                        <mu-linear-progress mode="determinate" :value="100" color="#333"/>
                    </div>
                    <!--<div class="tab-part-con">-->
                        <!--<div ref="tabContainer" class="custom-analysis page-wrap-tabs">-->
                            <!--<div class="move-angle-btn move-left" @click="moveTab(1)">-->
                                <!--<mu-icon value="arrow_back" :size="20"/>-->
                            <!--</div>-->
                            <!--<div class="move-angle-btn move-right" @click="moveTab(-1)">-->
                                <!--<mu-icon value="arrow_forward" :size="20"/>-->
                            <!--</div>-->
                            <!--<ul ref="tabSetCon" class="tab-set transition">-->
                                <!--<li v-if="!option.closed" @click="clickTab(option, $event)" @dblclick="closeTab(option)" :class="option.active ? 'active' : ''" class="transition tab-item" v-for="(option, index) in routerOptions">-->
                                    <!--<span class="tab-title">{{$t(option.name)}}</span>-->
                                    <!--<span v-if="!option.isMain" class="tab-close" @click.stop="closeTab(option)">-->
                                         <!--<mu-icon value="close" :size="12"/>-->
                                    <!--</span>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                    <!--</div>-->
                </div>
            </template>
        </sk-location>

        <sk-location>
            <template slot="location" scope="props">
                <div class="sk-home-main-content transition" :style="{left: props.left, top: props.top}" :class="!hasLogin ? 'full-screen' : ''">
                    <div class="sk-router-wrapper">
                        <div class="main-content" >
                            <!--<keep-alive>-->
                                <!--<router-view></router-view>-->
                            <!--</keep-alive>-->
    
                            <router-view></router-view>
                        </div>
                    </div>
                </div>
            </template>
        </sk-location>

        <sk-loading v-bind:if-show="loadingInfo.ifShow" v-bind:size="loadingInfo.size" v-bind:info="loadingInfo.info"></sk-loading>

        <sk-message v-bind:title="messageInfo.title || this.$t('notice')" v-bind:if-confirm="messageInfo.ifConfirm" v-bind:if-show="messageInfo.ifShow" v-bind:message="messageInfo.message" v-bind:ok="messageInfo.ok" v-bind:cancel="messageInfo.cancel" v-bind:close="messageInfo.close"></sk-message>

        <sk-img-viewer></sk-img-viewer>
    </div>
</template>

<script>
    import Menu from "@/components/page/index/menu"
    import Account from "@/lib/dataModules/account"
    import brand from "@/components/page/index/brandInfo"

    import {mapGetters, mapActions} from 'vuex';
    import ArrayApi from "./lib/utils/ArrayApi";

    const progressModes = {
        indeterminate: "indeterminate",
        determinate: "determinate ",
    };

    export default {
        name: 'app',
        data(){
            window.test2 = this;
            return {
                menuGroupList: [],
                pMode: progressModes.indeterminate,
                options: []
            };
        },

        components: {
            "menu-list": Menu,
            "brand": brand
        },

        computed:{
            ...mapGetters({
                "hasLogin": "hasLogin",
                "loadingInfo": "loadingInfo",
                "messageInfo": "messageInfo",
                "locale": "locale",
                "routerOptions": "router/routerOptions"
            })
        },

        watch: {
            $route(to){
                let findActiveArray = ArrayApi.getDataByAttr(this.routerOptions, 'name', to.name);
                if (this.hasLogin && findActiveArray.length === 0) {
                    let config = {
                        title: to.name,
                        name: to.name,
                        query: to.query
                    };
                    this.addTab(config);
                }
            },

            routerOptions() {
                setTimeout(() => {
                    this.checkPosition();
                }, 30);
            }
        },

        beforeCreate(){
        },

        created(){
        },

        methods: {
            ...mapActions({
                addTab: 'router/push',
                closeTab: 'router/remove',
                focusTab: 'router/focus'
            }),

            clickTab(option, event) {
                if (!option.active) {
                    $(event.target.parentNode).find('li').removeClass('active');
                    $(event.target).addClass('active');
                    this.focusTab(option);
                }
            },

            toggleMenu(){
                this.$store.commit('toggleRouteViewLeft');
            },

            exit(){
                this.$store.commit("confirm", {
                      message: this.$t('confirmExit'),
                      ok: () => {
                            this.onLogOut();
                      }
                });
//                Account.logout.execute({
//                    success: this.onLogOut
//                });
            },

            onLogOut(){
                this.$store.dispatch("logOut");
                this.$router.replace({name: "page.account.login"});
                location.reload();
            },

            //切换语言
            languageItemSwitch(locale){
                if (this.locale != locale){
                    this.$store.commit("locale");
                }
            },

            loadProgress(){},

            moveTab(change) {
                if (change < 0) {
                    this.moveToLeft();
                }else {
                    this.moveToRight();
                }
            },

            checkPosition() {
                let options = ArrayApi.getDataByAttr(this.routerOptions, 'closed', true, true);
                let optionIndex = ArrayApi.searchIndexByAttr(options, 'active', true);
                console.log(optionIndex);

                if (optionIndex > -1) {
                    this.resetPosition(this.$refs.tabSetCon.children[optionIndex]);
                }
            },

            //重新计算坐标
            resetPosition (dom) {
                if (!dom) {
                    return;
                }
                let w = 30, //左右两边的按钮
                    pageWidth = this.$refs.tabContainer.offsetWidth - w * 2,//页面宽度
                    container = this.$refs.tabSetCon,
                    totalWidth = container.offsetWidth,
                    left = dom.offsetLeft + dom.offsetWidth - w;// 内容右边距离左边的距

                if (totalWidth - w * 2 <= pageWidth){
                    this.setPosition(0);
                    return;
                }

                //超出了
                if (left > pageWidth){
                    this.setPosition( -1 * (left - pageWidth - container.offsetLeft) );
                }else if (left -  dom.offsetWidth < 0){
                    this.setPosition( -1 * (left -  dom.offsetWidth - container.offsetLeft));
                }
            },

            moveToLeft () {
                let leftDistance = 30;
                let rightDom = this.findRightDom();
                if (rightDom){
                    let left = -1 * this.$refs.tabSetCon.offsetLeft + rightDom.offsetLeft + rightDom.offsetWidth;
                    let x = this.$refs.tabContainer.offsetWidth - leftDistance - left;
                    x = x > 0 ? 0 : x;
                    this.setPosition(x);
                }
            },

            moveToRight () {
                let leftDistance = 30;
                let leftDom = this.findLeftDom();
                if (leftDom){
                    let x = this.$refs.tabSetCon.offsetLeft - leftDom.offsetLeft + leftDistance;
                    if (x > 0){
                        x = 0;
                    }
                    this.setPosition(x);
                }
            },

            findLeftDom () {
                let leftDistance = 30;
                let titles = this.$refs.tabSetCon.children, title;
                for (let i = 0, l = titles.length; i < l; i++) {
                    title = titles[i];
                    if (title.offsetLeft >= leftDistance){
                        return titles[i - 1];
                    }
                }
            },

            findRightDom () {
                let rightDistance = 30;
                let titles = this.$refs.tabSetCon.children,
                        title,
                        w = this.$refs.tabContainer.offsetWidth,
                        d;

                for (let i = titles.length - 1; i > -1; i--) {
                    title = titles[i];
                    d = title.offsetLeft + title.offsetWidth - w + rightDistance;
                    if (d <= 1){
                        return titles[i + 1];
                    }else if (d - title.offsetWidth < 0){
                        return titles[i];
                    }
                }
            },

            setPosition(x) {
                this.$refs.tabSetCon.style.marginLeft = x +'px';
            },
            
            initAction() {
                return this.data;
            }
        },

        mounted(){
            this.$store.commit("setRouterWrapper", this.$el.querySelector(".sk-router-wrapper"));
        },
        updated() {
        }
    }
</script>

<style lang="scss">
    @import "./assets/sass/base";
</style>

<style lang="scss" scoped>
    html, body, #app {
        width: 100%;
        height: 100%;
        background-color: #000;
    }

    .sk-home-top-part{
        top: 0px;
        right: 0px;
        height: 100px;
        position: fixed;
        z-index: 20000;
        background: #fff;
    }

    .sk-home-top-part{
        .top-part-con{
            table-layout: fixed;
            display: table;
            width: 100%;
            margin-top: 10px;

            .top-part{
                display: table-cell;
                vertical-align: middle;
            }
            .left-part{
                width: 100px;
                margin-top: 8px;
            }
            .right-part{
                text-align: right;
            }
        }


        .right-menu{
            display: inline-block;
            vertical-align: middle
        }
        .bar-progress-con{
            position: absolute;
            bottom: 0px;
            height: 2px;
            width: 100%;
            overflow: hidden;
            background-color: #000;
        }

        .custom-analysis{
            position: relative;
            overflow: hidden;
            .move-angle-btn{
                top: 0px;
                position: absolute;
                width: 30px;
                height: 100%;
                text-align: center;
                background-color: #eee;
                line-height: 50px;
                overflow: hidden;
                cursor: pointer;
                &.move-left{
                    left: 0px;
                }
                &.move-right{
                    right: 0px;
                }
            }
        }

        .tab-set{
            list-style: none;
            white-space: nowrap;
            width: auto;
            margin: 0px;
            padding: 0px 30px;
            display: inline-block;
            min-width: 100%;

            .tab-item{
                min-width: 80px;
                text-align: center;
                display: inline-block;
                height: 40px;
                line-height: 40px;
                color: #999;
                border-top: 1px solid #eee;
                border-right: 1px solid #eee;
                background-color: #fafafa;
                padding: 0 10px;
                cursor: default;
                user-select:none;
                transition-duration: 200ms;

                &:hover{
                    background-color: #eee;
                }

                &.active{
                    background-color: #555;
                    color: #fff;
                    border-color: #555;
                }

                .tab-title{
                    vertical-align: middle;
                }
                .tab-close{
                    vertical-align: middle;
                    cursor: pointer;
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                }
            }
        }
    }

    .sk-home-left-part{
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        height: 100%;
        overflow-x: hidden;
        background-color: #333;
        overflow-y: auto;
    }

    .sk-home-main-content {
        position: absolute;
        bottom: 0px;
        right: 0px;
        overflow: hidden;
    }

    .sk-router-wrapper{
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 20px;
        background-color: #fff;
    }
    .full-screen .sk-router-wrapper{
        padding: 0px;
    }
    .main-content{
        width: 90%;
        margin: auto;
    }
    .full-screen .main-content{
        width: 100%;
        min-width: 100%;
    }
</style>
