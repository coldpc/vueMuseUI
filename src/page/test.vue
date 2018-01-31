<template>
    <div>
        {{a}}
    </div>
</template>

<script type="text/javascript">
    import Vue from "vue"
    import order from "@/lib/dataModules/order"

    /**
     *
     * 测试dataModule模块
     *
     * *******/
    
    window.order = order;
    
    order.queryAddress.execute({
        success: function (data) {
            
        },
        failed: function (res) {
            console.log(1,res);
        }
    });
    
    export default{
        data(){
            return {
                a: 1
            }
        }
    }
</script>