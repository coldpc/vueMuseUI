<template>
    <sk-viewer ref="v" width="100px" height="100px" src="http://img.yaok.com/user/2017-07-13/2017071323432553952622667177.jpg"></sk-viewer>
</template>

<script type="text/javascript">
    import Vue from "vue"
    import Viewer from "@/components/skirt/Viewer"

    Vue.component(Viewer.name, Viewer);

    export default {
        name: "sk-data-set",
        data(){
            window.test = this;
            return {};
        },

        created(){
           
        },

        methods: {
        }
    }
</script>
