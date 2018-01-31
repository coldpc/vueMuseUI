<template>
    <sk-reload name="page.item.assignDetail">
        <sk-assign-detail :editable="true"></sk-assign-detail>
    </sk-reload>
</template>

<script type="text/javascript">
    import assignDetail from "./plugins/assignDetail.vue"
    
    export default {
        components: {"sk-assign-detail": assignDetail},
        data(){
            return {
            }
        }
    }
</script>