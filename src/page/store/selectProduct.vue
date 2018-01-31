<!--创建门店-->
<template>
    <sk-reload name="page.store.selectProduct">
        <sk-select-product></sk-select-product>
    </sk-reload>
</template>

<script type="text/javascript">
    import selectProductPlugin from "./selectProductPlugin.vue"
    
    export default {
        components: {'sk-select-product': selectProductPlugin},
        data(){
            return {}
        },
        
        computed:{
        },
        
        methods: {
        }
    }
</script>
