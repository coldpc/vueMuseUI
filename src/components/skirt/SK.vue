<template>
    <div></div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    
    var sequence = parseInt(Math.random() * 10000);
    const SK = "sk-component-";
    
    export default{
        name: "SK",
        data(){
            return {
                result: null,
                disabled: false,
                errorText: "",
                
                bindListener: null,
                indexChangeListener: null,
                bindRecord: null,
                
                hasBind: false,
                
                errorClass: "",
                
                id: SK + (++ sequence)
            }
        },
        
        props: {
            //最小时间
            name: {
                type: String
            },
            
            //是否只读
            readonly: {
                type: Boolean,
                default: false
            },
            
            //设置值
            value: {},
            
            //检验函数 错误就要返回错误消息
            validFunc: {type: Function},
            
            //绑定的ds
            bind: {
                type: DataSet
            },
            parentBind: {},
            
            //设置的record
            record: {
                type: Record
            },
            
            /**********提示文字相关************/
            
            //prompt的意思 编辑字段的名称差不多
            label: {
                type: String
            },
            
            //提示文字
            hintText: {
                type: String
            },
            
            //帮助text
            helpText: {
                type: String
            },
            
            //标签是否采用浮动
            labelFloat: {
                type: Boolean,
                default: false
            },
            
            error: {
                type: String
            },
            
            errorColor: {
                type: String
            },
            
            //宽度
            fullWidth: {
                type: Boolean,
                default: true
            },
            
            //自动宽度
            autoWidth: {
                type: Boolean,
                default: false
            },
            
            required:{
                type: Boolean,
                default: false
            },
            defaultValue: {}
        },
        
        created(){
            this.setReadonly(this.readonly);
            this.setError(this.error);
            
            //是否有绑定的ds
            let temp = this.bind;
            if (temp){
                this.setBindDs(temp);
            }else{
                //是否有绑定的record
                temp = this.record;
                if(temp) {
                    this.setBindRecord(this.record);
                }
            }
            
            //是否有默认值
            temp = this.value === undefined ? this.defaultValue : this.value;
            if (this.value){
                this.setValue(this.value);
            }
        },
        
        watch: {
            record(newR){
                this.setBindRecord(newR);
            },
            
            bindRecord(newR, oldR){
                this.initBindRecord(newR, oldR);
            },
            
            value(v){
                this.setValue(v);
            },
            
            bind(dataSet, old){
                this.setBindDs(dataSet, old);
            },
            
            parentBind(ds, old){
                if (!!ds && !this.hasBind){
                    this.setBindDs(ds, old);
                }
            },
            
            result(newV){
                this.dispatch(newV);
            },
            
            readonly(v){
                this.setReadonly(v);
            },
            
            error(v){
                this.setError(v);
            }
        },
        
        methods: {
            
            //绑定的record的数据更新侦听器
            getListener(record){
                return this.bindListener || (this.bindListener = record.getListener(this, "onUpdate"));
            },
            
            //ds的index改变侦听器
            getIndexChangeListener(ds){
                return this.IndexChangeListener || (this.IndexChangeListener = ds.getListener(this, "onIndexChange"));
            },
            
            //设置绑定的ds
            setBindDs(ds, old){
                let listener = this.getIndexChangeListener(ds);
                
                if (!!old){
                    old.removeEventListener(old.event.indexChange, listener);
                }
                
                if (ds){
                    this.hasBind = true;
                    ds.addEventListener(ds.event.indexChange, listener);
                    
                    let record = ds.currentRecord;
                    if (record){
                        this.setBindRecord(record);
                    }
                }
            },
            
            //设置是否只读
            setReadonly(ifReadonly){
                this.disabled = !!ifReadonly;
            },
            
            //设置错误消息
            setError(v){
                if (typeof v != "string"){
                    v = "";
                }
                this.errorText = v;
                this.errorClass = !!v ? "has-error-editor" : "";
            },
            
            //如果绑定了ds的话 应侦听IndexChange事件 改变当前的record
            onIndexChange(record){
                this.setBindRecord(record);
            },
            
            //设置绑定的record
            setBindRecord(record){
                this.bindRecord = record;
            },
            
            //设置绑定的record
            initBindRecord(newR, oldR){
                let listener = this.getListener(newR);
                if (!!oldR){
                    oldR.removeEventListener(oldR.event.update, listener);
                    oldR.removeEventListener(oldR.event.verify, this.verify);
                    oldR.removeEventListener(oldR.event.onClear, this.onClear);
                }
                newR.addEventListener(newR.event.update, listener);
                newR.addEventListener(newR.event.verify, this.verify);
                newR.addEventListener(newR.event.clear, this.onClear);
                
                this.initValue(newR, oldR);
            },
            
            onClear(){
                if (!this.disabled){
                    this.setValue();
                }
            },
            
            verify(record, v){
                let errorMsg = "";
                let ifRequired = this.required;
                let func = this.validFunc;
                
                v = v !== undefined ? v : this.getValue();
                record = record || this.bindRecord;
                
                if (record && record.ifInit){
                    return;
                }
                
                if (ifRequired && !func){
                    if (!v && v !== 0){
                        errorMsg = this.$t("requiredError"); //"此字段不可以为空";
                    }
                }else{
                    if (typeof func == "function"){
                        errorMsg = func(v, this);
                    }
                }
                this.setError(errorMsg);
                
                
                if (record){
                    record.setVerifyResult(this.name, !errorMsg || errorMsg === true, errorMsg);
                }
            },
            
            //设置record的值
            initValue(record, old){
                let _this = this;
                if (record){
                    //设置值集合
                    let v = record.getValue([_this.name]);
                    if (v !== undefined){
                        _this.setValue(v);
                    }else if(!old){
                        let result = this.result;
                        if (result){
                            this.dispatch(result);
                        }
                    }
                }
            },
            
            //record字段更新的时候
            onUpdate(value, key, record, origin){
                let _this = this;
                if (_this.id != origin){
                    //重新设置value
                    if (_this.name == key) {
                        _this.setValue(value);
                    }
                }
            },
            
            setValue(v){
                if (v === undefined){
                    v = this.defaultValue;
                }
                this.result = v;
            },
            
            getValue(){
                return this.result;
            },
            
            dispatch(){
                let v = this.getValue();
                
                this.$emit("change", v);
                this.$emit("input", v);
                
                let record = this.bindRecord;
                if (record){
                    record.setValue(this.name, v, this.id);
                }
            }
        }
    }
</script>