<template>
    <sk-reload name="page.store.editStore">
        <sk-store :hasStoreId="false"></sk-store>
    </sk-reload>
</template>

<script type="text/javascript">
    import store from "./storePlugin.vue"

    export default {
        components: {'sk-store': store},
        data(){
            return {
                hasStoreId: true
            }
        },

        computed:{
        },

        methods: {
        }

    }
</script>