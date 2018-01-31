<template>
    <div class="add-activity">
        <sk-data-set ref="table1" v-model="queryDs" auto-create></sk-data-set>
        <sk-data-set ref="table2" v-model="queryItemDs" auto-create></sk-data-set>

        <sk-data-set v-model="bigCatalogDs" :auto-query="true" :query-service="baseData.getRootCatalogs"></sk-data-set>
        <sk-data-set v-model="catalogDs" :bind="queryItemDs" bind-field="rootCatalogId" bind-para-key="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>

        <sk-data-set v-model="skuDs" :query-service="activity.getSkusByItemId"></sk-data-set>

        <!-- 已关联的商品 -->
        <sk-data-set v-model="activityItemDs" :query-bind="queryDs" auto-query pagination page-size="10" :queryPara="queryItemConfig"
                     :query-service="activity.findActivityItemDetail"></sk-data-set>

        <!-- 可以添加商品 -->
        <sk-data-set v-model="couldAddItems" :query-bind="queryItemDs" pagination page-size="10"
                     :query-service="activity.getItemsByQueryParams"></sk-data-set>


        <sk-fold :title="$t('activityEventInformation')">
            <sk-row class="activity-info">
                <sk-col :size="2">
                    <div class="info-con">
                        <span v-html="$t('activityEventName')"></span>
                        <span>{{ activityName }}</span>
                    </div>
                </sk-col>
                <sk-col :size="2">
                    <div class="info-con">
                        <span v-html="$t('city')"></span>
                        <span>{{ cityName }}</span>
                    </div>
                </sk-col>
            </sk-row>

            <sk-row class="activity-info">
                <sk-col :size="2">
                    <div class="info-con">
                        <span v-html="$t('address')"></span>
                        <span>{{ address }}</span>
                    </div>
                </sk-col>
                <sk-col :size="2">
                    <div class="info-con">
                        <span v-html="$t('activityEventPeriod')"></span>
                        <span>{{ startDate | formatMsgTime }} ~ {{ endDate | formatMsgTime }}</span>
                    </div>
                </sk-col>
            </sk-row>
        </sk-fold>

        <sk-fold :title="$t('activityAddedEventProducts')">
            <sk-row>
                <sk-button :label="$t('batchDelete')" @click="removeActivityItem" primary></sk-button>
            </sk-row>
            <sk-table :bind="activityItemDs" ref="relatedItems" showCheckbox>
                <div slot="row">
                    <sk-column name="headAttacheList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column name="itemName" :formatter="forName" :title="$t('productName')" @cell-click="goItem" align="center"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
                    <sk-column :formatter="renderCategory" name="catalogMappingList" :title="$t('productCategory')"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="storePrice"  view-type="money"  :title="$t('price')" align="center"></sk-column>
                    <sk-column :formatter="forOperate" @cell-click="showSKU" name="auditStatus" :title="$t('operation')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>

        <sk-fold :title="$t('activityAddEventProduct')">
            <sk-form :bind="queryItemDs">
                <sk-row>
                    <sk-col :size="4">
                        <sk-select :label="$t('category')" :bind="queryItemDs" :option-bind="bigCatalogDs" display-field="catalogName" value-field="catalogId" name="rootCatalogId"></sk-select>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-select :label="$t('subCategory')" :bind="queryItemDs" :option-bind="catalogDs" display-field="catalogName" value-field="catalogId" name="catalogId"></sk-select>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-text-input :label="$t('productName')" name="itemName"></sk-text-input>
                    </sk-col>
                    <sk-col :size="4">
                        <sk-text-input :label="$t('productCode')" name="itemModel"></sk-text-input>
                    </sk-col>
                </sk-row>
                <sk-row>
                    <sk-col :size="2"></sk-col>
                    <sk-col :size="2" style="text-align: right">
                        <sk-button :label="$t('search')" :bind="couldAddItems" action="query" primary></sk-button>
                        <sk-button :label="$t('clear')" action="reset"></sk-button>
                    </sk-col>
                </sk-row>
                <sk-row>
                    <sk-col :size="1">
                        <sk-button :label="$t('submit')" primary @click="addActivityItem"></sk-button>
                    </sk-col>
                </sk-row>
            </sk-form>
            <sk-table :bind="couldAddItems" ref="couldAddItemsTable" showCheckbox>
                <div slot="row">
                    <sk-column name="headAttacheList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column name="itemName" :formatter="forName" :title="$t('productName')" @cell-click="goItem" align="center"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
                    <sk-column :formatter="renderCategory" name="catalogMappingList" :title="$t('productCategory')"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="storePrice" view-type="money" :title="$t('price')" align="center"></sk-column>
                    <sk-column :formatter="forOperate" @cell-click="showSKU" name="auditStatus" :title="$t('operation')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>

        <sk-sku ref="sku" :query-service="activity.getSkusByItemId" :countryName="countryName" :activityName="activityName"></sk-sku>
    </div>

