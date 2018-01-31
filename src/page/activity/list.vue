<template>
    <div class="activity-list">
        <sk-data-set auto-query @load="onLoadGradeInfoDs" :query-service="baseData.getAccountGrade"></sk-data-set>
        <sk-data-set ref="table" v-model="queryDs" auto-create></sk-data-set>
        <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.vendorCountries" auto-query></sk-data-set>
        <sk-data-set v-model="activityItemDs" @load="onLoadList" :auto-query="false" :query-bind="queryDs" pagination page-size="10"
                     :queryPara="queryActivityConfig" :query-service="activity.getActivityList"></sk-data-set>

        <sk-fold :title="$t('activityBaseInfo')" class="baseInfo">
            <sk-form :bind="queryDs">
                <sk-row>
                    <sk-col :size="2">
                        <sk-select :readonly="!!storeId" :value="countryId" :label="$t('countryArea')" name="countryId" :option-bind="vendorCountriesDs"
                                   display-field="countryName" value-field="countryId"></sk-select>
                    </sk-col>
                    <sk-col :size="2">
                        <sk-text-input :hintText="$t('activityEventName')" :label="$t('activityEventName')" name="activeName"></sk-text-input>
                    </sk-col>

                </sk-row>

                <sk-row>
                    <sk-col :size="2">
                        <sk-text-input :hintText="$t('activityActivityAddress')" :label="$t('activityActivityAddress')" name="address"></sk-text-input>
                    </sk-col>
                    <sk-col :size="2">
                        <sk-date-picker name="beginTime" valueType="string" format="yyyy-MM-dd" :label="$t('activityBeginDate')" :hintText="$t('activityBeginDate')"></sk-date-picker>
                    </sk-col>
                    <!--<sk-col :size="2">-->
                        <!--<sk-date-picker bind-min-date="startDate" name="endDate" label=" " bind-by-min="startDate" :hintText="$t('endTime')"></sk-date-picker>-->
                    <!--</sk-col>-->
                </sk-row>

                <sk-row>
                    <sk-col :size="2">
                        <h5 class="sub-title" v-html="$t('activityIsDisplay')"></h5>
                        <sk-checkbox name="shelfFlagOn" :label="$t('online')"></sk-checkbox>
                        <sk-checkbox name="shelfFlagOff" :label="$t('offline')"></sk-checkbox>
                    </sk-col>

                    <sk-col :size="2">
                        <h5 class="sub-title" v-html="$t('status')"></h5>
                        <sk-checkbox name="notOpen" :label="$t('activityNotStarted')"></sk-checkbox>
                        <sk-checkbox name="processing" :label="$t('activityInProgress')"></sk-checkbox>
                        <sk-checkbox name="finished" :label="$t('activityFinished')"></sk-checkbox>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1" class="btn-group">
                        <sk-button :label="$t('search')" :bind="activityItemDs" action="query" primary></sk-button>
                        <sk-button :label="$t('clear')" action="reset"></sk-button>
                    </sk-col>
                </sk-row>
            </sk-form>
        </sk-fold>

        <sk-row>
            <sk-col :size="1" v-if="canEdit">
                <sk-button :label="$t('batchOnline')" primary @click="activityUp($event)"></sk-button>
                <sk-button :label="$t('batchOffline')" primary @click="activityDown($event)"></sk-button>
            </sk-col>
        </sk-row>
        <sk-table :bind="activityItemDs" ref="activitysListTable" showCheckbox>
            <div slot="row">
                <sk-column name="index" :title="$t('lineNo')" width="60px" align="center" :formatter="renderIndex"></sk-column>
                <sk-column name="attachList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                <sk-column :formatter="renderName" name="country" :title="$t('countryArea')" align="center"></sk-column>
                <sk-column name="activityName" :formatter="forActivityName" @cell-click="goActivityDetail" :title="$t('activityEventName')"></sk-column>
                <sk-column name="activityType" :formatter="forActivityType" :title="$t('activityType')"></sk-column>
                <sk-column name="activityAddress" :title="$t('activityActivityAddress')"></sk-column>
                <sk-column :formatter="formatTime" name="beginTime" :title="$t('startDate')" align="center"></sk-column>
                <sk-column :formatter="formatTime" name="endTime" :title="$t('expireDate')" align="center"></sk-column>
                <sk-column :formatter="renderOnSale" name="shelfStatus" :title="$t('onDisplay')" align="center"></sk-column>
                <sk-column :formatter="renderState" name="state" :title="$t('status')" align="center"></sk-column>
                <sk-column :formatter="forOperate" @cell-click="doOperation" name="shelfFlag" :title="$t('operation')" align="center"></sk-column>
            </div>
        </sk-table>
    </div>

