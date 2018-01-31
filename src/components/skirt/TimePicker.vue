<template>
    <div>
        <mu-time-picker
                @change=""
                :hintText="hintText"
                :label="label"
                :error-text="errorText"
                :container="displayStyle"
                :auto-ok="autoClose"
                :ok-label="$t('ok')"
                :cancel-label="$t('cancel')"
                :mode="mode"
                :format="format"
                :name="name"
                :labelFloat="labelFloat"
                :disabled="disabled"
                :helpText="helpText"
                :errorText="errorText"
                :fullWidth="fullWidth"
                v-model="result"></mu-time-picker>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK"
    
    export default{
        name: "sk-time-picker",
        
        extends: SK,
        
        data(){
            return {
                willSetValue: null,
                timeValue: null,
                maxTimeValue: 10000,
                minTimeValue: -1
                
            }
        },
        
        props: {
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
    
            mode: {
                type: String,
                default: "portrait" //portrait 竖屏显示， landscape 横屏显示
            },
    
            //显示格式
            format: {
                type: String,
                default: "24hr" //ampm: 12小时制; 24hr: 24小时制
            },
    
            maxTime: {
                type: String
            },
            
            //绑定的最大时间
            bindMaxTime: {
                String
            },
    
            //最小时间
            bindMinTime: {
                type: String
            },
            
            minTime: {
                type: String
            }
        },
        
        created(){
            var temp;
            
            //是否存在maxTime的设置
            temp = this.maxTime;
            if (temp){
                this.setMaxTime(this.getTimeValue(temp));
            }
    
            //是否存在minTine的设置
            temp = this.minTime;
            if (temp){
                this.setMinTime(this.getTimeValue(temp));
            }
    
            //是否有默认值
            temp = this.value;
            if (this.value){
                this.setInitValue(this.value, true);
            }
        },
        
        watch: {
            //这是覆盖父级watch
            result(newV){
                var timeValue = this.getTimeValue(newV);
                if (!!timeValue && (timeValue > this.maxTimeValue || timeValue < this.minTimeValue)){
                    this.willSetValue = "";
                }else{
                    this.timeValue = timeValue;
                }
            },
            
            maxTime(v){
                this.setMaxTime(this.getTimeValue(v));
            },
            
            minTime(v){
                this.setMinTime(this.getTimeValue(v));
            }
        },
        
        updated(){
            if (this.willSetValue !== null){
                this.setValue(this.willSetValue);
                this.willSetValue = null;
            }
        },
        
        methods: {
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
    
                    //设置绑定的最大
                    let field = _this.bindMaxTime;
                    if(!!field){
                        _this.setMaxTime(_this.getTimeValue(record.getValue(field)));
                    }
    
                    //设置绑定的最小值
                    field = _this.bindMinTime;
                    if(!!field){
                        _this.setMinTime(_this.getTimeValue(record.getValue(field)));
                    }
                }
            },
    
            onUpdate(value, key, record, origin){
                let _this = this;
                if (_this.id != origin){
                    if (_this.name == key){
                        _this.setValue(value, true);
                    }
        
                    //校验是否为控制的字段
                    let bindField = _this.bindMaxTime;
                    if(!!bindField && key == bindField){
                        _this.setMaxTime(_this.getTimeValue(value));
                    }
        
                    bindField = _this.bindMinTime;
                    if(!!bindField && key == bindField){
                        _this.setMinTime(_this.getTimeValue(value));
                    }
                }
            },
            
            //设置值
            setValue(v){
                v = v || "";
                this.timeValue = this.getTimeValue(v);
                if (this.checkTimeFormat(v) && v != this.result){
                    this.result = v;
                }
            },
            
            //设置最大的时间
            setMaxTime(v){
                v = v >= 0 ? v : 10000;
                this.maxTimeValue = v;
                
                if (this.timeValue > v){
                    this.setValue("");
                }
            },
            
            //设置多小的时间
            setMinTime(v){
                v = v >= 0 ? v : -1;
                this.minTimeValue = v;
    
                if (this.timeValue < v){
                    this.setValue("");
                }
            },
            
            //设置初始化值
            setInitValue(v, ifInit){
                if (this.checkTimeFormat(v)){
                    this.setValue(v, ifInit);
                }
            },
            
            //检测值得有效性
            checkTimeFormat(time){
                var g = /^(([0-1][0-9])|(2[0-3]))(:|：)[0-5][0-9]$/;
                return !!time ? g.test(time) : true;
            },
            
            //将时间转化为分钟
            getTimeValue(time){
                
                if (!!time && this.checkTimeFormat(time)){
                    var h = parseInt(time.substr(0, 2));
                    var m = parseInt(time.substr(3, 2));
                    return h * 60 + m;
                }
            }
        }
    }
</script>