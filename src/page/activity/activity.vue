<template>
    <div class="main-container">

        <div class="service">
            <sk-data-set v-model="queryDs" :auto-create="!activityId" :auto-query="!!activityId" :query-para="queryPara"
                         :parse-data="ctrlActivityData" :query-service="activityServiceModule.getActivityById" @update="updateQueryDs"></sk-data-set>

            <!--国家区域-->
            <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.getAllContryList" auto-query></sk-data-set>
            <sk-data-set v-model="cityDs" :query-service="baseData.getCityListByCountryId" :bind="queryDs" bind-field="countryId"></sk-data-set>

            <!--货币-->
            <sk-data-set v-model="currencyDs" :query-service="baseData.getCurrencyList" auto-query></sk-data-set>

            <!-- 枚举 -->
            <sk-data-set v-model="benefitTypeDs" :query-service="enumServiceModule.getBenefitType" auto-query></sk-data-set>
            <sk-data-set v-model="activityTypeDs" :query-service="enumServiceModule.getVenderActivityType" auto-query></sk-data-set>
            <sk-data-set v-model="storeDs" :query-service="enumServiceModule.getActivityStore" :parse-data="ctrlAllstores"></sk-data-set>

            <!--查询映射-->
            <sk-data-set v-model="benefitsDs" :queryPara="{activityIds: activityId}" :auto-query="!!activityId" :query-service="activityServiceModule.getBenefitsByActivityId"></sk-data-set>
            <sk-data-set v-model="itemsDs" pagination page-size="10" :queryPara="queryPara"  :auto-query="!!activityId" :query-service="activityServiceModule.getItemsByActivityId"></sk-data-set>
            <sk-data-set v-model="storesDs" :parse-data="ctrlTreeData" :queryPara="queryPara" :auto-query="!!activityId" :query-service="activityServiceModule.getActivityStoreMappingsTreeByActivityId"></sk-data-set>
        </div>

        <sk-fold :title="$t('activityBaseInfo')">
            <sk-form :bind="queryDs" class="activity-form">
                <sk-row>
                    <sk-col :size="3">
                        <!--活动类型-->
                        <sk-select :label="$t('activityType')" :bind="queryDs" name="activityType"
                                   :option-bind="activityTypeDs" display-field="desc" value-field="code" required></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('activityName')" :label="$t('activityName')" :bind="queryDs" name="activityName" required></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('activityEnName')" :label="$t('activityEnName')" :bind="queryDs" name="activityEnName" required></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-select :label="$t('country')" :bind="queryDs" name="countryId" :option-bind="vendorCountriesDs"
                                   display-field="countryName" value-field="countryId" required></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-select :label="$t('city')" :bind="queryDs" name="cityId" :option-bind="cityDs" display-field="cityName"
                                   value-field="cityId"></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-select :label="$t('store')" :bind="queryDs" name="storeId" :option-bind="storeDs"
                                   display-field="storeName" value-field="storeId" ref="storeId"></sk-select>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('address')" :label="$t('address')" :bind="queryDs" ref="address"
                                       name="activityAddress" required></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-select :label="$t('currency')" :bind="queryDs" name="unit" :option-bind="currencyDs"
                                   display-field="exchangeUnit" value-field="exchangeUnit" required></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-tag required :readonly="!editable" :label="$t('tag')" :help-text="$t('maxNum', {num:'9'})" name="activityTag"></sk-tag>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="beginDate" :label="$t('activityBeginDate')" required></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="beginTime" :label="$t('activityBeginTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>

                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="endDate" :label="$t('activityEndDate')" required bindMinDate="beginDate"></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="endTime" :label="$t('activityEndTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>

                </sk-row>

                <sk-row>
                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="regBeginDate" :label="$t('activitySignBeginDate')" required></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="regBeginTime" :label="$t('activitySignBeginTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>

                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="regEndDate" :label="$t('activitySignEndDate')" required bindMinDate="regBeginDate"></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="regEndTime" :label="$t('activitySignEndTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>
                </sk-row>

                <!-- 活动展示时间 -->
                <sk-row>
                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="showBeginDate" :label="$t('activityShowBeginDate')" required></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="showBeginTime" :label="$t('activityShowBeginTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>

                    <sk-col :size="2">
                        <sk-row>
                            <sk-col :size="2">
                                <sk-date-picker value="" name="showEndDate" :label="$t('activityShowEndDate')" required bindMinDate="regBeginDate"></sk-date-picker>
                            </sk-col>
                            <sk-col :size="2">
                                <sk-time-picker value="" name="showEndTime" :label="$t('activityShowEndTime')" required></sk-time-picker>
                            </sk-col>
                        </sk-row>
                    </sk-col>

                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <div class="activity-time-trip">
                            <span style="margin-right: 10px" v-html="this.$t('activityConfigTrips')"></span>
                            <span  v-html="this.$t('activityConfigText')"></span>
                        </div>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <h5 class="sub-title" v-html="$t('activityIsDisplay')"></h5>
                        <sk-radio name="shelfFlag" :bind="queryDs" :label="$t('online')" nativeValue="ONLINE"></sk-radio>
                        <sk-radio name="shelfFlag" :bind="queryDs" :label="$t('offlineAlready')" nativeValue="OFFLINE"></sk-radio>
                    </sk-col>
                </sk-row>

                 <!--上传图片-->
                <sk-row class="uploader-headPic">
                    <sk-attach @upload-failed="uploadFailed" :bind="queryDs"  @assign-id-updated="uploadSuccess"  source="item"  ref="headPicAttach"  :label="$t('activityCoverPicture')" :remark="$t('activityForListPage')" name="headAssignId" :file-size-limit="2" :maxFiles="1" required></sk-attach>
                </sk-row>
                <sk-row class="uploader-bodyPic">
                    <sk-attach @upload-failed="uploadFailed" :bind="queryDs" @assign-id-updated="uploadSuccess" source="item" ref="bodyPicAttach"  :label="$t('activityIntroduction')" :remark="$t('activityForDescriptionPage')" name="bodyAssignId" :file-size-limit="2" :maxFiles="1" required></sk-attach>
                </sk-row>
            </sk-form>
        </sk-fold>

        <sk-tab v-show="!!activityId" ref="tab">
            <div slot="titles">
                <sk-tab-title>{{$t('assignItem')}}</sk-tab-title>
                <sk-tab-title>{{$t('benefitSet')}}</sk-tab-title>
                <!-- 分配组织(取消) -->
                <!--<sk-tab-title>{{$t('assignOrganization')}}</sk-tab-title>-->
            </div>
            <div slot="body">
                <sk-tab-content>
                    <sk-row>
                        <sk-button :label="$t('add')" primary @click="gotoEditItem"></sk-button>
                    </sk-row>
                    <sk-table :bind="itemsDs" ref="itemListTable">
                        <div slot="row">
                            <sk-column name="itemName" :title="$t('itemName')"></sk-column>
                            <sk-column name="itemModel" :title="$t('itemModelName')"></sk-column>
                            <sk-column name="headAttacheList" :title="$t('thImg')" view-type="img"></sk-column>
                            <sk-column name="brandName" :title="$t('brandName')"></sk-column>
                            <sk-column name="storeName" :title="$t('storeName')"></sk-column>
                            <sk-column :formatter="renderShelf" name="shelfFlag" align="center" :title="$t('status')" ></sk-column>
                            <sk-column name="itemId" :title="$t('operation')"  align="center" :formatter="renderItemOperation" @cell-click="onClickOperationCell"></sk-column>
                        </div>
                    </sk-table>
                </sk-tab-content>

                <sk-tab-content>
                    <sk-row>
                        <sk-button :label="$t('add')" primary @click="gotoEditBenefit"></sk-button>
                    </sk-row>
                    <sk-table :bind="benefitsDs" ref="benefitsListTable">
                        <div slot="row">
                            <sk-column name="mappingName" :title="$t('activityEventName')" align="center"></sk-column>
                            <sk-column name="enMappingName" :title="$t('activityActivityAddress')" align="center"></sk-column>
                            <sk-column name="weight" :title="$t('benefitLevel')" align="center"></sk-column>
                            <sk-column name="activityBenefitId" :title="$t('operation')"  align="center" :formatter="renderBenefitOperation" @cell-click="onClickOperationCell"></sk-column>
                        </div>
                    </sk-table>
                </sk-tab-content>

                <!-- 分配组织(取消) -->
                <!--<sk-tab-content>-->
                    <!--<sk-row>-->
                        <!--<sk-col :size="1">-->
                            <!--<sk-button :label="$t('save')" primary @click="saveStore"></sk-button>-->
                        <!--</sk-col>-->
                        <!--<sk-col :size="2">-->
                            <!--<sk-text-input :hintText="$t('searchOrganization')" @change="filterTree"></sk-text-input>-->
                        <!--</sk-col>-->
                    <!--</sk-row>-->
                    <!--<div>-->
                        <!--<sk-tree :source="treeData" ref="tree" :extensions="['filter']" :filter="{mode: 'hide'}" :checkbox="true" :select-mode="3"></sk-tree>-->
                    <!--</div>-->
                <!--</sk-tab-content>-->
            </div>
        </sk-tab>

        <!--编辑优惠-->
        <sk-benefit-edit ref="editBenefitWin" @updated="onUpdatedBenefit"></sk-benefit-edit>
        <sk-item-edit ref="editItemWin" @updated="onUpdatedItem" :activityId="activityId" :storeId="storeId"></sk-item-edit>

        <sk-fixed-bottom>
            <sk-button primary :label="$t('submit')" @click="save"></sk-button>
            <!-- 预览暂时没做 -->
            <!--<sk-button primary :label="$t('activityPreview')" @click="previewActivity"></sk-button>-->
            <sk-button :label="$t('cancel')" @click="cancel"></sk-button>
        </sk-fixed-bottom>
    </div>
