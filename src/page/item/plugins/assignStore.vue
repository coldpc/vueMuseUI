<template>
    <div class="main-container">
        <div class="data-sets-con">
            <sk-data-set :query-para="{itemIds: this.ids}" :query-mask="{info: '加载中...'}"
                         :query-service="itemModule.getAssignStoreDetail" auto-query
                         @load="loadAssignDetail"></sk-data-set>
            
            <!--货币-->
            <sk-data-set v-model="currencyDs" :query-service="baseData.getCurrencyList" auto-query></sk-data-set>
            
            <sk-data-set v-model="assignedDs"></sk-data-set>
            <sk-data-set v-model="unAssignedDs"></sk-data-set>
            <sk-data-set v-model="todoItemsDs" @ready="onItemsDsReady"></sk-data-set>
            <sk-data-set v-model="skuEditDs"></sk-data-set>
        </div>
    
        <sk-fold :title="$t('assignItemsToStore')">
            <div class="checked-part">
                <sk-checkbox v-model="hasShelfFlag" :label="$t('onlineItemMeanwhile')"></sk-checkbox>
            </div>
            
            <sk-row>
                <sk-col width="40">
                    <sk-table :bind="unAssignedDs" show-checkbox>
                        <div slot="row">
                            <sk-column align="center" name="storeName" width="25%" :title="$t('tobeAssignStore')"></sk-column>
                        </div>
                    </sk-table>
                </sk-col>
                
                <sk-col width="20">
                    <div class="assign-btn-con">
                        <sk-button icon="arrow_forward" @click="assignCountry"></sk-button>
                    </div>
                    <div class="assign-btn-con">
                        <sk-button icon="arrow_back" @click="removeAssign"></sk-button>
                    </div>
                </sk-col>
                
                <sk-col width="40">
                    <sk-table ref="chooseCountryTable" :bind="assignedDs" show-checkbox>
                        <div slot="row">
                            <sk-column align="center" name="storeName" width="25%" :title="$t('alreadyAssignStore')"></sk-column>
                        </div>
                    </sk-table>
                </sk-col>
            </sk-row>
        </sk-fold>
        
        <sk-fold :title="$t('tobeAssignItems')">
            <sk-table show-line-number :bind="todoItemsDs" show-checkbox>
                <div slot="row">
                    <sk-column align="center" name="headAttacheList" width="100px" view-type="img" :title="$t('thImg')"></sk-column>
                    <sk-column align="center" name="itemName" :title="$t('itemName')"></sk-column>
                    <sk-column align="center" name="itemModel" :title="$t('itemModel')"></sk-column>
                    <sk-column align="center" name="catalogMappingList" :title="$t('subCategory')"
                               :formatter="renderCatalog"></sk-column>
                    <sk-column align="center" width="150px" name="unit" editable edit-type="select"
                               :option-bind="currencyDs" display-field="exchangeUnit" value-field="exchangeUnit"
                               :title="$t('currency')"></sk-column>
                    <sk-column align="center" name="storePrice" editable edit-type="money" :title="$t('price')"></sk-column>
                    <sk-column align="center" name="skuList" :title="$t('skuSet')" :formatter="renderSkuEdit" @cell-click="onClickEditSku"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        
        <sk-win :title="$t('skuDetail')" ref="editSkuWin" width="80%">
            <div>
                <div class="item-info-list">
                    <div class="info">
                        <label class="prompt">{{$t('country')}}：</label>
                        <span>{{skuData.storeName||$t('noData')}}</span>
                    </div>
                    <div class="info">
                        <label class="prompt">{{$t('itemName')}}：</label>
                        <span>{{skuData.itemName}}</span>
                    </div>
                    <div class="info">
                        <label class="prompt">{{$t('itemModel')}}：</label>
                        <span>{{skuData.itemModel}}</span>
                    </div>
                    <div class="info">
                        <label class="prompt">{{$t('currency')}}：</label>
                        <span>{{skuData.unit}}</span>
                    </div>
                    <div class="info">
                        <label class="prompt">{{$t('price')}}：</label>
                        <span>{{skuData.storePrice}}</span>
                    </div>
                </div>
            </div>
            <div class="edit-sku-div" :style="{maxHeight: countHeight}">
                <sk-table :bind="skuEditDs">
                    <div slot="row">
                        <sk-column align="center" name="skuName" :title="$t('skuName')"></sk-column>
                        <sk-column align="center" name="skuModel":title="$t('itemModel')"></sk-column>
                        <sk-column align="center" width="150px" name="unit" editable edit-type="select" :option-bind="currencyDs" display-field="exchangeUnit" value-field="exchangeUnit" :title="$t('currency')"></sk-column>
                        <sk-column align="center" name="skuPrice" editable edit-type="money" :title="$t('price')"></sk-column>
                        <sk-column align="center" name="headAttachList" width="100px" view-type="img"  :title="$t('thImg')"></sk-column>
                    </div>
                </sk-table>
            </div>
        </sk-win>
    </div>
