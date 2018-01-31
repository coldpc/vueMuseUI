<template>
    <div class="main-container">
        <div>
            <sk-data-set v-model="queryDs"  :auto-create="!itemId" :parse-data="ctrlItemData" :auto-query="!!itemId" :query-para="{itemId: itemId}" :query-service="itemModule.getItemById"></sk-data-set>
            
            <sk-data-set v-model="bigCatalogDs"  :auto-query="true" :query-service="baseData.getRootCatalogs"></sk-data-set>
            <sk-data-set v-model="catalogDs" :bind="queryDs" bind-field="parentCatalogId" :query-service="baseData.getCatalogsByParentId"></sk-data-set>
            <sk-data-set v-model="brandDs"  :parse-data="ctrlBrandData" auto-query :query-service="baseData.getBrands"></sk-data-set>
            <sk-data-set v-model="currencyDs" :auto-query="true" :query-service="baseData.getCurrencyList"></sk-data-set>
            
            <sk-data-set v-model="tagDs" @ready="onTagDsReady" :auto-query="false" :parse-data="initTagData"></sk-data-set>
            <sk-data-set v-model="attrDs"  @ready="onAttrDsReady" :parse-data="ctrlAttrData" :bind="!!itemId ? null : queryDs" :query-para="{type: itemModule.enumeration.baseInfoType.attr}" bind-para-key="catalogId" bind-field="parentCatalogId" :query-service="itemModule.getItemBaseInfo"></sk-data-set>
            <sk-data-set v-model="specTypeDs" @update="onUpdateSpecType" @remove="onUpdateSpecType" @ready="onSpecTypeReady" :parse-data="initSpecTypeData" :bind="!!itemId ? null : queryDs" :query-para="{type: itemModule.enumeration.baseInfoType.spec}" bind-para-key="catalogId" bind-field="parentCatalogId" :query-service="itemModule.getItemBaseInfo"></sk-data-set>
            <sk-data-set v-model="skuDs"  @ready="onSkuDsReady" :auto-query="false" :parse-data="ctrlSkuData"></sk-data-set>
        
        </div>
        
        <div style="margin-top: 30px;">
            <sk-form :bind="queryDs">
                <sk-fold :title="$t('baseInfo')">
                    <sk-row>
                        <sk-col :size="1">
                            <sk-select ref="brand_selector" :readonly="!editable" :value="defaultBrand" :default-value="defaultBrand" display-field="brandName" value-field="brandGlobalId" :option-bind="brandDs" :bind="queryDs" :label="$t('brand')" name="brandGlobalId"></sk-select>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-text-input :readonly="!editable" required :bind="queryDs" :label="$t('itemName')" name="itemName"></sk-text-input>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-text-input :readonly="!editable" required :label="$t('itemModel')" name="itemModel"></sk-text-input>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-select ref="big_catalog_selector" v-model="bigCatalog" :readonly="!!itemId" required :option-bind="bigCatalogDs" display-field="catalogName" ename="enName" value-field="catalogId" :label="$t('category')" name="parentCatalogId"></sk-select>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-select :readonly="!editable" required value-type="item" :label="$t('subCategory')" :multiple="true" ename="enName" :option-bind="catalogDs" value-field="catalogId" display-field="catalogName" name="catalogList"></sk-select>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-select :readonly="!editable" required :label="$t('currency')" name="unit" :option-bind="currencyDs" display-field="exchangeUnit" value-field="exchangeUnit"></sk-select>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-money :min="0.01" :readonly="!editable" required :label="$t('price')" name="factPrice"></sk-money>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-money :min="0.01" :readonly="!editable" :label="$t('ykprice')" name="discountPrice"></sk-money>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-text-input :min="0" :readonly="!editable" :label="$t('ykpricecount')" type="number" name="discountSecondCount"></sk-text-input>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="2">
                            <sk-text-input :readonly="!editable" :label="$t('remark')" name="remark"></sk-text-input>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-tag required :readonly="!editable" :label="$t('keyWords')" :help-text="$t('maxNum', {num:'9'})" name="tag"></sk-tag>
                        </sk-col>
                    </sk-row>
                </sk-fold>
                
                <sk-row>
                    <sk-attach :readonly="!editable" @upload-failed="uploadFailed"  @assign-id-updated="uploadSuccess"  source="item" required ref="headPicAttach" required :max-files="1" :label="$t('itemHeadPic')" :remark="$t('itemHeadPicRemark')" name="headAssignId" :file-size-limit="2"></sk-attach>
                </sk-row>
                <sk-row>
                    <sk-attach :readonly="!editable" @upload-failed="uploadFailed" @assign-id-updated="uploadSuccess" source="item" ref="bodyPicAttach" required :label="$t('itemBodyPic')" :remark="$t('itemBodyPicRemark')" name="bodyAssignId" :file-size-limit="2"></sk-attach>
                </sk-row>
                <sk-row>
                    <sk-attach :readonly="!editable" @upload-failed="uploadFailed" @assign-id-updated="uploadSuccess" @no-file-change="uploadSuccess" attach-type="VIDEO" source="item"  ref="videoPicAttach" :height="200" :width="350" :max-files="1" :row-num="2" :label="$t('video')" :remark="$t('itemVideoRemark', {size: '50'})" name="videoAssignId" accept="video/mp4" :file-size-limit="50"></sk-attach>
                </sk-row>
            </sk-form>
        </div>
        
        <sk-fold :title="$t('itemTag')">
            <sk-table ref="TagTable" :bind="tagDs">
                <div slot="buttons" v-if="editable">
                    <sk-button primary :label="$t('add')" @click="addTags"></sk-button>
                </div>
                <div slot="row">
                    <sk-column align="center" width="20px" :formatter="renderItemTagType" name="itemTagType" required :editable="false" :title="$t('tagType')"></sk-column>
                    <sk-column align="center" width="20px" name="beginDate" view-type="time" required :editable="false" :title="$t('startTime')"></sk-column>
                    <sk-column align="center" width="20px" name="endDate" view-type="time" required :editable="false" :title="$t('endTime')"></sk-column>
                    <sk-column align="center" width="20px" name="id" :title="$t('operation')" :formatter="tagOperation" @cell-click="clickTagOperation" :if-hide="!editable"></sk-column>
                </div>
            </sk-table>
            <!--编辑标签-->
            <add-tag ref="addTagWin" @saveTagData="saveTagData" @saveEditTagData="saveEditTagData"></add-tag>
        </sk-fold>
        
        <sk-fold :title="$t('itemAttr')" v-show="hasBigCatalog">
            <sk-table ref="attrTable" :bind="attrDs">
                <div slot="buttons" v-if="editable">
                    <sk-button primary :label="$t('add')" action="add" :bind="attrDs"></sk-button>
                </div>
                <div slot="row">
                    <sk-column align="center" width="20px" name="attributeName" required :editable="editable" :title="$t('attrName')"></sk-column>
                    <sk-column align="center" width="20px" name="attributeValue" required :editable="editable" :title="$t('attrContent')"></sk-column>
                    <sk-column align="center" width="20px" name="sort" type="number" required :min="0" :editable="editable" :title="$t('sort')"></sk-column>
                    <sk-column align="center" width="20px" name="id" :title="$t('operation')" :formatter="attrOperation" @cell-click="clickAttrOperation" :if-hide="!editable"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <sk-fold :title="$t('itemSpec')" v-show="hasBigCatalog">
            <sk-table ref="specTable" :bind="specTypeDs">
                <div slot="row">
                    <sk-column align="center" width="25%" name="specTypeName" :editable="editable" required :title="$t('specName')"></sk-column>
                    <sk-column align="center" name="specValues" :title="$t('specContent')"></sk-column>
                    <sk-column align="center" width="25%" name="crid" :if-hide="!editable" :title="$t('operation')" :formatter="specOperation" @cell-click="clickSpecOperation"></sk-column>
                </div>
            </sk-table>
            <div v-if="editable" style="text-align: center;margin-top: 20px;">
                <sk-button primary :label="$t('add')" @click="addSpecType"></sk-button>
                <sk-button primary :label="$t('createSKU')" @click="onClickGenerate"></sk-button>
            </div>
            <!--编辑规格-->
            <edit-spec ref="editSpecWin" @saveEditSpecData="saveEditSpecData"></edit-spec>
        </sk-fold>
        
        <sk-fold :title="$t('itemSku')" v-show="hasBigCatalog">
            <sk-table ref="skuTable" :bind="skuDs" :show-checkbox="editable" :editable="editable" @select="onSelectSKU">
                <div slot="buttons" v-if="editable">
                    <sk-button :label="$t('uploadImg')" primary>
                        <input v-show="hasSelectSku" class="file-sku" type="file" accept="image/gif, image/jpeg, image/png" @change="onChangeSKuPic">
                        <div v-show="false">
                            <sk-attach @error=""  @assign-id-updated="uploadSkuSuccess" attach-type="img" source="item"  ref="skuAtta" :height="1" :width="1" :max-files="1" :row-num="2" :label="$t('uploadImg')" :file-size-limit="2"></sk-attach>
                        </div>
                    </sk-button>
                    <sk-button :label="$t('delete')" action="delete" :bind="skuDs"></sk-button>
                </div>
                <div slot="row">
                    <sk-column ref="test" class-name="ellipsis3" align="left" name="skuName" width="25%" :title="$t('skuName')"></sk-column>
                    <sk-column align="center" name="skuModel" :editable="editable" :title="$t('itemModel')"></sk-column>
                    <sk-column align="center" name="skuPrice" :editable="editable" edit-type="money" :min="0.01" :title="$t('price')"></sk-column>
                    <sk-column align="center" name="unit" :title="$t('currency')"></sk-column>
                    <sk-column align="center" name="headAttachList" view-type="img" :title="$t('picture')"></sk-column>
                    <sk-column align="center" name="crid" :if-hide="!editable" :title="$t('operation')" :formatter="attrOperation" @cell-click="clickSkuOperation"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <!--预览手机-->
        <sk-view ref="view" :view-data="viewData"></sk-view>
        
        <sk-fixed-bottom>
            <sk-button v-if="editable" primary :label="$t('submit')" @click="save"></sk-button>
            <sk-button :label="$t('view')" @click="viewItem"></sk-button>
        </sk-fixed-bottom>
    </div>
