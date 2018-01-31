<template>
    <div class="main-container">
        <div>
            <sk-data-set v-model="itemListDs" :before-query="beforeRefreshItemTable" :pagination="true" page-size="10" @load="onLoadItemList" @update="onUpdateSort" :auto-query="false" :query-bind="queryDs"
                         :query-service="itemModule.getItems"></sk-data-set>
            
            <sk-data-set auto-query @load="onLoadGradeInfoDs" :query-service="baseData.getAccountGrade"></sk-data-set>
            <sk-data-set v-model="queryDs" :auto-create="true"></sk-data-set>

            <sk-data-set v-model="bigCatalogDs" :auto-query="true"
                         :query-service="baseData.getRootCatalogs"></sk-data-set>
            <sk-data-set v-model="catalogDs" :auto-query="false" :bind="queryDs" bind-field="rootCatalogId"
                         bind-para-key="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>

            <sk-data-set v-model="countriesDs" auto-query :bind="queryDs"
                         :query-service="baseData.vendorCountries"></sk-data-set>

            <sk-data-set v-model="storeDs" :auto-query="false" :bind="queryDs" bind-field="countryId"
                         :query-service="baseData.getStoreByCountry"></sk-data-set>
            
        </div>

        <div style="margin-top: 30px;">
            <sk-form :bind="queryDs">
                <sk-fold :title="$t('queryPara')">
                    <sk-row>
                        <sk-col :size="2">
                            <sk-select :value="countryId" :readonly="!!storeId" :null-title="$t('global')" :bind="queryDs"
                                       :label="$t('country')" name="countryId" :option-bind="countriesDs"
                                       display-field="countryName" value-field="countryId"></sk-select>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-select :value="storeId" :bind="queryDs" :null-title="$t('wholeCountry')" :label="$t('store')" name="storeId"
                                       display-field="storeName" value-field="storeId" :option-bind="storeDs"></sk-select>
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
                    <sk-button v-if="isStore && canEdit" :label="$t('batchOnline')" action="patchOnline" @click="itemListAction" primary></sk-button>
                    <sk-button v-if="isStore && canEdit" :label="$t('batchOffline')" action="patchOff" @click="itemListAction"></sk-button>

                    <sk-button v-if="isBrand && canEdit" primary :label="$t('assignCountry')" action="assignCountry" @click="itemListAction"></sk-button>

                    <sk-button v-if="isCountry && canEdit" primary :label="$t('assignStore')" action="assignStore" @click="itemListAction"></sk-button>
                    <sk-button v-if="!isStore && canEdit" :label="$t('cancelAssign')" action="cancelAssign" @click="itemListAction"></sk-button>

                    <sk-button v-if="canEdit" :label="$t('batchDelete')" action="patchDelete" @click="itemListAction"></sk-button>

                    <sk-button v-if="isStore && canEdit" primary :label="$t('saveSort')" action="sortSave" @click="itemListAction"></sk-button>
                </div>

                <div slot="row">
                    <sk-column name="index" :title="$t('lineNo')" width="100px" align="center" :formatter="renderIndex"></sk-column>
                    <sk-column name="headAttacheList" view-type="img" align="center" :title="$t('thImg')"></sk-column>
                    <sk-column name="itemId" :title="$t('itemModelName')" :formatter="renderItemInfo" @cell-click="onClickOperationCell" align="center"></sk-column>
                    <sk-column name="catalogMappingList" :title="$t('itemCategory')" :formatter="renderCatalogs" align="center"></sk-column>
                    <sk-column name="itemTagMappings" :title="$t('itemTag')" :formatter="renderItemTag" align="center"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="factPrice" view-type="money" :title="$t('price')" align="center"></sk-column>
                    <sk-column name="discountPrice" :formatter="formatYkPrice" :title="$t('yaokPrice')" align="center"></sk-column>
                    <sk-column :if-hide="!isBrand" name="assignCountryNum" :title="$t('assignCountryNum')" align="center"></sk-column>
                    <sk-column :if-hide="isStore" name="assignStoryNum" :title="$t('assignStoreNum')" align="center"></sk-column>
                    <sk-column :if-hide="isStore" name="onStoreNum" :title="$t('onlineStoreNum')" align="center"></sk-column>
                    <sk-column :if-hide="!isStore" name="shelfFlag" :title="$t('status')" :formatter="renderShelf" align="center"></sk-column>
                    <sk-column :if-hide="!(isStore && canEdit)" name="sort"  editable :title="$t('sortSet')" align="center"></sk-column>
                    <sk-column :if-hide="!(canEdit)" align="center" name="action" :title="$t('operation')" :formatter="renderOperation" @cell-click="onClickOperationCell"></sk-column>
                </div>
            </sk-table>
        </div>
    </div>
