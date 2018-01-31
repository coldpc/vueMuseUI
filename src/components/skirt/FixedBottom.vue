<template>
    <div style="height: 60px">
        <div class="fixed-bottom transition" :style="{left: routeView.left + 'px'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    
    export default{
        name: "sk-fixed-bottom",
        data(){
            return  {};
        },
    
        computed:{
            ...mapGetters({
                "routeView": "routeView"
            })
        }
    }
</script>


<style scope>
    .fixed-bottom{
        right: 0px;
        bottom: 0px;
        padding: 20px 0;
        position: fixed;
        z-index: 100;
        text-align: center;
        background-color: rgba(222,222,222,0.9);
    }
</style>