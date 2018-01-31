<template>
    <div>
        <h2 class="title">
            <span>查询条件</span>
            <span class="triangle" @click="toggleSearchMenu">△</span>
        </h2>
        <transition name="slideUp">
            <div v-show="showFlag">
                <sk-row gutter>
                    <sk-col size="2">
                        <sk-select hint-text="请选择" label="国家地区" :bind="queryDs" name="countryId" :option-bind="vendorCountries" display-field="countryName" value-field="countryId"></sk-select>
                    </sk-col>
                    <sk-col size="2">
                        <sk-text-input hintText="活动名称" label="活动名称" :bind="queryDs" name="activeName"></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row gutter>
                    <sk-col size="4">
                        <sk-date-picker value="" :bind="queryDs" name="startDate" label="活动开始时间" hintText="开始时间"></sk-date-picker>
                    </sk-col>
                    <sk-col size="4">
                        <sk-date-picker bind-min-date="startDate" value="" :bind="queryDs" name="endDate" label="活动结束时间" hintText="结束时间"></sk-date-picker>
                    </sk-col>
                    <sk-col size="2">
                        <sk-text-input hintText="地址" label="地址" :bind="queryDs" name="address"></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row gutter>
                    <sk-col size="2">
                        <h5 class="sub-title">是否上架</h5>
                        <sk-checkbox :bind="queryDs" name="openFlagOn" label="上架"></sk-checkbox>
                        <sk-checkbox :bind="queryDs" name="openFlagOff" label="下架"></sk-checkbox>
                    </sk-col>

                    <sk-col size="2">
                        <h5 class="sub-title">状态</h5>
                        <sk-checkbox :bind="queryDs" name="notOpen" label="未开始"></sk-checkbox>
                        <sk-checkbox :bind="queryDs" name="processing" label="进行中"></sk-checkbox>
                        <sk-checkbox :bind="queryDs" name="finished" label="已结束"></sk-checkbox>
                    </sk-col>
                </sk-row>

                <sk-row gutter class="btn-group">
                    <sk-col size="2"></sk-col>
                    <sk-col size="2">
                        <sk-button label="搜索" :bind="queryDs"></sk-button>
                        <sk-button label="清空" :bind="queryDs"></sk-button>
                    </sk-col>
                </sk-row>
            </div>

        </transition>
    </div>

</template>

<script>
    import Ds from "@/lib/utils/DataSet"
    import baseData from "@/lib/dataModules/baseData"

    export default {
        data(){
            var queryDs = window.test = new Ds({
                vue: this,
                autoCreate: true,
                name: "currentData"
            });

            var vendorCountries = new Ds({
                queryService: baseData.vendorCountries,
                autoQuery: false
            });

            return {
                queryDs,

                vendorCountries,

                currentData: {},

                showFlag: true
            }
        },

        methods: {
            toggleSearchMenu(){
                this.showFlag = !this.showFlag;
            }


        },

        created(){
            this.vendorCountries.query();
        },
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