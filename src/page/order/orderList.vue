<template>
    <div class="main-container">
        <sk-data-set auto-query @load="onLoadGradeInfoDs" :query-service="baseData.getAccountGrade"></sk-data-set>
        <sk-data-set v-model="queryDs" auto-create></sk-data-set>
        <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.vendorCountries" auto-query></sk-data-set>
        <sk-data-set v-model="storeDs" :query-service="baseData.getStoreByCountry" :bind="queryDs" bind-field="countryId"></sk-data-set>

        <sk-data-set v-model="orderType" :data-source="orderTypesData"></sk-data-set>
        <sk-data-set v-model="orderStatus" :data-source="orderStatusData"></sk-data-set>
        <sk-data-set v-model="rootCatalogs" :query-service="baseData.getRootCatalogs" auto-query></sk-data-set>
        <sk-data-set v-model="catalogs" :bind="queryDs" bind-field="rootCatalogId" bind-para-key="parentCatalogId"
                     :query-service="baseData.getCatalogsByParentId"></sk-data-set>
        <sk-data-set v-model="queryOrderList" :bind="queryDs" pagination page-size="10"
                     :query-service="order.queryOrderList" :queryPara="queryConfig" :query-bind="queryDs" :auto-query="false"></sk-data-set>

        <!-- 货币 -->
        <sk-data-set v-model="currencyDs" :query-service="baseData.getCurrencyList" auto-query></sk-data-set>

        <sk-fold :title="$t('queryPara')">
            <sk-form :bind="queryDs">
                <sk-row gutter>
                    <sk-col :size="3">
                        <sk-select
                                value=""
                                :label="$t('countryArea')"
                                :bind="queryDs"
                                name="countryId"
                                :option-bind="vendorCountriesDs"
                                display-field="countryName"
                                value-field="countryId"
                                :readonly="!!limit.countryId"
                        ></sk-select>
                    </sk-col>
                    <sk-col :size="3">
                        <sk-select
                                value=""
                                :label="$t('store')"
                                :bind="queryDs"
                                name="storeId"
                                :option-bind="storeDs"
                                display-field="storeName"
                                value-field="storeId"
                                :readonly="!!limit.storeId"
                        ></sk-select>
                    </sk-col>
                    <sk-col :size="3">
                        <sk-select
                                value=""
                                :label="$t('orderOrderType')"
                                :bind="queryDs"
                                null-title="全部 All"
                                name="deliveryType"
                                :option-bind="orderType"
                                display-field="display"
                                value-field="deliveryType"
                        ></sk-select>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-select
                                value=""
                                :label="$t('orderOrderStatus')"
                                :bind="queryDs"
                                name="orderVendorStatus"
                                :option-bind="orderStatus"
                                display-field="display"
                                value-field="statusVal"
                        ></sk-select>
                    </sk-col>
                    <sk-col :size="3">
                        <sk-select value="" :label="$t('productCategoryFilter')" :bind="queryDs" name="rootCatalogId"
                                   :option-bind="rootCatalogs" display-field="catalogName"
                                   value-field="catalogId"></sk-select>
                    </sk-col>
                    <sk-col :size="3">
                        <sk-select value="" :label="$t('subFilter')" :bind="queryDs" name="catalogId"
                                   :option-bind="catalogs" display-field="catalogName" value-field="catalogId"></sk-select>
                    </sk-col>

                </sk-row>

                <sk-row>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('productCode')" :label="$t('productCode')" :bind="queryDs" name="itemModel"
                                       :option-bind="itemModel"></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('productName')" :label="$t('productName')" :bind="queryDs" name="itemName"
                                       :option-bind="itemName"></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-col class="col-sm-12 control-label"><span v-html="$t('orderArrivalDate')"></span></sk-col>
                        <div class="col-sm-5">
                            <sk-date-picker name="beginDate" :bind="queryDs" valueType="string" format="yyyy-MM-dd" :option-bind="datePicker" :hint-text="$t('startDate')"></sk-date-picker>
                        </div>
                        <div class="col-sm-2 time-diver-icon">
                            ～
                        </div>
                        <div class="col-sm-5">
                            <sk-date-picker name="endDate" :bind="queryDs" valueType="string" format="yyyy-MM-dd" :option-bind="datePicker" bind-min-date="beginDate" :hint-text="$t('endDate')"></sk-date-picker>
                        </div>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('orderNo')" :label="$t('orderNo')" :bind="queryDs" name="orderNo"
                                       :option-bind="orderNo"></sk-text-input>
                    </sk-col>

                    <sk-col :size="3" style="text-align: right;padding-top: 20px">
                        <sk-button :label="$t('search')" :bind="queryOrderList" action="query" primary></sk-button>
                        <sk-button :label="$t('clear')" action="reset"></sk-button>
                    </sk-col>

                </sk-row>
            </sk-form>
        </sk-fold>

        <sk-row>
            <sk-col :size="1">
                <sk-button :label="$t('batchPass')" primary @click="batchOrderPassed"></sk-button>
            </sk-col>
        </sk-row>
        <sk-table :bind="queryOrderList" ref="orderListTable" selectable :show-checkbox="!limitFlag">
            <div slot="row">
                <sk-column :formatter="orderIndex" name="No" :title="$t('lineNo')" align="center" width="60px"></sk-column>
                <sk-column :formatter="transCountry" name="store" :title="$t('countryArea')" align="center"></sk-column>
                <sk-column name="orderNo" width="200px" :title="$t('orderNo')" :formatter="forOrderDetail" @cell-click="goOrderDetail"></sk-column>
                <sk-column :formatter="renderStoreName" name="storeName" :title="$t('activityStoreEventName')" ></sk-column>
                <sk-column :formatter="renderUserName" name="orderContact" :title="$t('name')" align="center"></sk-column>
                <sk-column name="deliveryTime" view-type="time" :title="$t('appointmentDate')" align="center"></sk-column>
                <sk-column :formatter="renderOrderState" name="orderStatus" :title="$t('orderOrderStatus')" align="center"></sk-column>
                <sk-column :formatter="tranOrderType" name="deliveryType" :title="$t('orderOrderType')" align="center"></sk-column>
                <sk-column :formatter="confirmShopping" name="confirmShopping" :title="$t('confirmShopping')" align="center"></sk-column>
                <sk-column :if-hide="limitFlag" :formatter="tranOperate" name="auditStatus" @cell-click="doOperation" :title="$t('operation')" align="center"></sk-column>
            </div>
        </sk-table>

        <sk-win width="400px" :title="$t('orderConfirm')" ref="confirmOrder">
            <h4 class="confirm-title" v-html="$t('total')"></h4>
            <div class="confirm-price">
                <sk-select
                        value=""
                        :label="$t('currency')"
                        :bind="queryDs"
                        name="unit"
                        :option-bind="currencyDs"
                        display-field="exchangeSign"
                        value-field="exchangeUnit"
                ></sk-select>
                <sk-text-input value="" :hint-text="$t('price')" :label="$t('price')" :bind="queryDs" name="purchaseMoney" type="number"></sk-text-input>
            </div>
            <div class="confirm-btn">
                <sk-button primary :label="$t('submit')" @click="confirmOrderComplete"></sk-button>
            </div>
        </sk-win>
    </div>
