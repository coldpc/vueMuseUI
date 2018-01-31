<template>
    <sk-reload name="page.item.edit">
        <sk-item :editable="true"></sk-item>
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
