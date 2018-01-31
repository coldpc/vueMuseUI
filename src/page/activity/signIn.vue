<template>
    <sk-reload name="page.activity.signIn">
        <sk-sign-in></sk-sign-in>
    </sk-reload>
</template>

<script type="text/javascript">
    import signIn from "./signInPlugin.vue"

    export default {
        components: {"sk-sign-in": signIn},
        data(){
            return {
            }
        }
    }
</script>
