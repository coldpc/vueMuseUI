<template>
    <mu-row :gutter="gutter">
        <slot></slot>
    </mu-row>
</template>

<script type="text/javascript">

    export default {
        name: "sk-row",
        data(){
            return {

            }
        },
        props:{
            /** 栅栏之间是否有间距  **/
            gutter: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style lang="scss">

</style>