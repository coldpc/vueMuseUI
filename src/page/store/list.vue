<template>
    <div class="main-container">
        <sk-data-set auto-query @load="onLoadGradeInfoDs" :query-service="baseData.getAccountGrade"></sk-data-set>
        <sk-data-set v-model="queryDs" auto-create></sk-data-set>
        <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.vendorCountries" auto-query></sk-data-set>
        <sk-data-set v-model="auditStatus" :data-source="auditStatusData"></sk-data-set>
        <sk-data-set v-model="openFlag" :data-source="openFlagData"></sk-data-set>
        <sk-data-set v-model="queryStoreList"  :parse-data="ctrlStoreData" :bind="queryDs" :auto-query="false" pagination page-size="10" order="asc" :query-service="store.queryStoreList" :query-bind="queryDs"></sk-data-set>
    
        <sk-fold :title="$t('storeList')">
        <sk-form :bind="queryDs">
            <sk-row gutter>
                <sk-col :size="3">
                    <sk-select
                        value=""
                        hint-text=""
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
                    <sk-text-input value="" :hint-text="$t('storeName')" :label="$t('storeName')" :bind="queryDs" name="storeName" ></sk-text-input>
                </sk-col>
    
                <sk-col :size="3">
                    <sk-text-input value="" :hint-text="$t('storeAddress')" :label="$t('storeAddress')" :bind="queryDs" name="address" ></sk-text-input>
                </sk-col>
            </sk-row>
            
            <sk-row>
                <sk-col :size="3">
                    <sk-select
                        value=""
                        hint-text=""
                        :label="$t('verifyStatus')"
                        :nullTitle="$t('all')"
                        :bind="queryDs"
                        name="auditStatus"
                        :option-bind="auditStatus"
                        display-field="display"
                        value-field="value"
                    ></sk-select>
                </sk-col>
    
                <sk-col :size="3">
                    <sk-select
                            value=""
                            hint-text= ""
                            :label="$t('busState')"
                            :bind="queryDs"
                            name="openFlag"
                            :option-bind="openFlag"
                            :nullTitle="$t('all')"
                            display-field="display"
                            value-field="value"
                    ></sk-select>
                </sk-col>
    
                <sk-col :size="3" style="margin-top: 25px; text-align: right;">
                    <sk-button :label="$t('search')" :bind="queryStoreList" action="query" primary></sk-button>
                    <sk-button :label="$t('clear')" action="reset"></sk-button>
                </sk-col>
            </sk-row>
            
        </sk-form>
        </sk-fold>

        <sk-row>
            <sk-col :size="1">
                <sk-button :label="$t('StoreBatchOnline')" primary action="open" @click="batchStoreCtrl"></sk-button>
                <sk-button :label="$t('StoreBatchOffline')" primary action="close" @click="batchStoreCtrl"></sk-button>
            </sk-col>
        </sk-row>
        <sk-table :bind="queryStoreList" ref="storeListTable" selectable showCheckbox>
            <div slot="row">
                <sk-column :formatter="orderIndex" name="orderNo" :title="$t('lineNo')" align="center" width="60px"></sk-column>
                <sk-column align="center" :formatter="forImg" viewType="img" name="headAttachList" :title="$t('thImg')"></sk-column>
                <sk-column align="center" viewType="img" name="ewmList" :title="$t('paymentOrderEwm')"></sk-column>
                <sk-column align="center" :formatter="forCountry" name="country" :title="$t('countryArea')"></sk-column>
                <sk-column align="center" :formatter="forCity" name="city" :title="$t('city')"></sk-column>
                <sk-column name="storeName" :title="$t('storeName')" align="center"></sk-column>
                <sk-column name="address" :title="$t('address')" align="center"></sk-column>
                <sk-column align="center" :formatter="forOpenFlag" name="openFlag" :title="$t('busState')"></sk-column>
                <sk-column align="center" :formatter="forAuditStatus" name="auditStatus" :title="$t('verifyStatus')"></sk-column>
                <sk-column align="center" :formatter="forOperate" @cell-click="doOperation" name="auditStatus" :title="$t('operation')"></sk-column>
            </div>
        </sk-table>
    </div>
