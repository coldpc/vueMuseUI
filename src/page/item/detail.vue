<template>
    <sk-reload name="page.item.detail">
        <sk-item :editable="false"></sk-item>
    </sk-reload>
</template>

<script type="text/javascript">
    import item from "./plugins/itemPlugin.vue"
    
    export default {
        components: {"sk-item": item},
        data(){
            return {
            }
        }
    }
</script>
