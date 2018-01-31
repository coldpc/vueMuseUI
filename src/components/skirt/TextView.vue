<template>
    <div class="sk-text-view">
        <span class="prompt">{{label}}</span>
        <span class="space">:</span>
        <span class="text">{{value}}</span>
    </div>
</template>


<script type="text/javascript">
    export default{
        name: "sk-text-view",
        data(){
            return {
            }
        },
        
        props: {
            label: {type: String},
            value: {}
        }
    };
</script>

<style scoped lang="scss">
    .sk-text-view{
        .prompt{
            color: #444;
        }
        .text{
            color: #999;
        }
        .space{
            margin-right: 10px;
            margin-left: 4px;
        }
    }
</style>