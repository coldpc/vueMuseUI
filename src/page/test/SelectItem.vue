<template>
    <div class="main-container">
        <div>
            <sk-data-set v-model="queryDs" :auto-create="true"></sk-data-set>
            
            <!--大类小类-->
            <sk-data-set v-model="bigCatalogDs" :auto-query="true"
                         :query-service="baseData.getRootCatalogs"></sk-data-set>
            <sk-data-set v-model="catalogDs" :auto-query="false" :bind="queryDs" bind-field="rootCatalogId"
                         bind-para-key="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>
            
            <sk-data-set v-model="countriesDs" auto-query :bind="queryDs"
                         :query-service="baseData.vendorCountries"></sk-data-set>
            
            <sk-data-set v-model="cityDs" :auto-query="false" :bind="queryDs" bind-field="countryId"
                         :query-service="baseData.getCityListByCountryId"></sk-data-set>
            
            <!--查询商品的table-->
            <sk-data-set v-model="itemListDs" :before-query="beforeRefreshItemTable" pagination page-size="10" :auto-query="true" :query-bind="queryDs"
                         :query-service="itemModule.getItems"></sk-data-set>
        </div>
        
        <div style="margin-top: 30px;">
            <sk-form :bind="queryDs">
                <sk-fold :title="$t('queryPara')">
                    <sk-row>
                        <sk-col :size="2">
                            <sk-select :null-title="$t('global')" :bind="queryDs"
                                       :label="$t('country')" name="countryId" :option-bind="countriesDs"
                                       display-field="countryName" value-field="countryId"></sk-select>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-select :bind="queryDs" :null-title="$t('wholeCountry')" :label="$t('city')" name="cityId"
                                       display-field="cityName" value-field="cityId" :option-bind="cityDs"></sk-select>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-select :option-bind="bigCatalogDs" display-field="catalogName" value-field="catalogId"
                                       :label="$t('category')" name="rootCatalogId"></sk-select>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-select :label="$t('subCategory')" :multiple="false" :option-bind="catalogDs" value-field="catalogId"
                                       display-field="catalogName" name="catalogId"></sk-select>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-text-input :label="$t('itemModel')" name="itemModel"></sk-text-input>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-text-input :label="$t('itemName')" name="itemName"></sk-text-input>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="1">
                            <div class="query-btn-con" style="margin-top: 20px;text-align: right;">
                                <sk-button primary :label="$t('query')" action="query" :bind="itemListDs"></sk-button>
                                <sk-button action="reset" :label="$t('clear')"></sk-button>
                            </div>
                        </sk-col>
                    </sk-row>
                </sk-fold>
            </sk-form>
        </div>
        
        <div>
            <sk-table ref="itemListTable" :bind="itemListDs" :show-checkbox="canEdit">
                <div slot="buttons">
                    <sk-button label="确定" action="patchOnline" @click="confirmSelect" primary></sk-button>
                    <sk-button label="返回" action="patchOff" @click="back"></sk-button>
                </div>
                <div slot="row">
                    <sk-column name="index" :title="$t('lineNo')" width="100px" align="center" :formatter="renderIndex"></sk-column>
                    <sk-column name="headAttacheList" view-type="img" align="center" :title="$t('thImg')"></sk-column>
                    <sk-column name="itemId" :title="$t('itemModelName')" :formatter="renderItemInfo"></sk-column>
                    <sk-column name="catalogMappingList" :title="$t('itemCategory')" :formatter="renderCatalogs"></sk-column>
                    <sk-column name="unit" :title="$t('currency')"></sk-column>
                    <sk-column name="factPrice" view-type="money" :title="$t('price')" align="center"></sk-column>
                    <sk-column :if-hide="!isStore" name="shelfFlag" :title="$t('status')" :formatter="renderShelf" align="center"></sk-column>
                </div>
            </sk-table>
        </div>
    </div>
</template>


<script type="text/javascript">
    import baseData from "@/lib/dataModules/baseData"
    import itemModule from "@/lib/dataModules/item"
    import ArrayApi from "../../lib/utils/ArrayApi"
    
    export default{
        data(){
            return {
                
                ifHideOperation: true,
                
                countryId: null, //国家id
                storeId: null, //商店id
                
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
                queryData: {}
            };
        },
        
        computed: {
        },
        
        methods: {
            //渲染操作
            renderOperation(v, index, record){
                let isStore =  this.isStore;
                let shelfFlag = record.getValue("shelfFlag");
                
                //无论如何都是可编辑的
                let html = "<a class='edit'>" + this.$t('edit') + "</a>";
                
                //是否采用门店作为查询条件
                if (isStore){
                    if (shelfFlag == 'OFFLINE') {
                        //下架的状态才能上架
                        html += "<br><a class='online'>" + this.$t('online') + "</a>";
                    }else {
                        html += "<br><a class='offline'>" + this.$t('offline') + "</a>";
                    }
                    
                    //没有分配国家可以删除
                    if (!(record.getValue("assignCountryNum") > 0)){
                        html += "<br><a class='delete'>" + this.$t('delete') + "</a>";
                    }
                }else{
                    //如果国家地区条件查询 没有分配门店数即为可删除
                    if (!((record.getValue("assignStoryNum") > 0) || record.getValue("assignCountryNum") > 0)){
                        html += "<br><a class='delete'>" + this.$t('delete') + "</a>";
                    }
                    
                    html += "<br><a class='assignDetail'>" + this.$t('assignDetail') + "</a>";
                }
                return html;
            },
    
            confirmSelect(){
                let selectedData = this.itemListDs.getSelectedData();
                console.log(selectedData);
                this.$emit("select", selectedData);
            },
            
            back(){
                this.$emit("back");
            }
        }
    }
</script>
