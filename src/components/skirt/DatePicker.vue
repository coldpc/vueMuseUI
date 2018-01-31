<template>
    <div class="sk-input-plugin">
        <sk-text-input ref="textInput" @keydown="onKeyDown" :value="innerResult" @focus="onFocus" :readonly="disabled" :hintText="hintText" :label="label" :error-text="errorText"></sk-text-input>
        <mu-date-picker v-show="false" ref="datePicker" :underlineShow="true" :hintText="hintText" :label="label" :error-text="errorText" :date-time-format="dateTimeFormat"  :container="displayStyle" :auto-ok="autoClose" :ok-label="$t('ok')" :cancel-label="$t('cancel')" :disableYearSelection="disableYearSelection" :first-day-of-week="firstDayOfWeek" :mode="mode" :format="format" :max-date="getMaxDate" :min-date="getMinDate" :name="name" :labelFloat="labelFloat" :disabled="disabled" :helpText="helpText" :errorText="errorText" :fullWidth="fullWidth" :shouldDisableDate="shouldDisableDate" v-model="innerResult"></mu-date-picker>
    </div>
</template>

<script type="text/javascript">
    import SK from "@/components/skirt/SK"
    import dateParse from "@/lib/utils/dateParse"
    import dateFormat from "@/lib/utils/dateFormat"
    import { mapGetters } from 'vuex';

    const defaultMaxDate = "2100-01-01";
    const defaultMinDate = "1900-01-01";
    
    export default{
        name: "sk-date-picker",
        extends: SK,
        
        //extends: SK,
        data(){
            return {
                maxDateBindValue: "",
                minDateBindValue: "",
                innerResult: ""
            }
        },

        props: {
            valueType: {
                type: String,
                default: "Number" // Number/string
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

            ifDisabledWeekends: {
                type: Boolean,
                default: false
            },

            shouldDisableDate: {
                type: Function
            },

            disableYearSelection: {
                type: Boolean,
                default: false
            }
        },

        created(){
            //是否禁用周末
            if (this.ifDisabledWeekends){
                this.shouldDisableDate = this.disableWeekends;
            }
        },
        
        mounted(){
            //添加事件
            var _this = this;
            if (!_this.inputListener){
                let input = this.$el.querySelector("input");
                _this.inputListener = function (e) {
                    _this.onKeyDown(e);
                };
                input.addEventListener("keydown", _this.inputListener);
            }
        },
        
        computed: {
            ...mapGetters({
                "locale": "locale"
            }),
            
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
            },
    
            dateTimeFormat(){
                let state = this.$store.state;
                return this.locale == state.lang.english? dateFormat.enDateFormat : dateFormat.chiDateFormat;
            }
        },
    
        //this.$set(this.someObject,'b',2)

        methods: {
            onFocus(){
                this.$refs.datePicker.openDialog();
            },
            onKeyDown(e){
                if (e.code.toLowerCase() == "tab"){
                    this.$refs.datePicker.$refs.dialog.open = false;
                }
            },
            
            setValue(v,type){
                if (parseInt(v) > 0){
                    var date = new Date(v);
                    if ( type != "inner"){
                        this.innerResult = dateParse.format(date, this.format);
                    }
                    this.result = this.valueType.toLowerCase() == 'number'  ? date.getTime() : this.innerResult;
                }else{
                    if ( type != "inner"){
                        this.innerResult = v;
                    }
                    if ( this.valueType.toLowerCase() == 'number' ){
                        if ( !!v ){
                            this.result = new Date(v).getTime();
                            console.log(typeof this.result);
                        }else {
                            this.result = "";
                        }
                    }else {
                        this.result = this.innerResult;
                    }
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
            }
            
        },
        watch: {
            innerResult(newVal,oldVal){
                this.setValue(newVal,"inner");
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mu-date-display-monthday{
        overflow: visible;
    }
</style>
