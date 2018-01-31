<template>
    <mu-checkbox
            iconClass="sk-checkbox-i"
            labelClass="checkbox-label"
            
            :disabled="disabled"

            :uncheckIcon="uncheckedIcon"
            :checkedIcon="checkedIcon"
            
            :name="name"
            :label="label"
            :labelLeft="labelLeft"
            
            v-model="ownerResult"
    />
</template>

<script>
    import DataSet from "@/lib/utils//DataSet"
    import Record from "@/lib/utils/Record"
    import SK from "./SK";

    export default {
        name: "sk-checkbox",
        extends: SK,
        data(){
            return {
                ownerResult: false,
                myCheckedValue: ""
            }
        },

        created(){
            let value = this.value;
            if (!this.value && this.result != this.ownerResult){
                this.setValue(value);
            }
        },
        
        watch: {
            ownerResult(v){
                this.setValue(v);
            }
        },

        methods: {
            setValue(v){
                let ifChecked = v == this.checkedValue;
                this.ownerResult = ifChecked;
                
                if (ifChecked){
                    this.result = this.checkedValue;
                }else{
                    this.result = this.uncheckedValue;
                }
            }
        },

        props: {

            //标签文字是否在左边，默认在右边
            labelLeft:{
                type: Boolean
            },
    
            checkedValue: {default: true},
            uncheckedValue: {default: false},
    
            uncheckedIcon: {},
            checkedIcon: {}

        }
    }
</script>

<style>

</style>