</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import activity from "@/lib/dataModules/activity"

    export default {
        data(){
            window.test = this;
            return {
                queryDs: null,
                vendorCountriesDs: null,
                baseData: baseData,
                activityItemDs: null,
                activity: activity,
                currentData: {},
                queryActivityConfig: {
                    storeType: 1
                },

                gradeData: null,
                queryType: "brand",
                queryData: {},
                countryId: "",
                storeId: ""
            }
        },

        methods: {
            //加载账号级别 品牌 国家 门店 (权限问题暂时不做)
            onLoadGradeInfoDs(records){
                var data = this.gradeData = records[0].getData();
                //全球的权限没有 countryId 和 storeId

                this.countryId = data.countryId;
                this.storeId = data.storeId;

                if (this.storeId){
                    this.countryId = data.countryAuthList[0];
                }

                this.activityItemDs.query({
                    countryId: data.countryId,
                    storeId: data.storeId
                });
            },

            onLoadList(){
                let para = this.activityItemDs.lastQueryPara, queryType;

                if(para.countryId){
                    queryType = "country";
                }else{
                    queryType = "brand";
                }

                this.queryType = queryType;
                this.queryData = Object.assign({}, para);
            },

            formatTime: function(v){
                let time = new Date(v),
                    y = time.getFullYear(),
                    M = time.getMonth() + 1,
                    d = time.getDate(),
                    h = time.getHours(),
                    m = time.getMinutes(),
                    s = time.getSeconds();
                M = M < 10? "0" + M : M;
                d = d < 10? "0" + d : d;
                h = h < 10? "0" + h : h;
                m = m < 10? "0" + m : m;
                s = s < 10? "0" + s : s;
                return y + "-" + M + "-" + d;
            },
            renderIndex(v, index){
                return parseInt(index + 1);
            },
            renderName(v,index,record){
                if (!!v) {
                    return v.enName + " " + v.countryName;
                }else {
                    return "Global 全球";
                }
            },
            renderState(v){
                switch(v){
                    case "PROCESS":
                        return this.$t('activityInProgress');
                    case "COMING":
                        return this.$t('activityNotStarted');
                    default:
                        return this.$t('activityFinished');
                }
            },
            renderOnSale(v,index,record){
                let status = record.data.shelfFlag;
                if ( !!status && status == "ONLINE"){
                    return this.$t('onlineAlready');
                } else if ( !!status && status =="OFFLINE" ){
                    return this.$t('offlineAlready');
                } else{
                    return "-";
                }
            },
            //初始化按钮
            forOperate (v){
                if ( !!v && v == "OFFLINE"){
                    return "<a class='edit' title=''>"+this.$t('edit')+"</a><br/><a class='sell' title=''>"+this.$t('online')+"</a><br/><a class='delItem' title=''>"+this.$t('delete')+"</a><br/><a class='signNo' title=''>"+this.$t('activityCheckInList')+"</a>"
                }else{
                    return "<a class='edit' title=''>"+this.$t('edit')+"</a><br/><a class='unSell' title=''>"+this.$t('offline')+"</a><br/><a class='delItem' title=''>"+this.$t('delete')+"</a><br/><a class='signNo' title=''>"+this.$t('activityCheckInList')+"</a>"
                }
            },
            //按钮分配事件
            doOperation(e, v, name, index, record){
                let type = e.target.className;
                switch (type){
                    case 'edit':
                        this.$store.dispatch('router/push', {
                            name: "page.activity.edit",
                            title: '活动编辑',
                            query: {type: type, activityId: record.getValue("activityId")}
                        });
                        break;
                    case 'signNo':
                        this.$store.dispatch('router/push', {
                            name: "page.activity.signIn",
                            title: '签到统计',
                            query: {type: type, activityId: record.getValue("activityId")}
                        });
                        break;
                    case 'sell':
                    case 'unSell':
                        this.confirm(e, record);
                        break;
                    case 'delItem':
                        this.delItem(record);
                        break;

                }
            },
            forActivityName(v, index, record) {
                return "<a class='goActivityDetail' title='' activityId='"+ record.getValue("activityId") +"'>"+v+"</a>"
            },
            forActivityType(v, index, record) {
                return v === "BRAND" ? "BRAND/品牌" : "COUPON/优惠券";
            },
            goActivityDetail(e, v, name, index, record){
                this.$store.dispatch('router/push', {
                    name: "page.activity.edit",
                    title: '活动编辑',
                    query: {type: "edit", activityId: record.getValue("activityId")}
                })
            },
            //弹窗处理上下架(单个)
            confirm(e, record){
                let msg = e.target.innerText + "?";
                let classType = e.target.className;
                let data = {
                    activityIds: record.data.activityId
                };
                this.$store.commit("confirm",{
                    message: msg,
                    ok: function(){
                        //这里确定上下架请求
                        if ( classType == "sell" ){
                            activity.changeToOnLine.execute({
                                data,
                                success: function(){
                                    this.activityItemDs.query();
                                }.bind(this)
                            })
                        }else if ( classType == "unSell" ){
                            activity.changeToOffLine.execute({
                                data,
                                success: function(){
                                    this.activityItemDs.query();
                                }.bind(this)
                            })
                        }
                    }.bind(this)
                });
            },

            //批量上架(批量)
            activityUp(){
                let selectItem = this.$refs.activitysListTable.getSelectData(),
                    array = [],
                    activityIds = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].activityId);
                }
                if (array.length == 0){
                    this.$store.commit("message",this.$t('noOnDisplay'));
                    return;
                }
                activityIds = array.join(",");
                this.$store.commit("confirm",{
                    message: this.$t('activityConfirmOnDisplay'),
                    ok: function(){
                        activity.changeToOnLine.execute({
                            data: {
                                activityIds: activityIds
                            },
                            success:function(data){
                                this.$store.commit("message",this.$t('online'));
                                this.$refs.activitysListTable.selectAll(false);
                                this.activityItemDs.query();
                            }.bind(this)
                        })
                    }.bind(this)
                });
            },

            //批量下架(批量)
            activityDown(){
                let selectItem = this.$refs.activitysListTable.getSelectData(),
                    array = [],
                    activityIds = "";
                for( let i = 0; i < selectItem.length; i++){
                    array.push(selectItem[i].activityId);
                }
                if (array.length == 0){
                    this.$store.commit("message",this.$t('noDownDisplay'));
                    return;
                }
                activityIds = array.join(",");
                this.$store.commit("confirm",{
                    message:this.$t('activityConfirmOffDisplay'),
                    ok: function(){
                        activity.changeToOffLine.execute({
                            data: {
                                activityIds: activityIds
                            },
                            success:function(data){
                                this.$store.commit("message",this.$t('offline'));
                                this.$refs.activitysListTable.selectAll(false);
                                this.activityItemDs.query();
                            }.bind(this)
                        })
                    }.bind(this)
                });
            },

            //删除活动
            delItem(record){
                /** 活动需下架后才能删除 **/
                let shelfFlag = record.data.shelfFlag;
                if ( shelfFlag == "ONLINE" ){
                    this.$store.commit("message",this.$t('activityDeleteTrip'));
                    return;
                }
                let data = {
                    activityIds: record.data.activityId
                };
                this.$store.commit("confirm",{
                    message: this.$t('DeleteNow'),
                    ok: function(){
                        activity.deleteByIds.execute({
                            data,
                            success: function(){
                                this.activityItemDs.query();
                            }.bind(this)
                        })
                    }.bind(this)
                });
            }

        },

        created(){

        },

        computed: {
            canEdit(){
                let gradeData = this.gradeData;
                let queryData = this.queryData;
                let queryType = this.queryType;

                if (queryType && gradeData){
                    //全球权限进来
                    if (gradeData.hasBrandGlobal){
                        return true;

                    }else if (gradeData.hasCountry){

                        //国家权限进来
                        if (queryData.countryId == gradeData.countryId){
                            return true
                        }
                    }else if (gradeData.storeId){
                        return true
                    }
                }

                return false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .activity-list {
        /*width: 80%;*/
        /*margin: 0 auto;*/
    }
    .slideUp-enter-active,
    .slideUp-leave-active {
        transition: all 0.5s;
        opacity: 1;
    }

    .slideUp-enter,
    .slideUp-leave-active {
        opacity: 0;
    }

    .title {
        padding-bottom: 10px;
        border-bottom: 1px solid #000;
    }

    .btn-group {
        text-align: right;
        padding-top: 50px;
    }

    .baseInfo {
        margin-bottom: 40px;
    }

</style>