</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import enumServiceModule from "@/lib/dataModules/enum"
    import activityServiceModule from "@/lib/dataModules/activity"
    import storeModule from "@/lib/dataModules/store"

    import Tab from "@/components/skirt/Tab"
    import TabTitle from "@/components/skirt/TabTitle"
    import TabContent from "@/components/skirt/TabContent"
//    import Tree from "@/components/skirt/Tree"

    import AddBenefit from "@/components/page/activity/addBenefit"
    import AddItem from "@/components/page/activity/addItem"

    export default{
        components: {
            "sk-tab": Tab,
            "sk-tab-title": TabTitle,
            "sk-tab-content": TabContent,
//            "sk-tree": Tree,
            "sk-benefit-edit": AddBenefit,
            "sk-item-edit": AddItem
        },

        data(){
            window.test = this;
            return {
                // service
                enumServiceModule,
                baseData,
                activityServiceModule,

                // ds
                queryDs: null,

                vendorCountriesDs: null,
                cityDs: null,
                currencyDs: null,
                benefitTypeDs: null,
                activityTypeDs: null,
                storeDs: null,
                distributeTypeDs: null,
                benefitsDs: null,
                itemsDs: null,
                storesDs: null,

                activityId: "",
                storeId: "",
                activityStoreId: "",
                queryPara: null,
                treeData: null,
                uploadSuccessNum: 0,

                countryId: null,
                cityId: null,
                activityType: null,
                allStores: null,
            }
        },
        methods: {
            renderShelf(v){
                let html;
                if ("ONLINE" === v){
                    html = this.$t('onlineAlready');
                }else{
                    html = this.$t('offlineAlready');
                }
                return html;
            },

            renderBenefitOperation(){
                return this.renderOperation("benefit");
            },

            renderItemOperation(){
                let type = "item";
                let deleteText = this.$t("delete");
                return `<a class='${type}-delete'>${deleteText}</a>`;
            },

            renderOperation: function (type) {
                let editText = this.$t('edit');
                let deleteText = this.$t("delete");
                return `<a class='${type}-edit'>${editText}</a><br><a class='${type}-delete'>${deleteText}</a>`;
            },

            onClickOperationCell(e, value, name, index, record) {
                let actionType = e.target.className;
                switch (actionType) {
                    case "benefit-delete":
                        this.deleteBenefit(record);
                        break;

                    case "benefit-edit":
                        this.gotoEditBenefit(record.getData());
                        break;

                    case "item-delete":
                        this.deleteItem(record);
                        break;

                    case "item-edit":
                        this.gotoEditItem(record.getData());
                        break;
                }
            },

            // 删除优惠
            deleteBenefit(record){
                this.$store.commit("confirm", {
                    message: this.$t("DeleteNow"),
                    ok: function () {
                        let activityData = this.$base.deepCopy(this.queryDs.getCurrentData());
                        activityData.activityBenefitMappings = this.removeActivityMapItem(this.benefitsDs.getAllData(), "activityBenefitId", record.getValue("activityBenefitId"));
                        // 避免后端报错，去除提交不必要的数据
                        delete activityData.beginTime;
                        delete activityData.endTime;
                        delete activityData.regBeginTime;
                        delete activityData.regEndTime;
                        delete activityData.showBeginTime;
                        delete activityData.showEndTime;

                        activityServiceModule.saveActivityBenefitMappings.execute({
                            data: activityData,
                            mask: {},
                            success: function () {
                                this.benefitsDs.remove(record);
                            }.bind(this)
                        });
                    }.bind(this)
                });
            },

            // 删除商品
            deleteItem(record){
                this.$store.commit("confirm", {
                    message: this.$t("DeleteNow"),
                    ok: function () {
                        let activityData = this.$base.deepCopy(this.queryDs.getCurrentData());
                        activityData.activityItemMappings = this.getDeleteItems(this.itemsDs.getAllData(), record.getValue("itemId"));
                        // 避免后端报错，去除提交不必要的数据
                        delete activityData.beginTime;
                        delete activityData.endTime;
                        delete activityData.regBeginTime;
                        delete activityData.regEndTime;
                        delete activityData.showBeginTime;
                        delete activityData.showEndTime;

                        activityServiceModule.saveActivityItemMappings.execute({
                            data: activityData,
                            mask: {},
                            success: function () {
                                this.itemsDs.remove(record);
                                this.onUpdatedItem();
                            }.bind(this)
                        });
                    }.bind(this)
                });
            },

            getDeleteItems(items, itemId){
                let resultItems = [], obj, item;
                let activityId = this.activityId;
                for (let i = 0; i < items.length; i++) {
                    item = items[i];
                    obj = {
                        itemId: item.itemId,
                        activityId: activityId,
                        activityItemId: item.activityItemId
                    };
                    if (obj.itemId === itemId) {
                        obj.deleteFlag = 1;
                    }
                    resultItems.push(obj);
                }
                return resultItems;
            },

            removeActivityMapItem(data, key, value){
                for (let i = 0; i < data.length; i++) {
                    if (data[i][key] === value){
                        data.splice(i, 1);
                        break;
                    }
                }
                return data;
            },

            //提交表单
            save(){
                //校验表单
                if ( !!this.shelfFlag && this.shelfFlag === "ONLINE" ){
                    this.$store.commit("message", this.$t('submitOnDisplay'));
                    return;
                }

                this.queryDs.sendVerify();
                let checkResult = this.queryDs.getCurrentRecord().getVerifyResult();

                if ( !checkResult.ifPassVerify ){
                    this.$store.commit("message", this.$t('pleaseCompleteInfo'));
                    return;
                } else if (this.uploadSuccessNum < 2){
                    this.$store.commit("loading", this.$t("saving"));
                    this.uploadAll();
                    return;
                }else{
                    this.uploadSuccessNum = 0;

                    let originData = this.$base.deepCopy(this.queryDs.getCurrentData());
                    originData.activityTag = (originData.activityTag || []).join(",");
//                    originData.storeId = this.storeId;

                    // 时间拼接，因为没有 dateTimePicker
                    // 活动时间
                    originData.beginTime = this.formatSaveTime(originData.beginDate, originData.beginTime);
                    originData.endTime = this.formatSaveTime(originData.endDate, originData.endTime);
                    // 活动报名时间
                    originData.regBeginTime = this.formatSaveTime(originData.regBeginDate, originData.regBeginTime);
                    originData.regEndTime = this.formatSaveTime(originData.regEndDate, originData.regEndTime);

                    // 活动展示时间
                    originData.showBeginTime = this.formatSaveTime(originData.showBeginDate, originData.showBeginTime);
                    originData.showEndTime = this.formatSaveTime(originData.showEndDate, originData.showEndTime);

                    activityServiceModule.saveOrUpdateActivity.execute({
                        data: originData,
                        mask: {},
                        success: function(activityId){
                            this.activityId = activityId;
                            this.$store.commit("message", this.$t("saveSuccess"));
                        }.bind(this)
                    });
                }
            },

             formatSaveTime(dateNum, timeStr) {
                 // 这一段代码为了处理时间拼接,解决没有 dateTimePicker
                 let HourNum = Number(timeStr.substr(0,2)) * 3600000,
                    minuteNum = Number(timeStr.substr(-2,2)) * 60 * 1000;
                return (dateNum + HourNum + minuteNum);
            },

            formatParseTime(timeNum) {
                // 时间戳，返回一个时间"hh:mm"形式，用于timePicker回填
                let time = new Date(timeNum),
                    h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours().toString(),
                    m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes().toString();
                return `${h}:${m}`;
            },

            ctrlActivityData(data) {
                // 活动时间
                data.beginDate = data.beginTime;
                data.endDate = data.endTime;
                data.beginTime = this.formatParseTime(data.beginTime);
                data.endTime = this.formatParseTime(data.endTime);

                // 活动报名时间
                data.regBeginDate = data.regBeginTime;
                data.regEndDate = data.regEndTime;
                data.regBeginTime = this.formatParseTime(data.regBeginTime);
                data.regEndTime = this.formatParseTime(data.regEndTime);

                // 活动展示时间
                data.showBeginDate = data.showBeginTime;
                data.showEndDate = data.showEndTime;
                data.showBeginTime = this.formatParseTime(data.showBeginTime);
                data.showEndTime = this.formatParseTime(data.showEndTime);
                return data;
            },

            uploadAll(){
                this.uploadSuccessNum = 0;

                //头图上传
                let temp = this.$refs.headPicAttach;
                temp.save();

                //详情上传
                temp = this.$refs.bodyPicAttach;
                temp.save();
            },

            uploadSuccess(assignId, fileList){
                //头图上传
                this.uploadSuccessNum ++;
                if (this.uploadSuccessNum == 2){
                    this.save();
                }
            },

            uploadFailed(){
                //头图上传
                this.uploadSuccessNum = 0;
                this.$store.commit("hideLoading");
            },

            /** 预览活动 **/
            previewActivity(){
//                let originData = this.$base.deepCopy(this.queryDs.getCurrentData());
//
//                //介绍图
//                let temp = this.$refs.bodyPicAttach.viewList;
//                if (temp && temp.length > 0){
//                    originData.bodyPic = temp[0].src;
//                }else {
//                    this.$store.commit( "message", this.$t('activityTripUploadImg') );
//                    return;
//                }
//
//                this.viewData = originData;
//                this.$refs.view.show();
            },

            cancel(){
                this.$store.dispatch('router/push', {name: "page.activity.list", title: '活动列表'});
            },

            /************************分配树**********************/
            filterTree: function (key) {
                this.$refs.tree.filterTreeByKeyword(key);
            },
            saveStore(){
                let stores = this.getStoreSaveData();
                let submitData = this.$base.deepCopy(this.queryDs.getCurrentData());
                submitData.activityStoreMappings = stores;
                delete submitData.beginTime;
                delete submitData.endTime;
                delete submitData.regBeginTime;
                delete submitData.regEndTime;
                delete submitData.showBeginTime;
                delete submitData.showEndTime;
                activityServiceModule.saveActivityStoreMappings.execute({
                    data: submitData,
                    mask: {},
                    success: function () {
                        this.storesDs.query();
                        this.$store.commit("message", this.$t('succeedSave'));
                    }.bind(this)
                })
            },
            getStoreSaveData(){
                let data = this.$refs.tree.getSelectedNodes();
                let obj, result = [], store;
                let storeGrade = "STORE";
                for (let i = 0, l = data.length; i < l; i++) {
                    obj = data[i];
                    if (obj.storeGrade === storeGrade) {
                        store = {
                            storeId: obj.storeId,
                            activityId: this.activityId
                        };
                        let activityStoreId = obj.activityStoreId;
                        if (activityStoreId) {
                            store.activityStoreId = activityStoreId;
                        }
                        result.push(store);
                    }
                }
                return result;
            },

            ctrlAllstores(data) {
                this.allStores = data;
                return data;
            },

            ctrlTreeData: function (data) {
                ctrlData(data);
                this.treeData = data;

                function ctrlData(list) {
                    let item, l;
                    l = list.length;
                    for (let i = 0; i < l; i++ ) {
                        item = list[i];
                        item.name = item.storeName;
                        item.title = item.storeName || "-";
                        item.expanded = setExpanded(item);//!!item.selected;

                        if (item.children && item.children.length > 0){
                            ctrlData(item.children);
                            item.folder = true;
                        }
                    }
                }

                // 判断是否展开
                function setExpanded(item) {
                    let flag = false;
                    searchChildren(item.children);
                    return flag;

                    function searchChildren(children) {
                        children = children || [];
                        let l = children.length;
                        let child;
                        for (let i = 0; i < l; i++ ) {
                            child = children[i];
                            if (child.selected){
                                flag = true;
                            }else{
                                searchChildren(child.children);
                            }
                        }
                    }
                }
            },

            updateQueryDs(key, value, record, ds) {
                const queryData = this.queryDs.getCurrentData();
                if (this.countryId != queryData.countryId){
                    this.countryId = queryData.countryId;
                }
                if (this.cityId != queryData.cityId) {
                    this.cityId = queryData.cityId;
                }
                if (this.activityType != queryData.activityType) {
                    this.activityType = queryData.activityType;
                }
                if (this.activityStoreId != queryData.storeId) {
                    this.activityStoreId = queryData.storeId;
                }
            },

            onUpdatedTree(tree){
                console.log(tree);
            },

            //获取二维码
            getEwm(){
                let ewmUrl = "/vendor/ewm/getQRCode?content=" + encodeURIComponent(this.ewmDomain)  + "&iconUrl=default";
                window.open(ewmUrl)
            },

            gotoEditBenefit(data){
                let activityData = this.$base.deepCopy(this.queryDs.getCurrentData());
                // 避免后端报错，去除提交不必要的数据
                delete activityData.beginTime;
                delete activityData.endTime;
                delete activityData.regBeginTime;
                delete activityData.regEndTime;
                delete activityData.showBeginTime;
                delete activityData.showEndTime;

                this.$refs.editBenefitWin.show(activityData, this.benefitsDs.getAllData(), data);
            },

            gotoEditItem(){
                let activityData = this.$base.deepCopy(this.queryDs.getCurrentData());
                // 避免后端报错，去除提交不必要的数据
                delete activityData.beginTime;
                delete activityData.endTime;
                delete activityData.regBeginTime;
                delete activityData.regEndTime;
                delete activityData.showBeginTime;
                delete activityData.showEndTime;
                this.$refs.editItemWin.show(activityData, this.itemsDs.getAllData());
            },

            onUpdatedBenefit(){
                this.benefitsDs.query();
            },
            onUpdatedItem(){
                this.itemsDs.query();
            },
            onGetActivityId(activityId){
                this.benefitsDs.setQueryPara({
                    activityIds: activityId
                });
                this.itemsDs.setQueryPara({
                    activityId: activityId
                });
                this.storesDs.setQueryPara({
                    activityId: activityId
                });

                this.onUpdatedBenefit();
                this.onUpdatedItem();
                this.storesDs.query();

                let record = this.queryDs.getCurrentRecord();
                if (record){
                    record.setValue("activityId", activityId);
                }
            }
        },

        created(){
//            this.storeId  =this.$route.query.storeId;
            this.type = this.$route.query.type;

            let activityId = this.activityId = this.$route.query.activityId;
            this.queryPara = {
                activityId: activityId
            };
        },

        watch: {
            activityId(activityId, old){
                if (!old && !!activityId) {
                    this.onGetActivityId(activityId);
                }
            },

            countryId(countryId) {
                if (countryId === '0000') {
                    this.storeDs.query({
                        countryId: this.countryId,
                    })
                }
            },

            cityId(cityId) {
                if (this.countryId !== '0000') {
                    this.storeDs.query({
                        countryId: this.countryId,
                        cityId: cityId
                    })
                }
            },

            activityStoreId(activityStoreId) {
                this.storeId = this.queryDs.getCurrentData().storeId;
                if (!!this.storeDs.getCurrentData()){
                    this.allStores.forEach((store) => {
                        if (store.storeId === activityStoreId) {
                            this.$refs.address.setValue(store.address);
                        }
                    })
                }
            },

            activityType(activityType) {},

        },

        computed: {
          /** 编辑状态时候，国家地区和门店不可编辑 **/
            editable(){
              return this.type != "edit";
            }
        },

        mounted(){}
    }
</script>

<style lang="scss" scoped>
    .btn-group-bottom {
        z-index: 1000;
        padding: 20px 0;
        position: fixed;
        bottom: 0;
        left: 220px;
        right: 0;
        text-align: center;
        background-color: rgba(0,0,0,0.1)
    }
    .col-sm-2 {
        width: 16.66666667%;
        float: left;
    }
    .col-sm-5 {
        width: 41.66666667%;
        float: left;
    }
    .control-label{
        height: 24px;
        line-height: 24px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
    }
    .time-separate {
        text-align: center;
        padding-top: 30px;
        font-size: 20px;
    }
    .uploader-headPic {
        margin: 20px 0;
    }
    .relate-item-num {
        padding-bottom: 10px;
    }

</style>

<style>
    .ui-helper-hidden{
        display: block;
    }
    .sub-title {
        margin-top: 40px;
    }
</style>
