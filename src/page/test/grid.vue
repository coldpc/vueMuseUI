<template>
    <div class="demo-grid">
        <sk-row gutter>
            <sk-col size="2">one</sk-col>
            <sk-col size="2">two</sk-col>
            <sk-col size="3">three</sk-col>
            <sk-col size="1">four</sk-col>
        </sk-row>
    </div>
</template>

<script type="text/javascript">

    export default {
        data(){
            return {

            }
        }
    }
</script>

<style lang="css">
    .demo-grid div[class*="col-"] {
        background: #fff;
        text-align: center;
        color: #000;
        border: 1px solid #ddd;
        padding: 8px;
        margin-bottom: 8px;
    }
</style>

