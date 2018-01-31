<template>
<div class="main-container">
<sk-fold :title="$t('storeInformation')">
    <sk-data-set v-model="storeInfo" :query-service="store.getStoreByStoreId" :parse-query-para="storeInfoParams" auto-query></sk-data-set>
    <sk-table :bind="storeInfo" selectable >
        <div slot="row">
            <sk-column :formatter="forStore" name="storeName" :title="$t('storeName')"></sk-column>
            <sk-column :formatter="forCity" name="city" :title="$t('city')"></sk-column>
            <sk-column name="address" :title="$t('address')"></sk-column>
            <sk-column :formatter="forTime" name="openingTimeFrom" :title="$t('busTime')"></sk-column>
        </div>
    </sk-table>
</sk-fold>

<sk-fold :title="$t('addedProducts')">
    <sk-data-set v-model="storeItemInfo" :query-service="store.getItems" page-size="10" :parse-query-para="storeInfoParams" pagination auto-query></sk-data-set>
    <sk-table :bind="storeItemInfo" selectable >
        <div slot="row">
            <sk-column :formatter="forPic" name="headAttacheList" :title="$t('thImg')" align="center"></sk-column>
            <sk-column :formatter="forName" @cell-click="goItem" name="itemName" :title="$t('productName')"></sk-column>
            <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
            <!--<sk-column :formatter="forCatalog" name="catalogMappingList" :title="$t('productCategory')"></sk-column>-->
            <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
            <sk-column name="storePrice" :title="$t('productPrice')" view-type="money" align="center"></sk-column>
            <sk-column :formatter="forOperate" @cell-click="showSKU" name="itemId" :title="$t('operation')" align="center"></sk-column>
        </div>
    </sk-table>
</sk-fold>

<sk-fold :title="$t('addStoreProduct')">
    <sk-data-set v-model="queryDs" auto-create></sk-data-set>
    <sk-data-set v-model="rootCatalogs" :query-service="baseData.getRootCatalogs" auto-query></sk-data-set>
    <sk-data-set v-model="catalogs" :bind="queryDs" bind-field="rootCatalogId" bind-para-key="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>
    <sk-data-set v-model="getItems"  :bind="queryDs" auto-query pagination page-size="10" :query-service="store.getItems" :query-bind="queryDs"></sk-data-set>
    <sk-form :bind="queryDs">
        <sk-row>
            <sk-col :size="2">
                <sk-select value="" hint-text="" :label="$t('productCategoryFilter')" :bind="queryDs" name="rootCatalogId" :option-bind="rootCatalogs" display-field="catalogName" value-field="catalogId"></sk-select>
            </sk-col>

            <sk-col :size="2">
                <sk-select value="" hint-text="" :label="$t('subFilter')" :bind="queryDs" name="catalogId" :option-bind="catalogs" display-field="catalogName" value-field="catalogId"></sk-select>
            </sk-col>
        </sk-row>
        <sk-row>
            <sk-col :size="2">
                <sk-text-input value="" hint-text="" :label="$t('productCode')" name="itemModel" ></sk-text-input>
            </sk-col>

            <sk-col :size="2">
                <sk-text-input value="" hint-text="" :label="$t('productName')" name="itemName" ></sk-text-input>
            </sk-col>

        </sk-row>

        <sk-row class="btn-group">
            <sk-col :size="1" style="text-align: right">
                <sk-button :label="$t('search')" :bind="getItems" action="query" primary></sk-button>
                <sk-button :label="$t('clear')"  action="reset"></sk-button>
            </sk-col>
        </sk-row>
    </sk-form>
</sk-fold>
    <!-- 取消添加商品的功能 -->
    <!--<sk-row class="btn-group">-->
        <!--<sk-col :size="1">-->
            <!--<sk-button :label="$t('submit')"  @click="submitRelate" primary></sk-button>-->
        <!--</sk-col>-->
    <!--</sk-row>-->
    <sk-table :bind="getItems" selectable ref="itemListTable" >
        <div slot="row">
            <sk-column :formatter="forPic" name="headAttacheList" :title="$t('thImg')" align="center"></sk-column>
            <sk-column :formatter="forName" @cell-click="goItem" name="itemName" :title="$t('productName')" ></sk-column>
            <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
            <!--<sk-column :formatter="forCatalog" name="catalogMappingList" :title="$t('productCategory')"></sk-column>-->
            <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
            <sk-column name="storePrice" :title="$t('productPrice')" view-type="money" align="center"></sk-column>
            <sk-column :formatter="forOperate" @cell-click="showSKU" name="itemId" :title="$t('operation')" align="center"></sk-column>
        </div>
    </sk-table>
    <sk-sku ref="sku" :query-service="activity.getSkusByItemId" :countryName="countryName" :activityName="activityName"></sk-sku>
</div>
</template>


<script>
    import baseData from "@/lib/dataModules/baseData"
    import store from "@/lib/dataModules/store"
    import sku from "@/components/skirt/SkuDetail";
    import activity from "@/lib/dataModules/activity"
export default{
    components: {
        SkSku: sku
    },
    data(){
        return{
            storeInfo: null,
            store: store,
            baseData: baseData,
            activity:activity,
            storeItemInfo: null,
            queryDs:null,
            rootCatalogs: null,
            catalogs:null,
            getItems:null,
            countryName:"",
            activityName:""
        }
    },
    computed:{
    
    },
    methods:{
        storeInfoParams(){
            return {storeId: this.$route.query.id}
        },
        forName(v, index, record){
            return "<a class='goItem' itemId='"+ record.getValue("itemId") +"' title=''>"+v+"</a>"
        },
        forStore(v){
            this.activityName= v;
            return v
        },
        forCity(v, i, c){
            this.countryName= c.getValue("country").countryName + "-"+ v.cityName;
            return ( c.getValue("country").countryName + "-"+ v.cityName )
        },
        forTime(v, i, c){
            return (v + "-" + c.getValue("openingTimeTo"))
        },
        forPic(v){
            return "<div class='s-img' style=' width: 60px;height: 60px;overflow: hidden;display: inline-block;'><img style='height: 100%' src='" + v[0].path+"'/></div>"
        },
        forCatalog(v){
            v = v || [];
            let catalog="";
            for(let i=0, j=v.length; i<j; i++){
                catalog += (v[i].catalogName+" ")
            }
            return catalog
        },
        forOperate(v){
            return "<a class='show-SKU' title=''>"+this.$t('skuDetail')+"</a>"
        },
        showSKU(e, v, name, index, record){
            let itemId = record.getValue("itemId");
            this.$refs.sku.show( itemId, record.getValue("itemName"));
        },
        goItem(e, v, name, index, record){
            this.$router.push({name: "page.item.maintain", query: {type:"detail", itemId: record.getValue("itemId")}});
        },
        submitRelate(){
            let msg = this.$t('addProducts');

                let selectItem = this.$refs.itemListTable.getSelectData(),
                    array = [], itemIds = "";
                
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].itemId);
                }
                if (array.length == 0){
                    return;
                }
                itemIds = array.join(",");
                store.relateItems.execute({
                    data: {
                        storeId:this.$route.query.id,
                        itemIds:itemIds
                    },
                    success:function(data){
                        this.$store.commit("message", this.$t('addSuccess'));
                        this.$refs.itemListTable.selectAll(false);
                        this.storeItemInfo.query();
                    }.bind(this)
                })
        }
    },
    beforeMount (){
    
    }
}
</script>