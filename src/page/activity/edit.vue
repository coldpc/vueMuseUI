<template>
    <sk-reload name="page.activity.edit">
        <sk-activity :editable="false"></sk-activity>
    </sk-reload>
</template>

<script type="text/javascript">
    import activity from "./activity.vue"
    
    export default {
        components: {"sk-activity": activity},
        data(){
            return {
            }
        }
    }
</script>
