<template>
    <sk-reload name="page.item.assignStore">
        <sk-assign-store :editable="true"></sk-assign-store>
    </sk-reload>
</template>

<script type="text/javascript">
    import assignStore from "./plugins/assignStore.vue"
    
    export default {
        components: {"sk-assign-store": assignStore},
        data(){
            return {
            }
        }
    }
</script>