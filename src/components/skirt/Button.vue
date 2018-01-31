<template>
    <mu-raised-button :full-width="fullWidth" @click="onClick" class="demo-raised-button" :label="label" :icon="icon" :disabled="readyOnly" :primary="primary">
        <slot></slot>
    </mu-raised-button>
</template>
<script>
    import DataSet from "@/lib/utils//DataSet"
    import Record from "@/lib/utils/Record"
    
    export default{
        name: "sk-button",
        data(){
            return {
                bindDs: null,
                hasBind: false
            }
        },
        props: {
            fullWidth: {
                type: Boolean,
                default: false
            },
            label: {
                type: String
            },
            readyOnly: {
                type: Boolean,
                default: false
            },
            action: {
                type: String
            },
            bind: {
                type: DataSet
            },
            primary: {
                type: Boolean,
                default: false
            },
            icon: {
                
            },
            parentBind: {}
        },
        
        created(){
            if (this.bind){
                this.setBindDs(this.bind);
            }
        },
        
        watch: {
            parentBind(ds, old){
                if (!!ds && !this.hasBind){
                    this.setBindDs(ds, old);
                }
            },
    
            bind(ds){
                if (ds){
                    this.setBindDs(ds);
                }
            }
        },
        methods: {
            setBindDs(ds){
                if (ds){
                    this.hasBind = true;
                    this.bindDs = ds;
                }
            },
            
            onClick(){
                let bind = this.bindDs;
                if (bind) {
                    bind.doAction(this.action);
                }
                this.$emit("click", this.action, bind);
            }
        }
    }
</script>

<style lang="scss">
    .mu-raised-button-primary .mu-ripple-wrapper {
        margin-left: 0;
    }
</style>