</template>


<script type="text/javascript">
    import baseData from "@/lib/dataModules/baseData"
    import itemModule from "@/lib/dataModules/item"
    import ArrayApi from "../../lib/utils/ArrayApi"
    import Money from "@/lib/utils/money"

    export default{
        data(){
            window.test = this;

            return {

                ifHideOperation: true,

                countryId: null, //国家id
                storeId: null, //商店id

                queryDs: null, //基本信息
                itemListDs: null,

                bigCatalogDs: null, //大类
                catalogDs: null, //小类
                countriesDs: null,
                storeDs: null,

                baseData,
                itemModule,

                queryType: "brand", //brand store country
                gradeData: null, //权限数据
                queryData: {}
            };
        },

        computed: {
            isCountry(){
                return this.queryType === 'country';
            },
            isStore(){
                return this.queryType === 'store';
            },
            isBrand(){
                return this.queryType === 'brand';
            },
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
                            return true;
                        }
                    }else if (queryData.storeId == gradeData.storeId){
                            return true;
                    }
                }
                return false;
            }
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
                    if (shelfFlag === 'OFFLINE') {
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

            //渲染index
            renderIndex(v, index){
                return parseInt(index + 1);
            },

            renderCatalogs(v){
                v = v || [];
                return v.join(" ") || '-'; //ArrayApi.getFieldValue(v, "catalogName", " ");
            },

            // 渲染活动标签
            renderItemTag(v){
                if (!v){
                    return this.$t('none');
                }else {
                    // v 循环给出itemTagMappings
                    let str = '';
                    v.forEach( item => {
                        str += `${item.desc}<br>`;
                    });
                    return str;
                }
            },

            formatYkPrice(v){
                return !!v ? Money.format(v) : this.$t('none');
            },

            renderItemInfo(v, index, record){
                let html = "<div class='itemId'><a class='itemDetail'>" + record.getValue("itemName") + "</a></div>";
                html += "<div class='disabled-text'>" + record.getValue("itemModel") + "</div>";
                return html;
            },

            renderShelf(v){
                let html;
                if ("ONLINE" === v){
                    html = this.$t('onlineAlready');
                }else{
                    html = this.$t('offlineAlready');
                }
                return html;
            },

            onLoadItemList(){
                let para = this.itemListDs.lastQueryPara, queryType;

                if (para.storeId){
                    queryType = "store";
                }else if(para.countryId){
                    queryType = "country";
                }else{
                    queryType = "brand";
                }

                this.queryType = queryType;
                this.queryData = Object.assign({}, para);

                this.resetItemListSort();
            },

            onClickOperationCell(e, value, name, index, record){
                let actionType = e.target.className;

                switch (actionType){
                    case "edit":
                        this.gotoEditItem(record);
                        break;
                    case "delete":
                        this.deleteItem(record);
                        break;
                    case "itemDetail":
                        this.gotoItemDetail(record);
                        break;
                    case "assignDetail":
                        this.gotoAssignDetail(record);
                        break;
                    case "online":
                        this.online(record);
                        break;
                    case "offline":
                        this.offline(record);
                        break;

                }
            },

            /********************操作sort************************/
            resetItemListSort(lastData){
                let item, data, last;
                let records = this.itemListDs.records || [];
                for (let i = 0, l = records.length; i < l; i++) {
                    item = records[i].getData();

                    last = ArrayApi.getDataByAttr(lastData, "itemId", item.itemId);
                    if (last && last[0]){
                        item.oldSort = last[0].sort;
                        records[i].setValue("sort", item.oldSort);
                    }else{
                        item.oldSort = item.sort;
                    }
                }
                return data;
            },

            onUpdateSort(value, key, record, ds){
                if (key == "sort"){
                    let records = ds.records, index = 0;
                    for(let i = 0, l = records.length; i < l; i++){
                        if (records[i] == record){
                            index = i;
                            break;
                        }
                    }
                    //this.setItemListSort(index, parseInt(value), records);
                }
            },

            //自动+10的排序 去除
            setItemListSort(index, value, records){
                let record, sort;
                for(let i = index, l = records.length; i < l; i++){
                    record = records[i];

                    sort = parseInt(record.getValue("sort"));
                    if (sort < value){
                        sort = value + 10;
                        record.setValue("sort", sort);
                    }
                }

            },

            //保存排序
            saveItemListSort(data){
                data = data || this.getSaveSortItemData();
                if (data.length > 0){
                    itemModule.batchUpdateItemSort.execute({
                        data: {
                            itemListString: JSON.stringify(data)
                        },
                        success: function () {
                            this.$store.commit("message", this.$t('saveSuccess'));
                            this.resetItemListSort(data);
                        }.bind(this)
                    });
                }
            },

            //获取可以保存的sort
            getSaveSortItemData(ds){
                ds = ds || this.itemListDs;
                let data = ds.getAllData() || [];
                let result = [], item;
                for (let i = 0, l = data.length; i < l; i++) {
                    item = data[i];
                    if (item.oldSort != item.sort){
                        result.push({
                            sort: item.sort,
                            itemId: item.itemId
                        });
                    }
                }
                return result;
            },

            beforeRefreshItemTable(ds){
                let result = this.getSaveSortItemData(ds);

                if (result.length > 0) {
                    this.$store.commit("confirm", {
                        message: this.$t('haveAlterData'),
                        ok: function () {
                            this.saveItemListSort(result);
                            result = null;
                        }.bind(this)
                    });
                }
                return true;
            },

            //加载账号级别 品牌 国家 门店
            onLoadGradeInfoDs(records){
                let data = this.gradeData = records[0].getData();
                let para = {};
                if (!data.hasBrandGlobal){
                    para.countryId = data.countryId;
                    if(data.hasCountry){
                        this.countryId = data.countryId;
                    }else if(data.hasStore){
                        this.countryId = data.countryId || data.countryAuthList[0];
                        this.storeId = data.storeId;
                        para.storeId = data.storeId;
                    }
                }
                this.itemListDs.query(para);
            },

            //上架
            online(records){
                //把records转化为数组
                if (!(records instanceof Array)) {
                    records = [records];
                }

                itemModule.online.execute({
                    data: {
                        itemIds: this.getIds(records).join(",")
                    },
                    mask: {
                        info: this.$t("saving")
                    },
                    success: function () {
                        this.$store.commit("message", this.$t('onlineSuccess'));
                        this.itemListDs.updateRecordsData(records, {
                            shelfFlag: "ONLINE"
                        });
                        records = null;
                    }.bind(this)
                });
            },

            //下架
            offline(records){
                //把records转化为数组
                if (!(records instanceof Array)) {
                    records = [records];
                }

                itemModule.offline.execute({
                    data: {
                        itemIds: this.getIds(records).join(",")
                    },
                    mask: {
                        info: this.$t('saving')
                    },
                    success: function () {
                        this.$store.commit("message", this.$t('offlineSuccess'));
                        this.itemListDs.updateRecordsData(records, {
                            shelfFlag: "OFFLINE"
                        });
                        records = null;
                    }.bind(this)
                });
            },

            //删除商品
            deleteItem(records) {
                if (!(records instanceof Array)) {
                    records = [records];
                }
                this.$store.commit("confirm", {
                    message: this.$t("DeleteNow"),
                    ok: function () {
                      itemModule.deleteByIds.execute({
                        data: {
                          itemIds: this.getIds(records).join(",")
                        },
                        mask: {
                          info: this.$t("saving")
                        },
                        success: function () {
                          this.itemListDs.delete(records);
                          records = null;
                        }.bind(this)
                      });
                    }.bind(this)
                });
            },

            //取消分配
            cancelAssign(records) {
                if (!(records instanceof Array)) {
                    records = [records];
                }
                itemModule.cancelAssign.execute({
                    data: {
                        itemIds: this.getIds(records).join(",")
                    },
                    mask: {
                        info: this.$t("saving")
                    },
                    success: function () {
                        this.itemListDs.updateRecordsData(records, {
                            assignCountryNum: "0",
                            assignStoryNum: "0",
                            onStoreNum: 0,
                            shelfFlag: "OFFLINE"
                        });
                    }.bind(this)
                });
            },

            //去分配国家
            gotoAssignCountry(records){
                this.$store.dispatch('router/push', {
                    title: "分配国家",
                    name: "page.item.assignCountry",
                    query: {
                        ids:this.getIds(records).join(",")
                    }
                });
            },

            //去分配门店
            gotoAssignStore(records){
                this.$store.dispatch('router/push', {
                    title: "分配门店",
                    name: "page.item.assignStore",
                    query: {
                        ids:this.getIds(records).join(",")
                    }
                });
            },

            //去查看分配详情
            gotoAssignDetail(record){
                this.$store.dispatch('router/push', {
                    title: "分配详情",
                    name: "page.item.assignDetail",
                    query: {
                        itemId: record.getValue("itemId"),
                        type: this.queryType,
                        storeId: this.queryData.storeId,
                        countryId: this.queryData.countryId
                    }
                });
            },

            //去编辑
            gotoEditItem(record){
                this.$store.dispatch('router/push', {
                    title: "商品编辑",
                    name: "page.item.edit",
                    query: {
                        itemId: record.getValue("itemId")
                    }
                });
            },

            gotoItemDetail(record){
                this.$store.dispatch('router/push', {
                    title: "商品详情",
                    name: "page.item.detail",
                    query: {
                        itemId: record.getValue("itemId")
                    }
                });
            },

            /*********************action操作*************************/
            itemListAction(action){
                let records = this.itemListDs.getSelectedRecords();
                switch (action) {
                    case "patchOff":
                        records = this.filterRecords(records, "shelfFlag", "ONLINE"); //过滤下架的数据
                        if (records.length > 0) {
                            this.offline(records);
                        }
                        break;

                    case "patchOnline":
                        records = this.filterRecords(records, "shelfFlag", "OFFLINE"); //过滤下架的数据
                        if (records.length > 0) {
                            this.online(records);
                        }
                        break;

                    case "assignCountry":
                        if (records.length > 0) {
                            this.gotoAssignCountry(records);
                        }
                        break;

                    case "assignStore":
                        if (records.length > 0) {
                            this.gotoAssignStore(records);
                        }
                        break;

                    case "cancelAssign":
                        if (records.length > 0) {
                            this.cancelAssign(records);
                        }
                        break;

                    case "patchDelete":
                        if (records.length > 0) {
                            this.deleteItem(records);
                        }
                        break;

                    case "sortSave":
                        this.saveItemListSort();
                        break;
                }

                if (records.length > 0){
                    this.$refs.itemListTable.selectAll(false);
                }
            },

            //获取ids 用于更新
            getIds(records){
                let result = [];
                for (let i = 0, l = records.length; i < l; i++) {
                    result.push(records[i].getValue("itemId"));
                }
                return result;
            },

            //过滤数据
            filterRecords(records, key, value){
                let result = [], record;
                for (let i = 0, l = records.length; i < l; i++) {
                    record = records[i];
                    if (record.getValue(key) == value) {
                        result.push(record);
                    }
                }
                return result;
            }
        }
    }
</script>
