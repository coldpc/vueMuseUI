<template>
    <sk-phone ref="phone">
        <div class="header-part table">
            <div class="td back-td">
                <span style="margin-top: 10px">
                    <i class="material-icons">keyboard_arrow_left</i>
                </span>
            </div>
            <div class="td">商品详情</div>
            <div class="td"></div>
        </div>
        <div class="sku-top-part">
            <div class="main-wrapper">
                <div class="main-img-wrapper">
                    <img v-if="viewData.headPic" class="img" :src="viewData.headPic"/>
                </div>
                <div class="item-detail-wrapper" style="">
                    <div class="d-title-part table">
                        <div class="td item-name-td">
                            <h3 class="brand-name">{{viewData.brandName}}</h3>
                        </div>
                        <div class="td" style="text-align: right;">
                            <span style="font-size: 12px;color: #aaa;">10000人浏览</span>
                        </div>
                    </div>
                    
                    <div class="detail-part">
                        <p class="item-name">{{viewData.itemName}}</p>
                        <p class="price-con">
                            <span class="currencyName">{{viewData.unitSign}}</span>
                            <span class="money">{{viewData.factPrice}}</span>
                        </p>
                    </div>
                    
                    <ul class="nav-tabs table">
                        <li class="active td pic">图文详情</li>
                        <li class="td">商品参数</li>
                    </ul>
                    
                    <div class="tab-pane-pic active" id="home">
                        <video v-if="viewData.videoPic" :src="viewData.videoPic" controls="controls" style="width: 100%; height: 100%;">
                            您的浏览器不支持 video 标签。
                        </video>
                        
                        <div class="img-item"  v-if="viewData.bodyPic" v-for="img in viewData.bodyPic">
                            <img class="img" :src="img.src">
                        </div>
                    </div>
                    
                    <div class="tab-pane-detail">
                        <div class="detail-title-con">
                            <h4>商品参数</h4>
                        </div>
                        <table class="basic-info">
                            <tr v-for="attr in viewData.attrList">
                                <td class="td name-td">{{attr.attributeName}}</td>
                                <td>
                                    <p class="i-content">{{attr.attributeValue}}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </sk-phone>
</template>

<script>
    import Phone from "../../skirt/Phone"
    export default{
        name: "sk-view-item",
        components: {
            "sk-phone": Phone
        },
        
        data(){
            return {};
        },
        
        props: {viewData: {}},
        
        methods: {
            show(){
                this.$refs.phone.show();
            },
            hide(){
                this.$refs.phone.hide();
            }
        }
    }
</script>

<style scoped lang="scss">
    .main-img-wrapper img{
        width: 100%;
    }
    .detail-part{
        text-align: left;
        padding: 10px;
    }
    .main-img-wrapper{
        background: #fff;
    }
    .header-part{
        line-height: 44px;
        overflow: hidden;
        border-bottom: 1px solid #CCC;
    }
    .header-part .td{
        vertical-align: middle;
    }
    .back-td{
        padding-top: 10px;
        display: inline-block;
        padding-left: 10px;
        text-align: left;
    }
    .table{
        display: table;
        table-layout: fixed;
        width: 100%;
        background-color: #fff;
    }
    .td{
        display: table-cell;
    }
    .item-detail-wrapper{
        margin-top: 10px;
        background-color: #fff;
    }
    .item-name-td{
        text-align: left;
        line-height: 14px;
    }
    .main-wrapper{
        background-color: #fafafa;
    }
    .brand-name{
        border-bottom: 2px solid #ad8f3f;
        padding-bottom: 14px;
        display: inline-block;
        margin-bottom: 0px;
        color: #ad8f3f;
    }
    .nav-tabs{
        margin: 0px;
        padding: 0px;
    }
    .nav-tabs .td{
        padding: 10px;
        background-color: #eee;
        color: #999;
    }
    .nav-tabs .td.active{
        color: #333;
        border-bottom: 2px solid #ad8f3f;
    }
    .d-title-part{
        padding: 0 10px;
    }
    .img-item img{
        width: 100%;
    }
    .name-td{
        width: 100px;
        text-align: left;
        padding: 10px;
    }
    .basic-info td{
        padding-right: 10px;
        text-align: left;
        vertical-align: top;
    }
    .i-content{
        margin: 0;
        padding: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        word-break: break-all;
    }
    .detail-title-con h4{
        margin: 0px;
        text-align: left;
        padding-left: 10px;
        font-size: 16px;
        font-weight: normal;
        border-bottom: 1px solid #eee;
        padding-bottom: 16px;
    }
    .detail-title-con{
        padding-top: 15px;
    }
    .basic-info{
        width: 100%;
        table-layout: fixed;
    }
    .basic-info td{
        border-bottom: 1px solid #eee;
    }
</style>