</template>


<script type="text/javascript">
    import baseData from "@/lib/dataModules/baseData"
    import itemModule from "@/lib/dataModules/item"
    import ArrayApi from "@/lib/utils/ArrayApi"
    
    export default{
        data(){
            window.test = this;
            return {
                hasShelfFlag: true,
                
                assignedDs: null,
                unAssignedDs: null,
                todoItemsDs: null,
                currencyDs: null,
                skuEditDs: null,
    
                countHeight: "400px",
                
                ids: this.$route.query.ids,
                
                skuData: {},
                itemModule,
                baseData
            };
        },
        
        created(){
        },
        
        methods: {
            renderSkuEdit(){
                return "<a class='edit-sku'>" + this.$t("skuDetail") + "</a>"
            },
            
            renderCatalog(v){
                return ArrayApi.getFieldValue(v, "catalogName", ",");
            },
    
            onClickEditSku(e, v, name, index, record){
                if (e.target.className == "edit-sku"){
                    this.skuEditDs.setData(v);
                    this.$refs.editSkuWin.show();
                    this.skuData = record.getData();
                }
            },
            
            //监听item的修改
            onItemsDsReady(ds){
                ds.addEventListener(ds.event.update, this.updateSkuValue);
            },
            updateSkuValue(value, key, record){
                var updateKey;
                if (key == "storePrice"){
                    updateKey = "skuPrice"
                }else if (key == "unit"){
                    updateKey = "unit"
                }
                
                let skuList = record.getData().skuList;
                for (let i = 0, l = skuList.length; i < l; i++) {
                    skuList[i][updateKey] = value;
                }
            },
            
            //加载数据
            loadAssignDetail(records){
                let data = records[0].getData();
                this.assignedDs.setData(data.chooseStores);
                this.unAssignedDs.setData(data.toDoStores);
                this.todoItemsDs.setData(data.itemList);
                
            },
            
            //分配国家
            assignCountry() {
                let data = this.unAssignedDs.getSelectedData(); // 获取数据
                if (!data || data.length == 0) {
                    return;
                }
                
                //后台分配国家
                itemModule.assignStore.execute({
                    data: {
                        hasShelfFlag: this.hasShelfFlag,
                        optStores: ArrayApi.getFieldsValue(data, ["storeId"]),
                        itemList: this.getAssignSubmitData()
                    },
                    mask: {
                        info: ""
                    },
                    success: function () {
                        //移除
                        let records = this.unAssignedDs.delete();
                        
                        //添加
                        this.assignedDs.addMultiple(this.assignedDs.getRecordsData(records));
                    }.bind(this)
                });
            },
    
            removeAssign: function () {
                let data = this.assignedDs.getSelectedData(); // 获取数据
                if (!data || data.length == 0) {
                    return;
                }
                
                //后台移除国家
                itemModule.unAssignStore.execute({
                    data: {
                        hasShelfFlag: this.hasShelfFlag,
                        optStores: ArrayApi.getFieldsValue(data, ["storeId"]),
                        itemList: this.getAssignSubmitData()
                    },
                    mask: {
                        info: ""
                    },
                    success: function () {
                        //移除
                        let records = this.assignedDs.delete();
    
                        //添加
                        this.unAssignedDs.addMultiple(this.unAssignedDs.getRecordsData(records));
                    }.bind(this)
                });
            },
            
            getAssignSubmitData() {
                var itemList = this.$base.deepCopy(this.todoItemsDs.getAllData()),
                    skuList;
      
                itemList = ArrayApi.getFieldsValue(itemList, ["skuList", "itemId", "storePrice", "unit"]);
                
                for (var i = 0, l = itemList.length; i < l; i++) {
                    skuList = itemList[i].skuList;
                    itemList[i].skuList = ArrayApi.getFieldsValue(skuList, ["skuId", "itemId", "skuPrice", "unit"]);
                }
                return itemList;
            },
        }
    }
</script>


<style scoped lang="scss">
    .assign-btn-con {
        text-align: center;
        margin-top: 10px;
    }
    
    .assign-btn-con + .assign-btn-con {
        margin-top: 20px;
    }
    .item-info-list{
        overflow: hidden;
        color: #999;
    }
    .item-info-list{
        .info{
            float: left;
        }
        .info + .info{
            margin-left: 20px;
        }
        .info .prompt{
            color: #aaa;
        }
    }
    .edit-sku-div{
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>