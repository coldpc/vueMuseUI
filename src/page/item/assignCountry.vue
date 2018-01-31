<template>
    <sk-reload name="page.item.assignCountry">
        <sk-assign-country :editable="true"></sk-assign-country>
    </sk-reload>
</template>

<script type="text/javascript">
    import assignCountry from "./plugins/assignCountry.vue"
    
    export default {
        components: {"sk-assign-country": assignCountry},
        data(){
            return {
            }
        }
    }
</script>