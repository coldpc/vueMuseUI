<template>
    <div class="main-container">
        <div class="data-sets-con">
            <sk-data-set :query-para="{itemId: this.itemId, storeId: this.storeId, countryId: this.countryId}" :query-mask="{info: $t('loading')}"
                         :query-service="itemModule.getItemAssignDetail" auto-query
                         @load="loadAssignDetail"></sk-data-set>
            
            <sk-data-set v-model="vendorGradeDs" :auto-query="false" :query-service="baseData.getVendorGrade"></sk-data-set>
        </div>
        
        <sk-fold :title="$t('baseInfo')">
            <div class="base-info-item">
                <sk-row>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('itemName')" :value="item.itemName"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('itemModel')" :value="item.itemModel"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" ></sk-col>
                </sk-row>
            </div>
    
            <div class="base-info-item">
                <sk-row>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('category')" :value="item.parentCatalogName"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('subCategory')" :value="item.subCategoryDisplay"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('currency')" :value="item.unit"></sk-text-view>
                    </sk-col>
                </sk-row>
            </div>
    
            <div class="base-info-item">
                <sk-row>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('price')" :value="item.storePrice"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('tag')" :value="item.itemName"></sk-text-view>
                    </sk-col>
                    <sk-col :size="3" >
                        <sk-text-view :label="$t('remark')" :value="item.remark"></sk-text-view>
                    </sk-col>
                </sk-row>
            </div>
        </sk-fold>
        
        <sk-fold :title="$t('assignInfo')">
            <table class="view-table parent-td assigned-table">
                <thead>
                    <td class="expand-td"></td>
                    <td class="index-td">NO</td>
                    <td class="country-td">{{$t('assignCountryNum')}}</td>
                    <td class="store-td">{{$t('assignStoreNum')}}</td>
                    <td class="on-store-td">{{$t('onlineStoreNum')}}</td>
                    <td class="option-td">{{$t('operation')}}</td>
                </thead>
                <tbody v-if="assignedData && assignedData.length > 0">
                    <template class="parent-row" v-for="(item,index) in assignedData">
                        <tr>
                            <td class="expand-td">
                                <span v-if="item && item.storeAssignDtos && item.storeAssignDtos.length > 0" @click="expandView(index, item)">
                                    <mu-icon-button :id="'expanded-btn-' + item.crid" v-show="!item.expanded" icon="add"></mu-icon-button>
                                    <mu-icon-button :id="'unexpanded-btn-' + item.crid" v-show="item.expanded" icon="remove"></mu-icon-button>
                                </span>
                            </td>
                            <td class="index-td">{{index + 1}}</td>
                            <td class="country-td">{{!!item.country ? (item.country.countryName + " " + item.country.enName) : ""}}</td>
                            <td class="store-td">{{item.assignStoryNum}}</td>
                            <td class="on-store-td">{{item.onStoreNum}}</td>
                            <td class="option-td">
                                <!--<a @click="toggleRow(index,item)">查看门店</a>-->
                                <a @click="cancelAssignOneCountry(index,item)">{{$t('delete')}}</a>
                            </td>
                        </tr>
                        <template v-if="item.expanded">
                            <tr :id="'expand-child-row-' + item.crid" class="expand-child-row" v-for="(store, ind) in item.storeAssignDtos" :key="'child' + ind">
                                <td class="expand-td"></td>
                                <td class="index-td">{{(index + 1) + '.' + (ind + 1)}}</td>
                                <td class="country-td">{{!!store.store ? (store.store.storeName ) : ""}}</td>
                                <td colspan="2">
                                    <span v-if="store.shelfFlag=='ONLINE'">{{$t('online')}}</span>
                                    <span v-else>{{$t('offline')}}</span>
                                </td>
                                <td height="1px" class="option-td">
                                    <a v-if="store.shelfFlag=='ONLINE'" @click="offline(index,store)">{{$t('offline')}}</a>
                                    <a v-else @click="online(index,store)">{{$t('online')}}</a>
                                    <a v-if="store.shelfFlag=='OFFLINE'" @click="deleteItem(index,ind,store)">{{$t('delete')}}</a>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td style="text-align: center" colspan="6">{{$t('noData')}}</td>
                    </tr>
                </tbody>
            </table>
        </sk-fold>
        
        <sk-fold :title="$t('unAssignInfo')">
            <div style="padding-bottom: 10px;" v-if="!vendorGradeData.hasStore">
                <!--分配门店-->
                <sk-button v-if="type == 'country'" primary :label="$t('assign')" @click="gotoAssignStore"></sk-button>
                <!--分配国家-->
                <sk-button v-else primary :label="$t('assign')" @click="gotoAssignCountry"></sk-button>
            </div>
            <sk-row>
                <sk-col width="100">
                    <table class="view-table">
                        <thead>
                            <td class="index-td">NO</td>
                            <td class="name-td">{{$t('countryArea')}}</td>
                            <td class="name-td">{{$t('store')}}</td>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in unAssignData">
                                <td class="index-td">{{index + 1}}</td>
                                <td class="name-td">{{item.country.countryName + " " + item.country.enName}}</td>
                                <td class="name-td">{{item.store.storeName}}</td>
                            </tr>
                        </tbody>
                    </table>
                </sk-col>
            </sk-row>
        </sk-fold>
    </div>