</template>


<script type="text/javascript">
    import baseData from "@/lib/dataModules/baseData"
    import itemModule from "@/lib/dataModules/item"
    import ArrayApi from "@/lib/utils/ArrayApi"
    import Money from "@/lib/utils/money"
    
    import editSpec from "./editSpec"
    import addTag from "./addTag"
    
    import viewItemDetail from "@/components/page/item/viewItemDetail"
    
    
    var _$id$_ = Math.floor(Math.random() * 100000000000 + 100000000000);
    
    export default{
        name: 'item',
        components: {"edit-spec": editSpec, "sk-view": viewItemDetail, "add-tag": addTag},
        props: {
            editable: {
                type: Boolean,
                default: false
            }
        },
        data(){
            window.test = this;
            return {
                queryDs: null, //基本信息
                hasChangeSpec: false,
                
                bigCatalogDs: null, //大类
                catalogDs: null, //小类
                currencyDs: null,
                brandDs: null,
                
                specTypeDs: null, //商品规格类型
                attrDs: null, //商品属性
                skuDs: null,
                tagDs: null,
                
                deleteAttrData: [],
                deleteTagData: [],
                specData: [], //规格数据
                deleteSkuData: [],
                
                itemId: this.$route.query.itemId, //查看的itemId
                
                uploadSuccessNum: 0,
                
                bigCatalog: "", //根据大类控制视图
                
                baseData,
                itemModule,
                defaultBrand: "",
                
                viewData: {},
                
                hasSelectSku: false
            };
        },
        
        watch: {
        
        },
        
        computed: {
            hasBigCatalog(){
                return !!this.bigCatalog;
            }
        },
        
        methods: {
            /***************选择品牌*******************/
            ctrlBrandData(data){
                //设置默认值
                this.defaultBrand = data.defaultBrandGlobalId;
                
                //返回品牌
                return data.brandGlobals;
            },
            
            /** 标签编辑 **/
            
            renderItemTagType(v,index,record){
                return record.data.desc;
            },
            
            tagOperation(){
                return "<a class='edit'>" + this.$t('edit') +"</a>" + "<a style='margin-left: 10px;' class='delete'>" + this.$t('delete') +"</a>";
            },
            
            onTagDsReady(ds){
                ds.addEventListener(ds.event.remove, this.deleteTagRow);
            },
            deleteTagRow(record, index){
                let data = record.getData();
                if (data.itemId){
                    data.deleteFlag = 1;
                    this.deleteTagData.push(data);
                }
            },
            
            clickTagOperation(e, v, name, index, record){
                let type = e.target.className;
                if (type === "delete"){
                    this.tagDs.remove(index);
                }else if(type === 'edit'){
                    this.$refs.addTagWin.show(record.data, 'edit', index);
                }
            },
            
            
            addTags(){
                // 判断最多只能填多少标签 循环剔除deleteFlag = 1的数据
                let itemTagsData = this.queryDs.getCurrentData(),
                        num = 0;
                if (!!itemTagsData.itemTagMappings){
                    itemTagsData.itemTagMappings.forEach( item => {
                        if (!item.deleteFlag || item.deleteFlag === 0){
                            num++;
                        }
                    });
                    if (num === 3){
                        this.$store.commit("message", "最多只能三个标签");
                        return;
                    }
                }
                this.$refs.addTagWin.show({}, 'add');
            },
            
            saveTagData(tagData) {
                tagData.itemId = this.itemId;
                if (tagData.endTime < tagData.beginTime) {
                    this.$store.commit('message', '结束时间不能小于开始时间');
                    return;
                }
                this.tagDs.add(tagData);
                this.queryDs.getCurrentRecord().setValue("itemTagMappings",  this.tagDs.getAllData());
            },
            
            saveEditTagData(tagData, index){
                let originData = this.queryDs.getCurrentData();
                tagData.itemId = this.itemId;
                originData.itemTagMappings[index] = tagData;
                this.tagDs.setData(originData.itemTagMappings);
            },
            
            /**********属性编辑************************/
            attrOperation(){
                return "<a class='delete'>" + this.$t('delete') + "</a>";
            },
            
            onAttrDsReady(ds){
                ds.addEventListener(ds.event.remove, this.deleteAttrRow);
            },
            deleteAttrRow(record){
                let data = record.getData();
                if (data.itemId){
                    data.deleteFlag = 1;
                    this.deleteAttrData.push(data);
                }
            },
            clickAttrOperation(e, v, name, index, record){
                let type = e.target.className;
                if (type === "delete"){
                    this.attrDs.remove(index);
                }
            },
            ctrlAttrData(data){
                let obj, current = this.queryDs.getCurrentData();
                
                //防止未加载queryDs
                if (!current){return data;}
                
                for (var i = 0, l = data.length; i < l; i++) {
                    obj = data[i];
                    if (obj.attributeName == "商品名称"){
                        obj.attributeValue = current.itemName;
                    }else if (obj.attributeName == "商品型号"){
                        obj.attributeValue = current.itemModel;
                    }
                    delete obj.id;
                }
                this.attrData = data;
                return data;
            },
            
            /************spec编辑**************************/
            addSpecType(){
                this.specTypeDs.add({
                    crid: this.createId()
                });
            },
            
            initSpecTypeData(data){
                //如果有itemId说明是查询而来无需处理
                if (this.itemId){
                    return data;
                }
                
                let obj;
                for (let i = 0, l = data.length; i < l; i++) {
                    obj = data[i];
                    obj.specTypeName = obj.attributeName;
                    obj.specValues = "";
                    obj.crid = this.createId();
                }
                
                //每次加载都要重新设置sku
                this.deleteAllSku();
                this.specData = []; //清楚spec
                
                return data;
            },
            
            //加载specData
            loadSpecData(specData){
                let obj;
                
                //先保存规格数据
                specData = this.specData = specData || [];
                
                //分类
                let classifyData = ArrayApi.classify(specData, "specName");
                
                let id, specTypes = [], kineSpecs, spec; //分类id 防止修改名称
                
                for (let i = 0, l = classifyData.length; i < l; i++) {
                    obj = classifyData[i];
                    id = this.createId();
                    kineSpecs = obj.data; //类型下的数据
                    
                    //创建一个类型
                    specTypes.push({
                        crid: id,
                        specTypeName: obj.specName,
                        specValues: ArrayApi.getFieldValue(kineSpecs, "specValue").join(",")
                    });
                    
                    //给每个类型下面的规格data增加绑定的id
                    for (let i = 0, l = kineSpecs.length; i < l; i++) {
                        spec = kineSpecs[i];
                        spec.bindId = id;
                        spec.crid = this.createId();
                    }
                }
                this.specTypeDs.setData(specTypes);
            },
            
            //规格数据分类
            classifySpecData(specData){
                let obj;
                
                //先保存规格数据
                specData = specData || [];
                
                //分类
                let classifyData = ArrayApi.classify(specData, "specName");
                
                let id, specTypes = [], itemSpec; //分类id 防止修改名称
                for (let i = 0, l = classifyData.length; i < l; i++) {
                    obj = classifyData[i];
                    id = this.createId();
                    itemSpec = obj.data; //类型下的数据
                    
                    //创建一个类型
                    specTypes.push({
                        crid: id,
                        specTypeName: obj.specName,
                        specValues: ArrayApi.getFieldValue(itemSpec, "specValue").join(",")
                    });
                    
                    //给每个类型下面的规格data增加绑定的id
                    for (let i = 0, l = itemSpec.length; i < l; i++) {
                        itemSpec[i].bindId = id;
                    }
                }
                return specTypes;
            },
            
            //规格操作
            specOperation(){
                return "<a class='edit'>" + this.$t('edit') +"</a>" + "<a style='margin-left: 10px;' class='delete'>" + this.$t('delete') +"</a>";
            },
            
            //操作规格数据
            clickSpecOperation(e, v, name, index, record){
                let type = e.target.className;
                if (type == "delete"){
                    this.deleteSpecByParentId(this.specData, record.getValue("crid"));
                    this.specTypeDs.remove(index);
                }else if (type == "edit"){
                    //每个规格都会有绑定的父级id
                    let parentId = record.getValue("crid");
                    
                    //获取此规格的数据
                    let singleSpecData = this.getEditSpecData(this.specData, parentId);
                    
                    //再过滤已经删除的数据
                    let pecEditData = this.$base.deepCopy(singleSpecData);
                    
                    //设置本次编辑的parentId
                    let specName = record.getValue("specTypeName");
                    
                    //显示窗口
                    this.$refs.editSpecWin.show(pecEditData, specName, parentId);
                }
            },
            
            getEditSpecData(specData, bindId){
                let result = [], spec;
                for (var i = 0, l = specData.length; i < l; i++) {
                    spec = specData[i];
                    if (spec.bindId == bindId && spec.deleteFlag != 1){
                        result.push(spec);
                    }
                }
                return result;
            },
            
            deleteSpecByParentId(specData, bindId){
                let spec;
                for (let i = 0; i < specData.length; i++) {
                    spec = specData[i];
                    if (spec.bindId == bindId){
                        if (!spec.itemId){
                            specData.splice(i, 1);
                            i --;
                        }else{
                            specData[i].deleteFlag = 1;
                        }
                    }
                }
                return specData;
            },
            
            /**
             *
             * 保存规格非常麻烦
             * 只有一件事需要做 判断规格的值是否一致
             * 根据crid来判断是否是编辑原来的值
             *
             */
            saveEditSpecData(newSpecData, parentId){
                let specData = this.specData, spec, originSpec, crid;
                
                //移除同一个类型的所有数据
                for (let i =0; i < specData.length; i ++){
                    
                    spec = specData[i];
                    if (spec.bindId == parentId && spec.deleteFlag != 1){
                        specData.splice(i, 1);
                        i --;
                    }
                }
                
                //给newSpec添加id
                for (var i = 0, l = newSpecData.length; i < l; i++) {
                    newSpecData[i].crid = this.createId();
                }
                
                //新的规格数据
                this.specData = specData.concat(newSpecData);
                
                //展示在表格中 获取未删除的spec
                specData = ArrayApi.getDataByAttr(newSpecData, "deleteFlag", 1, true);
                
                let specTypeRecords = this.specTypeDs.records, specType, record, specs;
                for (let i = 0, l = specTypeRecords.length; i < l; i++) {
                    record = specTypeRecords[i];
                    
                    if (record.getValue("crid") == parentId){
                        specs = ArrayApi.getFieldValue(specData, "specValue");
                        record.setValue("specValues", specs.join(","));
                    }
                }
            },
            
            onSpecTypeReady(ds){
                ds.addEventListener(ds.event.update, this.saveEditSpecTypeName);
            },
            
            //修改specName的时候
            saveEditSpecTypeName(specTypeName, key, record){
                if (key == "specTypeName"){
                    let specData = ArrayApi.getDataByAttr(this.specData, "bindId", record.getValue("crid"));
                    for (let i = 0, l = specData.length; i < l; i++) {
                        specData[i].specName = specTypeName;
                    }
                }
            },
            
            // 更新规格类型
            onUpdateSpecType(value, key, record){
                if (key === 'specTypeName'){
                    let specName = this.parseSpecName(value);
                    if (value !== specName) {
                        record.setValue(key, specName);
                    }
                    this.hasChangeSpecData();
                }
            },
            
            // 格式化规格值的问题
            parseSpecName(specName) {
                specName = $.trim(specName);
                specName = specName.replace(/;|:|,|'/ig, " ");
                specName = $.trim(specName);
                return specName;
            },
            
            hasChangeSpecData(){
                this.hasChangeSpec = true;
            },
            
            hasGenerateSku(){
                console.log("spec saved");
                this.hasChangeSpec = false;
            },
            
            createId(){
                return ++_$id$_;
            },
            
            
            /**
             *
             * @param record
             * sku row
             *
             */
            onClickGenerate(){
                let sku = this.generateSKU();
                let ds = this.skuDs;
                let records = ds.records || [];
                
                for (let i = 0, l = records.length; i < l; i++) {
                    this.deleteSkuRow(records[i]);
                }
                
                ds.setData(sku);
                this.hasGenerateSku();
            },
            
            ctrlSkuData(data){
                let d = this.queryDs.getCurrentData(),
                        specData = this.specData;
                
                //判断queryDs是否存在数据
                let sku, mapList, a, b, map, spec;
                for (var i = 0, l = data.length; i < l; i++) {
                    sku = data[i];
                    
                    if (!!d) {
                        if (!sku.skuPrice) {
                            sku.skuPrice = d.factPrice;
                        }
                        
                        if (!sku.skuModel) {
                            sku.skuModel = d.itemModel;
                        }
                        
                        if (!sku.unit) {
                            sku.unit = d.unit;
                        }
                        
                        if (!sku.headAttachList) {
                            sku.headAttachList = this.$base.deepCopy(this.$refs.headPicAttach.viewList);
                        }
                    }else{
                        mapList = data[i].specSkuMappingList;
                        for (a = 0, b = mapList.length; a < b; a++) {
                            map = mapList[a];
                            spec = ArrayApi.getDataByAttr(specData, "specId", map.specId)[0];
                            
                            if (spec){
                                map.specName = spec.specName;
                                map.specValue = spec.specValue;
                                map.crid = spec.crid;
                            }else{
                                mapList.splice(a, 1);
                                a --;
                                b --;
                            }
                        }
                    }
                }
                
                return data;
            },
            
            initTagData(data){
                return data;
            },
            
            generateSKU(){
                let check = this.specTypeDs.sendVerify();
                if (!check){
                    this.$store.commit("message", this.$t('specTypeComplete'));
                    return;
                }
                
                let specData = ArrayApi.getDataByAttr(this.specData, "deleteFlag", 1, true); // 先获取所有未删除的spec
                specData = this.$base.deepCopy(specData);
                
                let classifyData = ArrayApi.classify(specData, "bindId"); //分类
                let spaceSign = ";", sku, l;
                
                if (classifyData.length < 1){
                    return;
                }
                
                sku = classifyData[0].data;
                l = classifyData.length;
                
                if (l > 1){
                    for (let i = 1; i < l; i++) {
                        sku = combination2Array(sku, classifyData[i].data);
                    }
                }else{
                    var temp, result = [], s;
                    for (let j = 0, l2 = sku.length; j < l2; j++) {
                        s = sku[j];
                        temp = {
                            skuName: (s.specName || "unknown name") + ":" + s.specValue,
                            specSkuMappingList: [s]
                        };
                        result.push(temp);
                    }
                    sku = result;
                }
                
                return sku;
                
                //排列组合两个数组
                function combination2Array(arr1, arr2) {
                    if (!arr2 || arr2.length == 0){
                        return arr1;
                    }else{
                        var  result = [], item1, item2, temp;
                        for (var i = 0, l1 = arr1.length; i < l1; i++) {
                            item1 = arr1[i];
                            for (var j = 0, l2 = arr2.length; j < l2; j++) {
                                temp = {
                                    skuName: (item1.skuName) || ( (item1.specName || "unknown name") + ":" + item1.specValue),
                                    specSkuMappingList: item1.specSkuMappingList || [item1]
                                };
                                item2 = arr2[j];
                                temp.skuName += spaceSign + (item2.specName || "unknown name") + ":" + item2.specValue;
                                temp.specSkuMappingList.push(item2);
                                result.push(temp);
                            }
                        }
                        return result;
                    }
                }
            },
            
            onSkuDsReady(ds){
                ds.addEventListener(ds.event.remove, this.deleteSkuRow);
            },
            
            deleteSkuRow(record){
                let data = record.getData();
                if (data.itemId){
                    data.deleteFlag = 1;
                    this.deleteSkuData.push(data);
                }
            },
            
            deleteAllSku(){
                let records = this.skuDs.records;
                for (var i = 0, l = records.length; i < l; i++) {
                    this.deleteSkuRow(records[i]);
                }
                this.skuDs.setData();
            },
            
            clickSkuOperation(e, value, name, index, record){
                let type = e.target.className;
                if (type == "delete"){
                    this.skuDs.remove(index);
                }
            },
            
            onChangeSKuPic(e){
                this.$refs.skuAtta.controller.selectFile(e.target);
                this.$refs.skuAtta.save();
            },
            uploadSkuSuccess(assignId, list){
                this.$refs.skuAtta.setValue();
                let skuList = this.skuDs.getSelectedRecords(), obj;
                for (let i = 0, l = skuList.length; i < l; i++) {
                    skuList[i].setValue("headAssignId", assignId);
                    skuList[i].setValue("headAttachList", list);
                }
                this.$refs.skuTable.selectAll(false);
            },
            
            checkSku(){
                //specList skuList 校验sku
                //现货区sku库 所有提交的sku必须在库中存在
                var specData = this.specData,
                        skuName,
                        errorMessage = "";
                
                let skuList = this.skuDs.getAllData(), specSkuMappingList, skuMap, findSpec;
                for (let i = 0, l = skuList.length; i < l; i++) {
                    specSkuMappingList = skuList[i]["specSkuMappingList"];
                    
                    for (let a = 0, b = specSkuMappingList.length; a < b; a++) {
                        skuMap = specSkuMappingList[a];
                        findSpec = ArrayApi.getDataByAttr(specData, "crid", skuMap.crid)[0];
                        
                        if (!findSpec || findSpec.specName != skuMap.specName || findSpec.specValue != skuMap.specValue){
                            console.log("检测到第" + (i + 1) + "条SKU" + "\"" + skuList[i].skuName + "\"" + "与规格不匹配，无法提交，请仔细检查确认此条SKU");
                            errorMessage = this.$t("regenerateSku");
                            break;
                        }
                    }
                }
                
                if (this.hasChangeSpec){
                    errorMessage = this.$t("regenerateSku");
                }
                
                return errorMessage;
            },
            
            //为了控制不能上传图片
            onSelectSKU(records){
                this.hasSelectSku = records.length > 0;
            },
            
            /***************************提交逻辑***************************/
            
            uploadAll(){
                this.uploadSuccessNum = 0;
                
                //头图上传
                let temp = this.$refs.headPicAttach;
                temp.save();
                
                //详情上传
                temp = this.$refs.bodyPicAttach;
                temp.save();
                
                //视频上传
                temp = this.$refs.videoPicAttach;
                temp.save();
            },
            
            uploadSuccess(){
                //头图上传
                this.uploadSuccessNum ++;
                if (parseInt(this.uploadSuccessNum) === 3){
                    this.save();
                }
            },
            
            uploadFailed(){
                //头图上传
                this.uploadSuccessNum = 0;
                this.$store.commit("hideLoading");
            },
            
            ctrlItemData(data){
                //设置itemInfo
                let result = data.item;
                result.catalogList = data.catalogList;
                result.parentCatalogId = data.parentCatalogId;
                result.tag = (result.tag || []).split("\n");
                
                //设置specData
                this.loadSpecData(data.itemSpecList);
                
                //设置标签表格
                this.tagDs.setData(data.item.itemTagMappings);
                
                //设置属性表格
                this.attrDs.setData(data.itemAttributeList);
                
                //设置skuData
                this.skuDs.setData(data.skuList);
                
                return result;
            },
            
            save(){
                let error;
                
                //检验queryDs
                error = this.checkBaseInfo();
                
                //检验attrDs
                if (!error){
                    error = !this.checkDs(this.attrDs) ? "" : this.$t("enterItemAttr"); //Please enter porduct feature
                }
                
                //校验specDs
                if (!error){
                    error = !this.checkDs(this.specTypeDs) ? "" : this.$t("enterItemSpec"); //Please enter porduct feature
                }
                
                //检验skuDs
                if (!error){
                    error = !this.checkDs(this.skuDs) ? "" : this.$t("enterItemSKU");
                }
                
                //检验sku数据
                if (!error){
                    error = this.checkSku();
                }
                
                if (!!error){
                    this.$store.commit("message", error);
                    return;
                }else if (this.uploadSuccessNum != 3){
                    this.$store.commit("loading", this.$t('saving'));
                    this.uploadAll();
                    return;
                }else{
                    this.uploadSuccessNum = 0;
                }
                
                let item = this.$base.deepCopy(this.queryDs.getCurrentData());
                
                item.tag = (item.tag || []).join("\n");
                
                //itemAttributeList 商品属性
                let submitForm = {item: item};
                
                //submitForm
                submitForm.itemAttributeList = this.deleteAttrData.concat(this.attrDs.getAllData());
                submitForm.item.itemTagMappings = this.deleteTagData.concat(this.tagDs.getAllData());
                
                submitForm.catalogList = item.catalogList;
                submitForm.parentCatalogId = item.parentCatalogId;
                
                //itemSpecList 商品规格
                submitForm.itemSpecList = this.specData;
                
                //skuList 商品SKU
                submitForm.skuList = this.deleteSkuData.concat(this.skuDs.getAllData());
                
                //如果有加载的数据就去加载id
                itemModule.maintain.execute({
                    data: submitForm,
                    failed: function (msg) {
                        this.$store.commit("hideLoading");
                        this.$store.commit("message", msg);
                    }.bind(this),
                    success: function () {
                        this.$store.commit("message", this.$t('saveSuccess'));
                        this.$store.commit("hideLoading");
                        
                        if (!!this.itemId){
//                            this.clearDeleteData();
                            // TODO: 加标签保存(无刷新下)再删除再添加会出多个标签，需刷新queryDs
                            let name = this.$route.name;
                            this.$store.dispatch('router/reload', name);
                        }else{
                            this.resetPageData();
                        }
                    }.bind(this)
                });
            },
            
            checkDs(ds){
                let records = ds.records;
                let checkResult;
                
                if (!records || records.length < 1){
                    return "null";
                }else{
                    ds.sendVerify();
                    for (let i = 0, l = records.length; i < l; i++) {
                        checkResult = records[i].getVerifyResult();
                        if (!checkResult.ifPassVerify){
                            return "no pass";
                        }
                    }
                }
            },
            
            checkBaseInfo(){
                let data = this.queryDs.getCurrentData(),
                        error;
                this.checkDs(this.queryDs);
                
                if(!data.itemName){
                    error = setArror(this.$t("itemName"));
                }
                if(!data.itemModel){
                    error = setArror(this.$t("itemModel"));
                }
                if(!data.parentCatalogId){
                    error = setArror(this.$t("category"));
                }
                
                if(!data.catalogList || data.catalogList.length < 1){
                    error = setArror(this.$t("subCategory"));
                }
                
                if(!data.unit){
                    error = setArror(this.$t("currency"));
                }
                
                if(!data.factPrice && data.factPrice !== 0) {
                    error = setArror(this.$t("price"));
                }
                
                if(!data.tag || data.tag.length < 1) {
                    error = setArror(this.$t("keyWords"));
                }
                
                if(this.$refs.headPicAttach.viewList < 1){
                    error = setArror(this.$t("itemHeadPic"));
                }
                
                if( this.$refs.bodyPicAttach.viewList < 1){
                    error = setArror(this.$t("itemBodyPic"));
                }
                
                function setArror(msg){
                    if (!!error){
                        error += "、";
                        msg = msg.toLowerCase();
                    }else{
                        error = "";
                    }
                    error += msg;
                    return error;
                }
                
                if (error){
                    error = this.$t("baseInfoCheckError", {fields: error})
                }
                
                return error;
            },
            
            clearDeleteData(){
                this.deleteAttrData = [];
                this.deleteSkuData = [];
                this.deleteTagData = [];
                
                let specData = this.specData, result = [];
                for (let i = 0, l = specData.length; i < l; i++) {
                    if (specData[i].deleteFlag != 1){
                        result.push(specData[i]);
                    }
                }
                this.specData = result;
            },
            
            resetPageData(){
                //recordid
                let id = this.queryDs.getCurrentData().brandGlobalId;
                let brandName = this.queryDs.getCurrentData().brandName;
                let queryDs = this.queryDs;
                
                this.$refs.brand_selector.setReadOnly(true);
                this.$refs.big_catalog_selector.setReadOnly(false);
                
                //清空数据
                this.deleteAttrData = [];
                this.deleteSkuData = [];
                this.specData = [];
                this.attrData = [];
                
                //重置ds
                this.specTypeDs.reset();
                this.skuDs.reset();
                this.attrDs.reset();
                this.tagDs.reset();
                queryDs.clearCurrent();
                queryDs.getCurrentRecord().resetValue("brandGlobalId", id);
                queryDs.getCurrentRecord().resetValue("brandName", brandName);
                
                //设置值
                this.itemId = null;
                this.uploadSuccessNum = 0;
                
                //重设brandId
                this.$refs.brand_selector.setReadOnly(false);
            },
            
            viewItem(){
                let item = this.$base.deepCopy(this.queryDs.getCurrentData());
                
                //头图
                let temp;
                temp = this.$refs.headPicAttach.viewList;
                if (temp && temp.length > 0){
                    item.headPic = temp[0].src;
                }
                temp = this.$refs.bodyPicAttach.viewList;
                if (temp && temp.length > 0){
                    item.bodyPic = temp;
                }
                
                temp = this.$refs.videoPicAttach.viewList;
                if (temp && temp.length > 0){
                    item.videoPic = temp[0].src;
                }
                
                //属性
                item.attrList = this.attrDs.getAllData();
                
                //价格
                temp = ArrayApi.getDataByAttr(this.currencyDs.getAllData(), "exchangeUnit", item.unit);
                item.unitSign = temp.length > 0 ? temp[0].exchangeSign : "";
                
                //品牌
                if (!item.brandName && item.brandGlobalId){
                    temp = ArrayApi.getDataByAttr(this.brandDs.getAllData(), "brandGlobalId", item.brandGlobalId);
                    item.brandName = temp.length > 0 ? temp[0].brandName : "";
                }
                
                //factPrice
                item.factPrice = Money.format(item.factPrice);
                
                this.viewData = item;
                this.$refs.view.show();
            }
        }
    }
</script>


<style scoped>
    .main-container{
        padding-bottom: 30px;
    }
    .file-sku{
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        opacity: 0.001;
        cursor: pointer;
    }
</style>
