<template>
    <sk-win ref="win" :title="$t('specConfig')" :small-title="specName" width="600px">
        <sk-data-set @update="onChange" v-model="editSpecDs" :data-source="dataSource" :auto-query="false"></sk-data-set>
        <div class="patch-con">
            <sk-row>
                <textarea class="patch-area" :placeholder="$t('spaceComma')" v-model="patchSpec" cols="30" rows="3" @keyup.enter="batchCreate"></textarea>
                <sk-button primary :label="$t('batchCreate')" @click="batchCreate"></sk-button>
            </sk-row>
        </div>
    
        <div style="margin-top: 20px;">
            <sk-button primary :label="$t('add')" action="add" :bind="editSpecDs"></sk-button>
            <sk-button :label="$t('delete')" @click="deleteSpec"></sk-button>
        </div>
        
        <div class="table-content">
            <sk-table show-checkbox ref="specTable" :bind="editSpecDs">
                <div slot="row">
                    <sk-column align="center" editable name="specValue" :title="$t('specValue')"></sk-column>
                    <sk-column align="center" width="25%" name="id" :title="$t('operation')" :formatter="specOperation" @cell-click="clickSpecOperation"></sk-column>
                </div>
            </sk-table>
        </div>
        
        <div style="text-align: right;margin-top: 20px;">
            <sk-button :label="$t('cancel')" @click="hide"></sk-button>
            <sk-button primary :label="$t('save')" @click="save"></sk-button>
        </div>
    </sk-win>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    
    export default {
        data(){
            window.editSpecW = this;
            return {
                editSpecDs: null,
                patchSpec: "",
                dataSource: this.editData || [],
                tempData: null,
                specName: "",
                parentId: ""
            };
        },
        
        created(){
        },
        
        methods: {
            specOperation(){
                return "<a class='delete'>" + this.$t("delete") + "</a>";
            },
            
            //删除
            clickSpecOperation(e, v, name, index, record){
                let type = e.target.className;
                if (type == "delete"){
                    this.editSpecDs.remove(index);
                    this.removeSpecItem(record.getData());
                }
            },
    
            deleteSpec(){
                let deleteRecords = this.editSpecDs.delete(), record;
                for (var i = 0, l = deleteRecords.length; i < l; i++) {
                    record = deleteRecords[i];
                    this.removeSpecItem(deleteRecords[i].getData());
                }
            },
            
            removeSpecItem(specItem){
                if (!!specItem.itemId){
                    specItem.deleteFlag = 1;
                    this.tempData.push(specItem);
                }
            },
            
            show(specData, specName, parentId){
                this.patchSpec = "";
                this.tempData = [];
                this.dataSource = specData;
                this.parentId = parentId;
                this.specName = specName;
                
                this.$refs.win.show();
            },
            
            hide(){
                this.$refs.win.hide();
            },
    
            save(){
                let data = this.deleteSameSpec(this.editSpecDs.getAllData()).concat(this.tempData);
                
                for (let i = 0, l = data.length; i < l; i++) {
                    data[i]['specName'] = this.specName;
                    data[i]['bindId'] = this.parentId;
                }
                
                this.$emit("saveEditSpecData", data, this.parentId);
                this.hide();
            },
            
            //删除相同的规格
            deleteSameSpec(data){
                let result = [], specValue, temp = [], specItem;
                for (let i = 0, l = data.length; i < l; i++) {
                    specItem = data[i];
                    specValue = specItem.specValue;
                    if (!!specValue && temp.indexOf(specValue) == -1){
                        temp.push(specValue);
                        result.push(specItem);
                    }else{
                        this.removeSpecItem(specItem);
                    }
                }
                return result;
            },
            
            // 改变值
            onChange(value, key, record) {
                let specValue = this.parseValue(value);
                if (specValue != value) {
                    record.setValue(key, specValue);
                }
            },
            
            // 格式化规格值的问题
            parseValue(specValue) {
                specValue = $.trim(specValue);
                specValue = specValue.replace(/;|:|,|'/ig, " ");
                specValue = $.trim(specValue);
                return specValue;
            },
    
            batchCreate() {
                let v = this.patchSpec, row;
                
                let ds = this.editSpecDs;
                let specValue;
            
                v = v + "";
                v = v.replace(/，/ig, ",");
                v = v.replace(/,,/g,",");
                v = v.replace(/\n/g, "");
                v = !!v ? v.split(",") : "";
            
                for (let i = 0, l = v.length; i < l; i++) {
                    specValue = this.parseValue(v[i]);
                    if (!specValue){
                        continue;
                    }
                    row = {
                        specName: this.specName,
                        specValue: v[i],
                        bindId: this.parentId
                    };
                    ds.add(row);
                }
    
                this.patchSpec = "";
            }
        }
    }
</script>


<style scope>
    .patch-con{
        margin-top: 10px;
    }
    .patch-area{
        width: 70%;
        padding: 10px;
        border: 1px solid #999;
        outline-color: transparent;
    }
    .patch-area:focus{
        border-color: #333;
        box-shadow: 0px 0px 11px -3px #000;
    }
    .table-content{
        margin-top: 10px;
        max-height: 300px;
        overflow-y: auto;
    }
</style>