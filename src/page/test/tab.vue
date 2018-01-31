<template>
    <div>
        <sk-tab>
            <div slot="titles">
                <sk-tab-title>如果</sk-tab-title>
                <sk-tab-title>可以</sk-tab-title>
                <sk-tab-title>的话</sk-tab-title>
            </div>
            <div slot="body">
                <sk-tab-content>
                    <sk-tree :source="source"></sk-tree>
                </sk-tab-content>
                <sk-tab-content><div>231</div></sk-tab-content>
                <sk-tab-content><div>331</div></sk-tab-content>
            </div>
        </sk-tab>
    </div>
</template>

<script>
    import Vue from "vue"
    import Ds from "@/lib/utils/DataSet"
    import baseData from "@/lib/dataModules/baseData"
    import Tab from "@/components/skirt/Tab"
    import TabTitle from "@/components/skirt/TabTitle"
    import TabContent from "@/components/skirt/TabContent"
    import Tree from "@/components/skirt/Tree"

    Vue.component(Tab.name, Tab);
    Vue.component(TabTitle.name, TabTitle);
    Vue.component(TabContent.name, TabContent);
    Vue.component(Tree.name, Tree);

    export default {
        data(){
            window.test = this;
            return {
                source: [{
                    title: "test",
                    folder: true,
                    children: [{
                        title: "aa"
                    }]
                }]
            }
        },

        methods: {

        },
        created(){},
        
        mounted: function () {
        }
    }
</script>

<style lang="scss" scoped>
    .slideUp-enter-active,
    .slideUp-leave-active {
        transition: all 0.5s;
        opacity: 1;
        /*height: 100%;*/
    }

    .slideUp-enter,
    .slideUp-leave-active {
        opacity: 0;
        /*height: 0;*/
    }

    .title {
        padding-bottom: 10px;
        border-bottom: 1px solid #000;
    }

    .btn-group {
        text-align: right;
        margin-right: 100px;
    }

</style>