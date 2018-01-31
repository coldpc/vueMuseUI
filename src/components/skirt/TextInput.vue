<template>
    <div :class="errorClass">
        <mu-text-field ref="field" @textOverflow="handleInputOverflow" @focus="onFocus" @blur="onBlur" v-model="result"
                       :helpText="helpText" :hintText="hintText" :label="label" :error-text="errorText"
                       :errorColor="errorColor" :type="type" :labelFloat="labelFloat" :multiLine="multiLine"
                       :rows="rows" :rowsMax="rowsMax" :fullWidth="fullWidth" :disabled="disabled"
                       :maxLength="maxLength" :max="max" :min="min" :value="value"/>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK"

    export default {
        name: "sk-text-input",

        extends: SK,

        data(){
            return {}
        },

        created(){
            if (this.readOnly) {
                this.setReadOnly(true);
            }
        },

        methods: {
            onBlur(e){
                let value = this.getValue();
                this.$emit('blur', e, value);
                this.setValue(value);
                this.verify(this.bindRecord, value);
            },
            
            getValue(value){
                value = value !== undefined ? value : this.result;
                if (this.type == "number"){
                    value = parseFloat(value);
                    value = isNaN(value) ? "" : value;
                    
                    if (this.min != undefined && value < this.min){
                        value = this.min;
                    }
                    
                    if(this.max && value > this.max){
                        value = this.max;
                    }
                }
                return value;
            },
    
            setValue(v){
                if (v === undefined){
                    v = this.defaultValue;
                }
                this.result = v;
                
                if (!!v || v === 0 ) {
                    this.$refs.field.handleInput(v);
                }
            },

            onFocus(e){
                this.$emit('focus', e);
            },

            handleInputOverflow(isOverflow){
                this.errorText = isOverflow ? this.$t("字数超出限制啦！") : "";
            },

            setReadOnly(ifReadOnly){
                this.disabled = ifReadOnly;
            }
        },

        watch: {},

        props: {
            //输入框的类型，在单行输入时有效 text, password, email, url, number
            type: {
                type: String
            },

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
