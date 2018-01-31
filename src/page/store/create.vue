<!--创建门店-->
<template>
    <sk-reload name="page.store.create">
        <sk-store :hasStoreId="false"></sk-store>
    </sk-reload>
</template>

<script type="text/javascript">
    import store from "./storePlugin.vue"

    export default {
        components: {'sk-store': store},
        data(){
            return {
                storeId: this.$route.query.id,
                hasStoreId: true
            }
        },

        computed:{
        },

        methods: {
        }

    }
</script>