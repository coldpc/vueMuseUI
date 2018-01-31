<template>
    <div class="tab-title" @click="onClick">
        <slot></slot>
        <span>{{label}}</span>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        name: "sk-tab-title",
        props: {
            label: {
                type: String
            },
            name: {}
        },
        
        beforeCreate(){},
        
        created(){
        },
        
        watch: {
        },
        
        methods: {
            onClick: function () {
            
            }
        }
    }
</script>

<style lang="scss" scoped="">
    .tab-title {
        padding: 10px;
        min-width: 100px;
        border: 2px solid transparent;
        text-align: center;
        cursor: pointer;
        color: #999;
    }
    .tab-title.active{
        color: #333;
        border-bottom-color: #333;
    }
</style>