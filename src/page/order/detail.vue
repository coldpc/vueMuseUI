<template>
    <sk-reload name="page.order.detail">
        <sk-order :editable="false"></sk-order>
    </sk-reload>
</template>

<script type="text/javascript">
    import orderPlugin from "./orderPlugin.vue"
    
    export default {
        components: {"sk-order": orderPlugin},
        data(){
            return {
            }
        }
    }
</script>