</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import SkDatePicker from "../../components/skirt/DatePicker";
    import store from "@/lib/dataModules/store";

    export default{
        data(){
            return{
                queryDs: null,
                vendorCountriesDs: null,
                auditStatus: null,
                baseData: baseData,
                store: store,
                auditStatusData:[
                    {display: this.$t('pending'), value: "INIT"},
                    {display: this.$t('verified'), value: "APPROVE"},
                    {display: this.$t('refused'), value: "REFUSE"}
                ],
                openFlag: null,
                openFlagData:[
                    {display: this.$t('open'), value: "OPENED"},
                    {display: this.$t('close'), value: "NOT_OPEND"}
                ],
                queryStoreList: null,
                limit: {
                    countryId: "",
                    storeId: ""
                }
            }
        },
        methods: {
            //加载账号级别 品牌 国家 门店
            onLoadGradeInfoDs(records){
                let data = this.gradeData = records[0].getData();
                //全球的权限没有 countryId 和 storeId
                this.limit.countryId = data.countryId;
                this.limit.storeId = data.storeId;

                if (this.limit.storeId){
                    this.limit.countryId = data.countryAuthList[0];
                }
                this.queryDs.add({countryId:this.limit.countryId});

                this.queryStoreList.query({
                    countryId: data.countryId,
                    storeId: data.storeId
                });
            },
            forImg (v){
                return "<div class='s-img' style=' width: 60px;height: 60px;overflow: hidden;display: inline-block;'><img style='height: 100%' src='" +
                    (v&&v[0]? v[0].path:"")+"'/></div>"
            },
            forCountry (v){
                return v ? (v.enName + " " + v.countryName) : ""
            },
            forCity (v){
                return v ? (v.enName+" " + v.cityName) : ""
            },
            orderIndex: function (v, i) {
                return i + 1
            },
            forOpenFlag (v){
                switch (v){
                    case "OPENED": return this.$t('open');
                    case "NOT_OPEND": return this.$t('close');
                    default : return ""
                }
            },
            forAuditStatus(v){
                switch (v){
                    case "INIT": return this.$t('pending');
                    case "APPROVE": return this.$t('verified');
                    case "REFUSE": return this.$t('refused');
                    default : return ""
                }
            },
            forOperate (v, i, r){
                return "<a class='edit' title=''>"+this.$t('edit')+"</a></br>" +
                        "<a class='storeItems' title=''>"+ this.$t('StoreStar') +"</a>"
                
                //  去除指定商品
                /*if (v === "APPROVE"){
                    return "<a class='edit' title=''>"+this.$t('edit')+"</a><br/><a class='select' title=''>"+ this.$t('specifiedProduct') +"</a>"
                }else{
                    return "<a class='edit' title=''>"+this.$t('edit')+"</a>"
                }*/
            },
            doOperation(e, v, name, index, record){
                let type = e.target.className;
                switch (type){
                    case 'edit':
                        this.$store.dispatch('router/push', {
                            name: "page.store.edit",
                            title: '门店编辑',
                            query: {id: record.getValue("storeId")}
                        });
                        break;
                    case 'select':
                        this.$store.dispatch('router/push', {
                            name: "page.store.selectProduct",
                            title: '门店配置商品',
                            query: {id: record.getValue("storeId")}
                        });
                        break;
                    case 'storeItems':
                        this.$store.dispatch('router/push', {
                            name: "page.store.storeItems",
                            title: '门店之选',
                            query: {storeId: record.getValue("storeId")}
                        });
                        break;
                }
            },
    
            ctrlStoreData(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].ewmList = [{
                        path: this.getImgSrc(data[i].storeId)
                    }];
                }
                return data;
            },
            
            getImgSrc(storeId) {
                let host = 'http://';
                let locationHost = location.host;
                if (locationHost.indexOf('test') !== -1) {
                    host += 'ewmtest';
                }else if(locationHost.indexOf('uat') !== -1) {
                    host += 'ewmuat';
                }else{
                    host += "ewm";
                }
                host += '.yaok.com/?type=co&id=' + storeId;
                return 'http://m1.yaok.com/appapi/ewm/getQRCode?content=' + encodeURIComponent(host) + '&iconUrl=' + encodeURIComponent('http://m1.yaok.com/static/img/common/logo-s.png&width=300');
            },
            
            // 批量门店上下线处理
            batchStoreCtrl(action){
                let selectItem = this.$refs.storeListTable.getSelectData(),
                    array = [],
                    storeId = "",
                    openFlag = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].storeId);
                }
                if (array.length === 0){
                    this.$store.commit("message", this.$t('pleaseSelectStore'));
                    return;
                }
                storeId = array.join(",");
                openFlag = action === 'open' ? 'OPENED' : 'NOT_OPEND';

                this.$store.commit("confirm",  {
                    message: this.$t('isSubmitStore'),
                    ok: function(){
                        store.storeOpenOrClose.execute({
                            data: {
                                storeIds: storeId,
                                openFlag: openFlag
                            },
                            success:function (){
                                this.$store.commit("message", this.$t('orderPassed'));
                                this.queryStoreList.query();
                                this.$refs.storeListTable.selectAll(false);
                            }.bind(this)
                        })
                    }.bind(this)
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .s-img{
        width: 60px;
        height: 60px;
        overflow: hidden;
        display: inline-block;
        img{
            width: 100%;
        }
    }
</style>
