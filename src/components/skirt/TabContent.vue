<template>
    <div class="sk-tab-content">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        name: "sk-tab-content",
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
        
        methods: {}
    }
</script>

<style lang="scss">

</style>