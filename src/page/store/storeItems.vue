<!--创建门店-->
<template>
    <sk-reload name="page.store.storeItems">
        <sk-store-items></sk-store-items>
    </sk-reload>
</template>

<script type="text/javascript">
    import StoreItems from "./storeItemsPlugin.vue"

    export default {
        components: {'sk-store-items': StoreItems},
        data(){
            return {}
        },

        computed:{
        },

        methods: {
        }
    }
</script>
