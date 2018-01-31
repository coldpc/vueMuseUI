<template>
   <div>
       <div class="main-home"></div>
   </div>
</template>

<script>
    export default {
        data() {
            return {
                title: "test"
            }
        },
        

        methods: {

        }
    }
</script>
<style lang="scss" scoped>
    .main-home{
        transform: translateX(-50%);
        position: absolute;
        top: -100px;
        max-width: 550px;
        left: 50%;
        width: 80%;
        bottom: 0px;
        background-image: url("../assets/home-back.png");
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
    }
</style>
