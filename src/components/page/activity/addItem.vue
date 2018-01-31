<template>
    <sk-win ref="win" width="70%" @onHide="onHideWin">
        <div class="main-container">
            <div class="service">
                <sk-data-set v-model="queryDs" :auto-create="true"></sk-data-set>
    
                <!--大类小类-->
                <sk-data-set v-model="bigCatalogDs" auto-query :query-service="baseData.getRootCatalogs"></sk-data-set>
                <sk-data-set v-model="catalogDs" :auto-query="false" :bind="queryDs" bind-field="rootCatalogId"
                             bind-para-key="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>
    
                <sk-data-set v-model="countriesDs" auto-query :bind="queryDs"
                             :query-service="baseData.vendorCountries"></sk-data-set>
    
                <sk-data-set v-model="cityDs" :auto-query="false" :bind="queryDs" bind-field="countryId"
                             :query-service="baseData.getCityListByCountryId"></sk-data-set>
    
                <!--查询商品的table-->
                <sk-data-set v-model="itemListDs" pagination page-size="20" :auto-query="true" :query-bind="queryDs"
                             :query-service="itemModule.getItemsForActivitySelect"></sk-data-set>
            </div>
            
            <sk-form :bind="queryDs">
                <sk-row>
                    <sk-col :size="4">
                        <sk-select :null-title="$t('global')" :bind="queryDs"
                                   :label="$t('country')" name="countryId" :option-bind="countriesDs"
                                   display-field="countryName" value-field="countryId"></sk-select>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-select :bind="queryDs" :null-title="$t('wholeCountry')" :label="$t('city')" name="cityId"
                                   display-field="cityName" value-field="cityId" :option-bind="cityDs"></sk-select>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-select :option-bind="bigCatalogDs" display-field="catalogName" value-field="catalogId"
                                   :label="$t('category')" name="rootCatalogId"></sk-select>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-select :label="$t('subCategory')" :multiple="false" :option-bind="catalogDs" value-field="catalogId"
                                   display-field="catalogName" name="catalogId"></sk-select>
                    </sk-col>
                </sk-row>
        
                <sk-row>
                    <sk-col :size="4">
                        <sk-text-input :label="$t('itemModel')" name="itemModel"></sk-text-input>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-text-input :label="$t('itemName')" name="itemName"></sk-text-input>
                    </sk-col>
                    <sk-col :size="2">
                        <div class="query-btn-con" style="margin-top: 20px;text-align: right;">
                            <!--<sk-button primary :label="$t('query')" action="query" :bind="itemListDs"></sk-button>-->
                            <sk-button primary :label="$t('query')" @click="queryItemListDs"></sk-button>
                            <sk-button action="reset" :label="$t('clear')"></sk-button>
                        </div>
                    </sk-col>
                </sk-row>
            </sk-form>
    
            <div slot="buttons">
                <sk-button :label="$t('save')" action="patchOnline" @click="save" primary></sk-button>
                <sk-button :label="$t('back')" action="patchOff" @click="hide"></sk-button>
            </div>
            <div style="max-height: 300px;overflow-y: auto;">
                <sk-table ref="itemListTable" :bind="itemListDs" show-checkbox>
                    <div slot="row">
                        <sk-column name="headAttacheList" view-type="img" align="center" :title="$t('thImg')"></sk-column>
                        <sk-column name="itemModel" :title="$t('itemModelName')"></sk-column>
                        <sk-column name="itemName" :title="$t('itemName')"></sk-column>
                    </div>
                </sk-table>
            </div>
            
        </div>
    </sk-win>
</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import itemModule from "@/lib/dataModules/item"
    import ArrayApi from "@/lib/utils/ArrayApi"
    import activityServiceModule from "@/lib/dataModules/activity"
    
    export default{
        data(){
            return {
                queryDs: null, //基本信息
                itemListDs: null,
    
                bigCatalogDs: null, //大类
                catalogDs: null, //小类
                countriesDs: null,
                cityDs: null,
    
                baseData,
                itemModule,
    
                queryType: "brand", //brand store country
                gradeData: null, //权限数据
                queryData: {},
    
                activityItemMappings: null,
                activityData: null
            }
        },
        
        props: {
            activityId: {},
            storeId: {}
        },
        
        methods: {
            onHideWin(){
            },
            
            show(activityData, activityItemMappings) {
                this.$refs.win.show();
                this.activityItemMappings = activityItemMappings;
                this.activityData = activityData;
                this.itemListDs.reset();
                let currentRecord = this.queryDs.getCurrentRecord();
                currentRecord.setValue("storeId", this.storeId);
                currentRecord.setValue("activityId", this.activityId);
            },
            
            hide() {
                this.$refs.win.hide();
            },
    
            save() {
                activityServiceModule.saveActivityItemMappings.execute({
                    data: this.getSaveData(),
                    success: function () {
                        this.hide();
                        this.$store.commit("message", this.$t('succeedSave'));
                        this.$emit("updated");
                    }.bind(this)
                });
            },

            queryItemListDs() {
                this.itemListDs.query({storeId: this.storeId, activityId: this.activityId});
            },
    
            // 处理加载的参数配置
            getSaveData: function () {
                let activityData = this.activityData;
                activityData.activityItemMappings = this.itemListDs.getSelectedData().concat(this.activityItemMappings);
                return activityData;
            }
        },
        
        created(){},
        watch: {},
        computed: {},
        mounted(){}
    }
</script>

<style>
    .mu-radio-wrapper .mu-radio-label{
        font-size: 12px;
    }
</style>
