<template>
    <div :class="errorClass" @keyup="onKeyUp">
        <mu-text-field @textOverflow="handleInputOverflow" @focus="onFocus" @blur="onBlur" v-model="showResult"
                       :helpText="helpText" :hintText="hintText" :label="label" :error-text="errorText"
                       :errorColor="errorColor" :type="type" :labelFloat="labelFloat" :multiLine="multiLine"
                       :rows="rows" :rowsMax="rowsMax" :fullWidth="fullWidth" :disabled="disabled"
                       :maxLength="maxLength" :max="max" :min="min" />
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK"

    export default {
        name: "sk-money",

        extends: SK,

        data(){
            return {
                ifFocus: false,
                moneyResult: "",
                type: "text",
                showResult: ""
            }
        },

        created(){
            if (this.readOnly) {
                this.setReadOnly(true);
            }
        },

        computed:{
        },
        
        methods: {
            formatMoney(v){
                if (!v && v !== 0){
                    return "";
                }
                var n = 2;
                v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = v.split(".")[0].split("").reverse(), r = v.split(".")[1],
                        t = "";
                for (var i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return t.split("").reverse().join("") + "." + r;
            },
            
            onBlur(e){
                if (e){
                    let v = parseFloat(e.target.value);
                    if (isNaN(v)) {
                        v = '';
                    }else {
                        if (this.min !== undefined && this.min > v) {
                            v = this.min;
                        }else if(this.max !== undefined && this.max < v){
                            v = this.max;
                        }
                    }
                    this.result = v;
                    this.moneyResult = this.formatMoney(v);
    
                    //焦点消失的最后一次不会触发setValue
                    this.setValue(v);
                }
                
                this.showResult = this.moneyResult;
                this.ifFocus = false;
                this.$emit('blur');
                this.verify(this.bindRecord, this.result);
            },

            onFocus(){
                this.ifFocus = true;
                this.showResult = this.result;
                this.$emit('focus');
            },
    
            setValue(v){
                if (!(v == this.moneyResult || v == this.result)){
                    if (!this.ifFocus){
                        v = parseFloat(v) || "";
                        this.result = v;
                        this.moneyResult = this.formatMoney(v);
                        this.onBlur();
                    }
                }
            },

            handleInputOverflow(isOverflow){
                this.errorText = isOverflow ? this.$t("字数超出限制啦！") : "";
            },

            setReadOnly(ifReadOnly){
                this.disabled = ifReadOnly;
            },
            
            onKeyUp(e){
                let input = e.target;
                if (input.tagName.toLowerCase() == "input"){
                    let value = input.value;
                    if (value !== 0) {
                        value = value || "";
                    }
                    let prefix = '';
    
                    if (value.indexOf('-') !== -1) {
                        value = value.substring(1);
                        prefix = '-';
                    }
                    
                    
                    let last = value.indexOf("."); //查找小数点
                    if (last != -1){
                        let temp = value.substr(last + 1, 2);
                        temp = temp.replace(/[^0-9]/ig, "");
                        
                        value = value.substring(0, last);
                        last = "." + temp;
                    }else{
                        last = "";
                    }
    
                    value = parseFloat(value);
                    if (value !== 0) {
                        value = value || "";
                    }
                    
                    value = prefix + value + last;
                    input.value = value;
                }
            }
        },

        watch: {
            showResult(v){
                if (v == this.result){
                    return;
                }
                this.setValue(v);
            }
        },

        props: {

            //是否为多行输入
            multiLine: {
                type: Boolean,
                default: false
            },

            value: {
                type: String
            },

            //行数
            rows: {
                type: Number,
                default: 1
            },

            //最大行数
            rowsMax: {
                type: Number
            },

            //可输入的最大长度
            maxLength: {
                type: Number,
                default: 0
            },

            //当type = number 时，max属性生效
            max: {
                type: Number, String
            },

            //当type = number 时，min属性生效
            min: {
                type: Number, String
            },

            //只读
            readOnly: {
                type: Boolean,
                default: false
            }

        }

    }
</script>

<style lang="scss" scoped>

</style>
