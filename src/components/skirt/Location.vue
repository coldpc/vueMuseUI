<template>
    <div>
        <slot name="location" :left="routeView.left + 'px'" :top="routeView.top + 'px'"></slot>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    
    export default{
        name: "sk-location",
        
        data(){
            return {
                
            };
        },
        
        props: {
        },
    
        computed:{
            ...mapGetters({
                "routeView": "routeView"
            })
        }
    }
</script>