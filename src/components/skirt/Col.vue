<template>
    <mu-col :width="w" :tablet="tablet" :desktop="desktop" :size="size">
        <slot></slot>
    </mu-col>
</template>

<script type="text/javascript">

    export default {
        name: "sk-col",
        data(){
            return {
                w: "",
                tablet: "",
                desktop: ""
            }
        },
        props:{
            /** 定义栅栏的布局大小 **/
            size: {
                type: Number,
                default: 2
            },

            width: {}
        },
        created(){
            if (!!this.width){
                let width = this.width;
                if (!width){
                    width = parseInt(1 / this.size * 100) + "";
                }

                this.w = "100";
                this.tablet = width + '';
                this.desktop = width + '';
            }else{
                let size = parseInt(1 / this.size * 100) + "";
                this.w = "100";
                this.tablet = size + '';
                this.desktop = size + '';
            }
        }
    }
</script>

<style lang="scss">

</style>
