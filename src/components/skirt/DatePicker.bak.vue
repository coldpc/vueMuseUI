<template>
    <div>
        <mu-date-picker :hintText="hintText" :label="label" :error-text="errorText" :date-time-format="dateTimeFormat"  :container="displayStyle" :auto-ok="autoClose" :ok-label="okLabel" :cancel-label="cancelLabel" :disableYearSelection="disableYearSelection" :first-day-of-week="firstDayOfWeek" :mode="mode" :format="format" :max-date="getMaxDate" :min-date="getMinDate" :name="name" :labelFloat="labelFloat" :disabled="readyOnly" :helpText="helpText" :errorText="errorText" :fullWidth="fullWidth" :shouldDisableDate="shouldDisableDate" v-model="result"></mu-date-picker>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "../SK";
    
    var id = 1;
    
    const defaultMaxDate = "2100-01-01";
    const defaultMinDate = "1900-01-01";
            
    export default{
        name: "sk-date-picker",
        mixins: [SK],
        data(){
            return {
                id: "date-picker" + (id ++),
                innerValue: "",
                locale: "ZHS",
                result: "",
                maxDateBindValue: "",
                minDateBindValue: "",
                
                bindListener: null,
                    IndexChangeListener: null,
                    bindRecord: null
            }
        },

        props: {

            //日期在控件中展示的格式 最好不要设置
            dateTimeFormat: {
                type: Object
                //formatDisplay: "",
                //formatMonth: ""
            },

            //自动关闭弹框
            autoClose: {
                type: Boolean,
                default: false
            },

            okLabel: {
                type: String,
                default: "确定"
            },

            cancelLabel: {
                type: String,
                default: "取消"
            },

            //展示方式
            displayStyle: {
                type: String,
                default: "dialog" //dialog/inline
            },

            //第一天设置
            firstDayOfWeek: {
                type: Number,
                default: 1 //0/1
            },

            mode: {
                type: String,
                default: "portrait" //portrait 竖屏显示， landscape 横屏显示
            },

            //显示格式
            format: {
                type: String,
                default: "yyyy/MM/dd"
            },

            maxDate: {},
            
            bindMaxDate: {
                type: String
            },
    
            minDate: {},
            
            bindMinDate: {
                type: String
            },

            name: {
                type: String
            },

            label: {
                type: String
            },

            labelFloat: {
                type: Boolean,
                default: true
            },

            readyOnly: {
                type: Boolean,
                default: false
            },

            hintText: {
                type: String
            },

            helpText: {
                type: String
            },

            errorText: {
                type: String
            },

            fullWidth: {
                type: Boolean,
                default: true
            },

            ifDisabledWeekends: {
                type: Boolean,
                default: false
            },

            shouldDisableDate: {
                type: Function
            },

            value: {

            },

            bind: {
                type: DataSet
            },

            disableYearSelection: {
                type: Boolean,
                default: false
            },
            
            record: {}
        },

        created(){
            //是否禁用周末
            if (this.ifDisabledWeekends){
                this.shouldDisableDate = this.disableWeekends;
            }

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
            
            result(){
                this.dispatch();
            }
        },
        
        computed: {
            getMaxDate(){
                let maxDate = this.maxDateBindValue || this.maxDate || defaultMaxDate;
                if (typeof maxDate != Object){
                    maxDate = new Date(maxDate);
                }
                
                return maxDate;
            },
            
            getMinDate() {
                let minDate = this.minDateBindValue || this.minDate || defaultMinDate;
                
                if (typeof minDate != Object){
                    minDate = new Date(minDate);
                }
                return minDate;
            }
        },
    
        //this.$set(this.someObject,'b',2)

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
                ds.addEventListener(ds.event.indexChange, listener);
                if (!!old){
                    old.removeEventListener(old.event.indexChange, listener);
                }
                
                let record = ds.currentRecord;
                if (record){
                    this.setBindRecord(record);
                }
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
                }
                newR.addEventListener(newR.event.update, listener);
                this.initValue(newR, oldR);
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
                            this.dispatch();
                        }
                    }
        
                    //设置是否绑定过maxDate
                    let limit = record.getValue(this.bindMaxDate);
                    if (limit){
                        _this.setMaxDate(limit);
                    }
        
                    //设置是否绑定过最小日期
                    limit = record.getValue(this.bindMinDate);
                    if (limit){
                        _this.setMinDate(limit);
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
                    } else {
                        
                        //根据绑定的字段是否重新设置日期限制
                        let limitField = _this.bindMaxDate;
                        if (limitField && key == limitField) {
                            _this.setMaxDate(value);
                        }else{
                            limitField = _this.bindMinDate;
                            if (limitField && key == limitField) {
                                _this.setMinDate(value);
                            }
                        }
                    }
                }
            },
            
            setMaxDate(v){
                if (v){
                    this.maxDateBindValue = v;
    
                    //校验数据
                    let result = this.result;
                    if (!!result && this.compareTwoDate(result, v)){
                        this.setValue("");
                    }
                }
            },
            
            setMinDate(v){
                if (v){
                    this.minDateBindValue = v;
    
                    let result = this.result;
                    if (!!result && this.compareTwoDate(v, result)){
                        this.setValue("");
                    }
                }
            },
            
            compareTwoDate(v1, v2){
                if (!(v1 instanceof Date)){
                    v1 = new Date(v1);
                }
    
                if (!(v2 instanceof Date)){
                    v2 = new Date(v2);
                }
                
                return v1 - v2 > 0;
            },
            
            //仅仅选择工作日
            disableWeekends (date) {
                return date.getDay() === 0 || date.getDay() === 6;
            },

            setValue(v){
                if (v !== this.result){
                    this.result = v;
                }
            },

            getValue(){
                return this.result;
            },
            
            dispatch(v){
                this.$emit("change", v);
                let record = this.bindRecord;
                if (record){
                    record.setValue(this.name, v, this.id);
                }
            }
        }
    }
</script>