</template>
<script>
    import baseData from "@/lib/dataModules/baseData"
    import SkDatePicker from "../../components/skirt/DatePicker";
    import order from "@/lib/dataModules/order"
    import SkRow from "../../components/skirt/Row";
    import SkCol from "../../components/skirt/Col";

    export default{
        components: {
            SkCol,
            SkRow,
            SkDatePicker
        },
        data(){
            window.test = this;
            return {
                orderTypesData: [
                    {deliveryType: "STORE_DELIVERY", display: "预约到店", enName: "Shop in Store"},
                    {deliveryType: "HOTEL_DELIVERY", display: "送货上门", enName: "Deliver Home"}
                ],
                queryDs: null,
                vendorCountriesDs: null,
                currencyDs: null,
                storeDs: null,
                baseData: baseData,
                order: order,
                confirmOrderNo: "",
                orderType: null,
                orderStatus: null,
                orderStatusData: [
                    {statusVal: "PENDING", display: "待审核",enName: "Pending"},
                    {statusVal: "VERIFIED", display: "已通过",enName: "Verified"},
                    {statusVal: "DELIVERED", display: "已发货", enName: "Delivered"},
                    {statusVal: "CONFIRMED", display: "已确认",enName: "Confirmed"},
                    {statusVal: "REFUSED", display: "已拒绝",enName: "Refused"},
                    {statusVal: "CANCELED", display: "已取消",enName: "Canceled"}
                ],
                queryConfig: {

                },
                limit: {
                    countryId: "",
                    storeId: ""
                },
                orderNo: null,
                rootCatalogs: null,
                catalogs: null,
                datePicker: null,
                itemModel: null,
                itemName: null,
                queryOrderList: null,
                limitFlag: false
            }
        },
        created(){

        },
        methods: {
            //加载账号级别 品牌 国家 门店
            onLoadGradeInfoDs(records){
                let data = this.gradeData = records[0].getData();
                //全球的权限没有 countryId 和 storeId
                if (data.hasBrandGlobal === true){
                    // TODO  权限管理 (暂时放开 2017/09/28)
                    this.limitFlag = false;
                }else if(data.hasCountry){
                    this.limit.countryId = data.countryId;
                }else if(data.hasStore){
                    this.limit.storeId = data.storeId;
                    this.limit.countryId = data.countryAuthList[0];
                }

                let queryPara = this.$base.deepCopy(this.limit);
                this.queryDs.setData(queryPara);
                this.queryOrderList.query(queryPara);
            },
            forOrderDetail(v, index, record){
                return "<a class='goOrderDetail' title='' orderNo='"+ record.getValue("orderNo") +"'>"+v+"</a>"
            },
            goOrderDetail(e, v, name, index, record){
                let query = {};
                if (!!this.limitFlag){
                    query = {type: "detail",orderNo: record.getValue("orderNo")}
                }else {
                    query = {orderNo: record.getValue("orderNo")}
                }
                this.$store.dispatch('router/push',{title: "订单详情", name: "page.order.detail", query});
            },
            orderIndex (v, i, record) {
                return i + 1;
            },
            transCountry (v, index, record) {
                return v.countryName + " " + v.cityName;
            },
            renderUserName (v, index, record) {
                return !!v ? v.contactName : "";
            },
            renderStoreName (v, index, record) {
                return record.data.store.storeName;
            },
            transTime: function (v) {
                let time = !!v ? (new Date(v)) : "";
                return time ? time.toISOString().substring(0, 16).replace("T", " ") : "-";
            },
            /** 处理订单状态 **/
            renderOrderState: function (v, index, record) {
                // orderStatus 'NOT_SUBMIT', 'SUBMIT', 'PAID', 'ACCEPT_ORDER', 'SEND_GOODS', 'RECEIPT_INIT', 'RECEIPT_REFUSE', 'COMPLETED', 'CANCEL'
                let status = record.data.orderStatus;
                  var statusTxt ={
                          "CANCEL": 'orderCanceledStatus',
                          "COMPLETED":'verified',
                          "RECEIPT_REFUSE":'orderConfirmStatus',
                          "RECEIPT_INIT" : 'verified',
                          "SEND_GOODS":'Delivered',
                          "ACCEPT_ORDER":'verified',
                          "PAID":'pending',
                          "SUBMIT":'submit',
                        };
                  if (status == "CANCEL" && "STORE_CANCEL" == record.data.orderCancelType){
                    return this.$t("refused"); //拒绝
                  }
                  for (var key in statusTxt){
                     if (key==status){
                       return this.$t(statusTxt[key]);
                     }
                  }
                  return "-";
            },
            /** 处理订单类型 **/
            tranOrderType: function (v, index, record) {
                switch (v) {
                    case "STORE_DELIVERY":
                        return this.$t('shopInStore');
                    case "HOTEL_DELIVERY":
                        return this.$t('shopToHome');
                }
            },
            /** 确认订单状态 **/
            confirmShopping: function (v, index, record) {
              switch (v) {
                case "PURCHASED":
                  return this.$t('orderConfirmStatus');
                case "NOT_PURCHASED":
                  return this.$t('orderNotConfirmStatus');
                  default:
                      return this.$t('orderNotConfirmStatus');
              }
            },
            /** 处理订单操作 **/
            tranOperate: function (v, index, record) {
                let deliveryType = record.data.deliveryType,
                    confirmBtn = record.data.confirmShopping;
                var orderStatus = record.data.orderStatus;
                // orderStatus 'NOT_SUBMIT', 'SUBMIT', 'PAID', 'ACCEPT_ORDER', 'SEND_GOODS', 'RECEIPT_INIT', 'RECEIPT_REFUSE', 'COMPLETED', 'CANCEL'
                // preStatus 商户端备货状态(待审核，拒绝，通过) = ['WAIT_AUDITED', 'AUDITED', 'REFUSE_AUDITED']
                // 预约到店
                var buttonStr = "";
                buttonStr = buttonStr.concat("<a class='look' title=''>"+ this.$t('orderDetails') +"</a><br>");
                if (orderStatus == 'PAID'){
                  buttonStr = buttonStr.concat("<a class='audit' title=''>"+this.$t('checkAudit')+"</a><br>");
                }
                if (deliveryType == 'HOTEL_DELIVERY'&& orderStatus == 'ACCEPT_ORDER'){
                  buttonStr = buttonStr.concat("<a class='audit' title=''>" + this.$t('delivery') +"</a><br>");
                }
                if (confirmBtn != 'PURCHASED'){
                  buttonStr = buttonStr.concat("<a class='confirm' title='' data-order-no="+ record.data.orderNo +">"+this.$t('orderConfirm')+"</a>");
                }


                /*if(deliveryType === "STORE_DELIVERY"){
                    if(preStatus === "WAIT_AUDITED"){
                        return "<a class='audit' title=''>"+this.$t('checkAudit')+"</a>"
                    } else if(status === "ACCEPT_ORDER"){
                        if ( confirmBtn === "PURCHASED" ){
                            return "<a class='look' title=''>"+ this.$t('orderDetails') +"</a>";
                        }else {
                            return "<a class='look' title=''>"+ this.$t('orderDetails') +"</a><br><a class='confirm' title='' data-order-no="+ record.data.orderNo +">"+this.$t('orderConfirm')+"</a>"
                        }
                    } else {
                        return "<a class='look' title=''>"+ this.$t('orderDetails') +"</a>"
                    }
                }
                // 送货上门
                if(deliveryType === "HOTEL_DELIVERY"){
                    if(preStatus === "WAIT_AUDITED"){
                        return "<a class='audit' title=''>" + this.$t('checkAudit')+"</a>"
                    } else if ( status === "ACCEPT_ORDER" ){
                        return "<a class='audit' title=''>" + this.$t('delivery') +"</a>"
                    } else if ( status === "SEND_GOODS" ){
                        return "<a class='look' title=''>" + this.$t('orderDetails') +"</a>"
                    }
                }*/
                return buttonStr;
            },

            doOperation(e, v, name, index, record){
                let type = e.target.className,
                        table = this.$refs.table;
                switch (type){
                    case 'look':
                    case 'audit':
                        this.$store.dispatch('router/push', {title: "订单详情", name: "page.order.detail", query: {orderNo: record.getValue("orderNo"), type: type }});
                        break;

                    case 'confirm':
                        this.orderPass(e);
                        break;
                }
            },

            orderPass(e){
                this.confirmOrderNo = e.target.dataset.orderNo;
               this.$store.commit("confirm",{
                   message: this.$t('orderCompleted'),
                   ok: function(){
                       this.$refs.confirmOrder.show()
                   }.bind(this)
               })
            },

            //批量通过订单
            batchOrderPassed(){
                let selectItem = this.$refs.orderListTable.getSelectData(),
                        array = [],
                        orderNo = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].orderNo);
                }
                if (array.length === 0){
                    this.$store.commit("message", this.$t('pleaseSelectOrder'));
                    return;
                }
                orderNo = array.join(",");

                this.$store.commit("confirm",  {
                    message: this.$t('iSsubmit'),
                    ok: function(){
                        order.batchOrderPassed.execute({
                            data: {
                                orderNos: orderNo
                            },
                            success:function (){
                                this.$store.commit("message", this.$t('orderPassed'));
                                this.$refs.orderListTable.selectAll(false);
                                this.queryOrderList.query();
                            }.bind(this)
                        })
                    }.bind(this)
                });
            },

            //确认订单完成
            confirmOrderComplete(){
                let data = this.queryDs.getCurrentData();

                order.confirmOrderSchedule.execute({
                    data: {
                        confirmAmount: data.purchaseMoney,
                        confirmUnit: data.unit,
                        orderNo: this.confirmOrderNo,
                        confirmShopping: "PURCHASED"
                    },
                    success: function(){
                        this.$store.commit("message", this.$t('orderPassed'));
                        this.$refs.confirmOrder.hide();
                        this.queryOrderList.query();
                    }.bind(this)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main-container {
        width: 90%;
        max-width: 1300px;
        margin: auto;
    }

    .col-sm-2 {
        width: 16.66666667%;
        float: left;
    }

    .col-sm-4 {
        width: 33.33333333%;
        float: left;
    }

    .col-sm-5 {
        width: 41.66666667%;
        float: left;
    }

    .col-sm-8 {
        width: 66.66666667%;
        float: left;
    }

    .col-sm-12 {
        width: 100%;
        float: left;
    }

    .time-diver-icon {
        font-size: 20px;
        text-align: center;
        padding-top: 10px;
    }

    .form-group {
        padding-left: 40px !important;
        box-sizing: border-box;
    }

    .control-label {
        height: 24px;
        line-height: 24px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
    }

    .form-btns {
        text-align: right;
    }
    .confirm-title{
        text-align: center;
    }

    .confirm-btn {
        margin-top: 10px;
        text-align: center;
    }

</style>