</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import activity from "@/lib/dataModules/activity"

    import sku from "@/components/skirt/SkuDetail";
    import Vue from "vue";

    Vue.component(sku.name,sku);

    export default {
        data(){
            window.test = this;
            return {
                activity,
                baseData,
                queryDs: null,
                queryItemDs: null,
                activityItemDs: null,
                bigCatalogDs: null,
                catalogDs: null,
                skuDs: null,
                couldAddItems: null,
                countryName: "",
                activityName: "",
                cityName: "",
                address: "",
                startDate: "",
                endDate: "",
                itemName: "",
                itemModel: "",
                storePrice: "",
                unit: "",
                queryItemConfig: {}

            }
        },

        methods: {
            //处理类别
            renderCategory(v){
                let str = "";
                for( var i = 0; i < v.length; i++ ){
                    str += v[i].catalogName + " ";
                }
                return str
            },
            //操作
            forOperate(v){
                return "<a class='show-SKU' title=''>"+this.$t('skuDetail')+"</a>";
            },

            forName(v, index, record){
                return "<a class='goItem' itemId='"+ record.getValue("itemId") +"' title=''>"+v+"</a>"
            },

            //去商品sku
            goItem(e, v, name, index, record){
                this.$store.dispatch('router/push', {title: '商品编辑', name: "page.item.maintain", query: {type:"detail",itemId: record.getValue("itemId")}});
            },

            //添加活动商品
            addActivityItem(){
                let selectItem = this.$refs.couldAddItemsTable.getSelectData(),
                        array = [],
                        itemIds = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].itemId);
                }
                if ( array.length == 0 ){
                    this.$store.commit("message", this.$t('noItemTrip'));
                    return;
                }
                itemIds = array.join(",");

                this.$store.commit("confirm",{
                    message: this.$t('iSsubmit'),
                    ok: function(){
                        activity.insertItem.execute({
                            data: {
                                activityId: this.$route.query.activityId,
                                itemIds: itemIds
                            },
                            success:function(data){
                                this.$base.message("添加成功");
                                this.$refs.couldAddItemsTable.selectAll(false);
                                this.activityItemDs.query();
                            }.bind(this)
                        })
                    }.bind(this)
                })
            },

            //删除关联活动商品
            removeActivityItem(){
                let selectItem = this.$refs.relatedItems.getSelectData(),
                        array = [],
                        itemIds = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].itemId);
                }
                if ( array.length === 0 ){
                    this.$store.commit("message", this.$t('noItemTrip'));
                    return;
                }
                itemIds = array.join(",");

                this.$store.commit("confirm",{
                    message: this.$t('DeleteNow'),
                    ok: function(){
                        activity.removeItem.execute({
                            data: {
                                activityId: this.$route.query.activityId,
                                itemIds: itemIds
                            },
                            success:function(data){
                                this.$base.message("删除成功");
                                this.$refs.relatedItems.selectAll(false);
                                this.activityItemDs.query();
                            }.bind(this)
                        })
                    }.bind(this)
                })
            },

            //显示sku模态框
            showSKU(e, v, name, index, record){
                let itemId = record.getValue("itemId"),
                        litemName = record.getValue("itemName");
                this.$refs.sku.show( itemId,litemName );
            }
        },

        created(){
            this.queryItemConfig = {
                activityId: this.$route.query.activityId
            };
            activity.getActivityByActivityId.execute({
                data: {
                    activityId: this.$route.query.activityId
                },
                success: function(data){
                    this.countryName = data.country.countryName;
                    this.activityName = data.activityName;
                    this.cityName = data.country.countryName + " " + data.country.enName;
                    this.address = data.activityAddress;
                    this.startDate = data.beginTime;
                    this.endDate = data.endTime;
                    this.couldAddItems.queryPara = {
                        storeId: data.storeId,
                        countryId: data.city.countryId
                    };
                    this.couldAddItems.query({
                        storeId: data.storeId
                    })
                }.bind(this),
                failed: function (msg) {
                    this.$base.message(msg);
                }.bind(this)

            })
        },

        filters: {
            formatMsgTime: function(v){
                var v = new Date(v),
                        y = v.getFullYear(),
                        M = v.getMonth() + 1,
                        d = v.getDate(),
                        h = v.getHours(),
                        m = v.getMinutes(),
                        s = v.getSeconds();
                M = M < 10? "0" + M : M;
                d = d < 10? "0" + d : d;
                h = h < 10? "0" + h : h;
                m = m < 10? "0" + m : m;
                s = s < 10? "0" + s : s;
                return y + "-" + M + "-" + d ;

            }
        }
    }
</script>

<style lang="scss" scoped>
    .activity-info {
        padding: 20px 0;
    }

    .activity-info .info-con span:first-child {
        width: 100px;
        display: inline-block;
    }
    .activity-info .info-con span:last-child {
        /*font-weight: bold;*/
    }
    .modal-wrapper .skuRow {
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
    }
    .sku-info span:first-child{
        display: inline-block;
        width: 70px;
    }
</style>
