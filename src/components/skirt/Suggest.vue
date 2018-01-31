<template>
    <div class="sk-select-part">
        <mu-auto-complete ref="select" :fullWidth="fullWidth" :hintText="hintText"
                         :name="name" :autoWidth="autoWidth" :disabled="disabled"
                         :labelFloat="labelFloat" v-model="showResult" :label="label"
                         :error-text="errorText" :max-height="maxHeight" :underlineShow="false" filter="noFilter" :dataSourceConfig="dataSourceConfig" @input="filterData" openOnFocus :dataSource="dataSource" @select="onSelect"></mu-auto-complete>
    </div>
</template>

<script type="text/javascript">
    import AutoComplete from 'muse-components/autoComplete'
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK";
    
    export default{
        name: "sk-suggest",
        extends: SK,
        
        components: {
            "mu-auto-complete": AutoComplete
        },
        
        data(){
            return {
                dataSourceConfig: {
                    text: "text",
                    value: "value"
                },
                dataSource: null,
                showResult: ""
            };
        },
        
        props: {
            optionBind: {
                type: DataSet
            },
    
            //下拉数据
            option: {
                type: Array
            },
            
            maxHeight: {},
    
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
    
            valueType: {type: String},
            maxNum: {type: Number, default: 1}
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
        
                let data = [];
                for (let i = 0, l = records.length; i < l; i++) {
                    data.push({
                        text: this.getItemDisplay(records[i]),
                        value: this.getItemValue(records[i])
                    });
                }
                this.dataSource = data;
        
                if (this.willSetResult){
                    this.setValue(this.willSetResult);
                }else if(!!this.result){
                    this.setValue(this.getResetValue());
                }
            },
    
            filterData(val){
                val = val.toLowerCase();
                let dataSource = this.dataSource;
                let dis = "text", i1, i2;
                dataSource.sort(function (a, b) {
                    i1 = !!val ? a[dis].toLowerCase().indexOf(val) : -1;
                    i1 = i1 > -1 ? i1 : 100000000 + a[dis].charCodeAt(0);
    
                    i2 = !!val ? b[dis].toLowerCase().indexOf(val) : -1;
                    i2 = i2 > -1 ? i2 : 100000000 + b[dis].charCodeAt(0);
                    return i1 - i2;
                });
                this.dataSource = dataSource;
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
    
            onSelect(item, index){
                this.setValue(item.value);
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
                                record.setValue(this.displayField, "", this.id);
                            }
                        }
                    }
                }
            }
        }
    };
    
</script>

<style></style>