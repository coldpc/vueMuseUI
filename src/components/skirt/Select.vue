<template>
    <div :class="focusClass" class="sk-select-part">
        <mu-select-field  ref="select" :scroller="routerWrapper" :max-height="maxHeight" :fullWidth="fullWidth" :hintText="computedHintText" :name="name" @change="onChangeValue" :autoWidth="autoWidth" :disabled="disabled" :labelFloat="labelFloat" v-model="result" :multiple="multiple" :label="label" :error-text="errorText">
            <mu-menu-item v-if="nullTitle" :value="nullValue" :title="nullTitle"></mu-menu-item>
            <mu-menu-item v-for="(record, index) in records" :key="record.recordId" :value="getItemValue(record)" :title="getItemDisplay(record)"></mu-menu-item>
        </mu-select-field>
        <div class="mask" v-show="!hasRecords">
            <p class="disabled-info">{{$t('noOption')}}</p>
        </div>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK";
    import { mapGetters } from 'vuex';
    
    //设置组件的class
    const defaultFocusClass = "sk-select-focus";
    const noOptionFocusClass = "sk-no-option-select-focus";
    
    export default{
        name: "sk-select",
        extends: SK,
        data(){
            return {
                hasLoadOption: false,
                willSetResult: undefined,
                ifWillResultInit: false,
                records: [],
                focusClass: noOptionFocusClass,
                
                bindOptionListener: null
            }
        },
        
        props: {
            nullValue: {
                type: String,
                default: ""
            },
            nullTitle: {
                type: String
            },
            hintText: {},
            maxHeight: {
                type: Number,
                default: 400
            },
            
            multiple: {
                type: Boolean,
                default: false
            },
            
            optionBind: {
                type: DataSet
            },
            
            //下拉数据
            option: {
                type: Array
            },
            
            optionService: {},
            
            displayField: {
                type: String
            },
            ename: {
                type: String
            },
            
            valueField: {
                type: String
            },
            
            //声明是选择返回valueFiled还是 整条记录
            //value/item
            valueType: {type: String}
        },
        
        created(){
            var temp;
            
            //设置option的ds
            temp = this.optionBind;
            if (!!temp){
                this.setOptionBindDs(temp);
            }else{
                temp = this.optionService;
                if (temp){
                    let ds = new DataSet({
                        queryService: temp,
                        autoQuery: true
                    });
                    this.setOptionBindDs(ds);
                }
            }
            
            //设置optionBind
            temp = this.option;
            if (temp) {
                let ds = new DataSet({
                    dataSource: temp
                });
                this.setOptions(ds.records);
            }
        },
        
        watch: {
            optionBind(ds){
                this.setOptionBindDs(ds);
            }
        },
        
        computed: {
            hasRecords(){
                return this.nullTitle || (this.records && this.records.length > 0);
            },
            
            computedHintText(){
                if (this.records && this.records.length > 0 && !this.nullTitle){
                    return this.hintText || this.$t('pleaseSelect');
                }else{
                    return "";
                }
            },
    
            ...mapGetters({
                "routerWrapper": "routerWrapper"
            })
        },
        
        methods: {
            setOptionBindDs(ds){
                ds.addEventListener(ds.event.load, this.onLoadOptionDs);
                
                let records = ds.records;
                if (records && records.length > 0){
                    this.setOptions(records);
                }
            },
            
            //加载option的时候
            onLoadOptionDs(records){
                this.setOptions(records);
            },
            
            setOptions(records){
                this.hasLoadOption = true;
                this.records = records;
                
                if (!records || records.length < 1){
                    this.focusClass = noOptionFocusClass;
                }else{
                    this.focusClass = defaultFocusClass;
                }
                
                if (this.willSetResult){
                    this.setValue(this.willSetResult);
                }else if(!!this.result){
                    this.setValue(this.getResetValue());
                }
            },
            
            //由于多选是个数组 不可以制定同一个对象
            getResetValue(){
                return !!this.multiple ? [] : "";
            },
            
            
            setReadOnly(ifReadOnly){
                this.disabled = ifReadOnly;
            },
            
            //获取选择每一项的值
            getItemValue(record){
                let field = this.valueField;
                return  (!field ? record.data : record.data[this.valueField]);
            },
            
            //获取展示的值
            getItemDisplay(record){
                let field = this.displayField;
                let display = "" + (!!field ? record.getValue(field) : record.getData());
                
                field = this.ename || "enName";
                let ename = (!!field ? record.getValue(field) : "");
                
                if (ename){
                    display += " " + ename;
                }
                return display;
            },
            
            //获取Result
            getResultValues(v){
                let result, temp, valueField = this.valueField;
                if (v instanceof Array){
                    result = [];
                    for (let i = 0, l = v.length; i < l; i++) {
                        temp = v[i];
                        if (typeof temp == "object"){
                            result.push(temp[valueField]);
                        }else{
                            result = v;
                            break;
                        }
                    }
                }else{
                    if (v !== null && typeof v == "object"){
                        result = temp[valueField];
                    }else{
                        
                        result = v;
                    }
                }
                
                if (result === undefined && this.nullTitle !== undefined){
                    result = "";
                }
                return result;
            },
            
            //根据value获取选项
            getResultItems(v){
                let result, temp;
                if (v instanceof Array){
                    result = [];
                    for (let i = 0, l = v.length; i < l; i++) {
                        temp = v[i];
                        if (typeof temp == "object"){
                            result = v;
                            break;
                        }else{
                            result.push(this.getItemByValue(temp));
                        }
                    }
                }else{
                    if (!!v && typeof v == "object"){
                        result = v;
                    }else if (!this.isNull(v)){
                        result = this.getItemByValue(v);
                    }
                }
                return result;
            },
            
            isNull(v){
                return (!v && v !== 0);
            },
            
            //获取选项
            getItemByValue(v){
                let records = this.records, data, result, field = this.valueField;
                for (var i = 0, l = records.length; i < l; i++) {
                    data = records[i].getData();
                    if (!!field){
                        if (data[field] == v){
                            result = data;
                            break;
                        }
                    }else if(v == data){
                        result = data;
                        break;
                    }
                }
                return result;
            },
            
            //获取value
            getValueByItem(v){
                let records = this.records, data, result, field = this.valueField;
                for (var i = 0, l = records.length; i < l; i++) {
                    data = records[i].getData();
                    if (!!field){
                        if (data[field] == v){
                            result = data;
                            break;
                        }
                    }else if(v == data){
                        result = data;
                        break;
                    }
                }
                return result;
            },
            
            onChangeValue(v){
                this.setValue(v);
                this.verify(this.bindRecord, this.result);
            },
            
            setValue(v){
                if (!this.hasLoadOption){
                    this.willSetResult = v;
                }else{
                    this.willSetResult = null;
                    
                    if (this.multiple){
                        if (!(v instanceof Array)){
                            if (v){
                                v = [v];
                            }else{
                                v = [];
                            }
                        }
                    }
                    
                    //数组获取object
                    if (this.result != v){
                        this.result = this.getResultValues(v);
                    }
                }
            },
            
            getValue(){
                let value, valueType;
                valueType = this.valueType;
                if (!this.valueType || valueType != "item"){
                    value = this.result;
                }else{
                    value = this.getResultItems(this.result);
                }
                return value;
            },
            
            dispatch(){
                let v;
                let item = this.getResultItems(this.result);
                
                if (item && this.valueField && this.valueType != 'item'){
                    v = item[this.valueField];
                }else{
                    v = item;
                }
                
                this.$emit("change", v);
                this.$emit("input", v);
                
                let record = this.bindRecord;
                if (record){
                    if (v instanceof Array && v.length == 0){
                        v = "";
                    }
                    record.setValue(this.name, v, this.id);
                    
                    if (this.valueType != 'item'){
                        if (this.displayField){
                            if (item){
                                record.setValue(this.displayField, item[this.displayField], this.id);
                            }else{
                                record.setValue(this.displayField, "");
                            }
                        }
                    }
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .sk-select-part{
        position: relative;
    }
    .sk-select-part {
        .mask {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            z-index: 2;
            color: #ccc;
        }
    
        .disabled-info {
            color: rgba(0, 0, 0, 0.38);
            cursor: default;
            padding-top: 38px;
            margin: 0px;
            font-size: 12px;
        }
    }
</style>

<style>
    .mu-dropDown-menu-text-overflow{
        text-overflow: ellipsis;
    }
</style>