</template>


<script type="text/javascript">
    import itemModule from "@/lib/dataModules/item"
    import baseData from "@/lib/dataModules/baseData"
    import ArrayApi from "@/lib/utils/ArrayApi"
    
    export default{
        data(){
            window.test = this;
            return {
                itemId: this.$route.query.itemId,
                type: this.$route.query.type,
                storeId: this.$route.query.storeId,
                countryId: this.$route.query.countryId,
                
                item: {},
                
                assignedData: {},
                unAssignData: {},
    
                vendorGradeData: {},
                vendorGradeDs: null,
                
                rowExpandedController: {},
    
                itemModule,
                baseData
            };
        },
        
        created(){
        },
        
        methods: {
            //加载账号权限数据
            onLoadVendorData(records){
                this.vendorGradeData = records[0].getData();
            },
            
            //加载数据
            loadAssignDetail(records){
                let data = records[0].getData();
                this.item = data.item;
                this.item.subCategoryDisplay = this.item.catalogNameList.join(",");
                
                this.unAssignData = data.unAssignDtos;
                
                let assignedData = this.assignedData = data.assignedDtos;
                let sequence = parseInt(Math.random() * 10000) + 10000;
                for (let i = 0, l = assignedData.length; i < l; i++) {
                    assignedData[i].crid = sequence + 1;
                }
                
                //查询账号权限
                this.vendorGradeDs.query({
                    storeId: data.item.storeId
                });
                
                return data;
            },
    
            //上架
            online(index, store){
                itemModule.online.execute({
                    data: {
                        itemIds: store.storeItemId
                    },
                    success: function () {
                        store.shelfFlag = "ONLINE";
                        this.refreshAssignItem(index);
                        store = null;
                        index = null;
                    }.bind(this)
                });
            },
    
            //下架
            offline(index, store){
                itemModule.offline.execute({
                    data: {
                        itemIds: store.storeItemId
                    },
                    success: function () {
                        store.shelfFlag = "OFFLINE";
                        this.refreshAssignItem(index, store);
                        store = null;
                        index = null;
                    }.bind(this)
                });
            },
            
            refreshAssignItem(index, store){
                let data = this.assignedData[index], num = 0, obj;
                
                store = data.storeAssignDtos || [];
                
                //重新计算上下架数量 onStoreNum
                for (let i = 0, l = store.length; i < l; i++) {
                    obj = store[i];
                    if (obj.shelfFlag == "ONLINE"){
                        num ++;
                    }
                }
                data.onStoreNum = num;
                data.assignStoryNum = store.length;
                
                this.$set(this.assignedData, index, data);
            },
    
            //删除商品
            deleteItem(index, ind, store) {
                itemModule.deleteByIds.execute({
                    data: {
                        itemIds: store.storeItemId
                    },
                    success: function () {
                        let item = this.assignedData[index];
                        item.storeAssignDtos.splice(ind, 1);
                        this.refreshAssignItem(index);
                        store = null;
                        index = null;
                        ind = null;
                    }.bind(this)
                });
            },
            
            //删除分配的国家
            cancelAssignOneCountry(index, item){
                itemModule.cancelAssignOneCountry.execute({
                    data: {
                        itemIds: item.countryItemId
                    },
                    success: function () {
                        this.assignedData.splice(index,1)
                    }.bind(this)
                });
            },
    
            toggleRow(index, item){
                item.expanded = true;
                this.$set(this.assignedData, index, item);
            },
    
            expandView(index, item){
                item.expanded = !item.expanded;
                this.$set(this.assignedData, index, item);
            },
    
            gotoAssignStore(){
                this.$store.dispatch('router/push', {
                    title: '分配门店',
                    query: {
                        ids: this.itemId
                    },
                    name: "page.item.assignStore"
                });
            },
    
            gotoAssignCountry(){
                this.$store.dispatch('router/push', {
                    title: '分配国家',
                    query: {
                        ids: this.itemId
                    },
                    name: "page.item.assignCountry"
                });
            }
        }
    }
</script>


<style lang="scss" scoped>
    .view-table{
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
    }
    .view-table{
        td{
            border: 1px solid #eee;
            border-left: none;
            border-right: none;
            border-collapse: collapse;
            padding: 10px;
        }
        .index-td{
            width: 80px;
        }
        .parent-td{
            padding: 0;
            border: none;
        }
        .child-table:last-child td{
            border-bottom: none;
        }
    }
    .base-info-item{
        line-height: 30px;
    }
    .base-info-item + .base-info-item{
        margin-top: 10px;
    }
    .assigned-table{
        border-top: 1px solid #eee;
    }
    .assigned-table{
        .expand-td{
            padding: 0px;
            text-align: center;
        }
        .expand-td, .index-td{
            width: 100px;
        }
        .name-td, .store-td, .on-store-td{
            width: 150px;
        }
        .option-td{
            width: 200px;
        }
        td{
            height: 50px;
        }
        thead td{
            border: none;
        }
        a + a{
            margin-left: 10px;
        }
    }
</style>