<template>
    <div class="activity-detail">
        
        <div class="service-list">
            <!-- getOrderDetail -->
            <sk-data-set v-model="orderDetail" :parse-data="initBaseData" auto-create auto-query :queryPara="{orderNo: orderNo}"
                         :query-service="order.getInfo" @load="loadData"></sk-data-set>
            
            <!-- 预约商品信息 -->
            <sk-data-set v-model="reserveItemDs"></sk-data-set>
            <!-- 照片预约商品信息 -->
            <sk-data-set v-model="picItemDs"></sk-data-set>
            <!-- 确认购物信息 -->
            <sk-data-set v-model="confirmShoppingDs"></sk-data-set>
            
            <!-- 查询送货信息 -->
            <sk-data-set v-model="queryDeliveryType" auto-create auto-query
                         :queryPara="{orderNo: orderNo}" :query-service="order.queryOrderDelivery"></sk-data-set>
            
            <sk-data-set v-model="internationalCodeDs" auto-create auto-query :query-service="baseData.getInInternationalCode"></sk-data-set>
            
            <!-- 查询购物信息 -->
            <!--<sk-data-set v-model="queryShoppingInfo" auto-create auto-query @load="initShoppingInfo"-->
            <!--:queryPara="{orderScheduleNo: orderScheduleNo}" :query-service="order.queryByOrderScheduleNo"></sk-data-set>-->
        
        </div>
        
        <sk-fold :title="$t('activityBaseInfo')">
            <sk-table :bind="orderDetail">
                <div slot="row">
                    <sk-column name="storeName" :title="$t('orderStoreOrEventName')" align="center"></sk-column>
                    <sk-column name="orderNo" :title="$t('orderReservationNo')" align="center"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="totalAmount" :title="$t('orderOrderAmount')" align="center"></sk-column>
                    <sk-column :formatter="ctrlQty" name="qty" :title="$t('qty')" align="center"></sk-column>
                    <sk-column name="auditStatus" :title="$t('status')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <sk-fold :title="clientTitle">
            <sk-table :bind="orderDetail" ref="test">
                <div slot="buttons" v-if="waitExpress">
                    <sk-button primary @click="saveClientInfo">{{$t("save")}}</sk-button>
                </div>
                <div slot="row">
                    <sk-column :formatter="renderUserName" name="userName" :title="clientName" align="center" :editable="false && !!this.waitExpress"></sk-column>
                    <sk-column :formatter="renderPassport" name="passportNo" :title="$t('passportNo')" align="center" :editable="false && !!this.waitExpress"></sk-column>
                    <sk-column name="mobile" :title="$t('phone')" align="center" :editable="false && !!this.waitExpress"></sk-column>
                    <sk-column name="scheduleDateToString" view-type="time" :title="receiveTime"  align="center" :editable="this.waitExpress"></sk-column>
                    <sk-column name="deliverySubAddress" :if-hide="!deliveryFlag" :title="$t('receiveAddress')" align="center" :editable="!!this.waitExpress"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <sk-fold :title="$t('reservedProductInformation')">
            <sk-table :bind="reserveItemDs">
                <div slot="row">
                    <sk-column name="headAttachList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column name="itemName" :title="$t('productName')" align="center"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')" align="center"></sk-column>
                    <sk-column name="itemUnit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="itemPrice" view-type="money" :title="$t('price')"  align="center"></sk-column>
                    <sk-column name="skuName" :title="$t('SizeColor')" align="center"></sk-column>
                    <sk-column :formatter="ctrlQty" name="quantity" :title="$t('qty')" align="center"></sk-column>
                    <sk-column :formatter="ctrlDiscount" name="discount" :title="$t('OffDiscount')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <sk-fold :title="$t('orderPhotoReservedProductInformation')">
            <sk-table :bind="picItemDs">
                <div slot="row">
                    <sk-column name="headAttachList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column name="itemName" :title="$t('productName')" align="center"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')" align="center"></sk-column>
                    <sk-column name="itemUnit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="itemPrice" view-type="money" :title="$t('price')"  align="center"></sk-column>
                    <sk-column name="skuName" :title="$t('SizeColor')" align="center"></sk-column>
                    <sk-column :formatter="ctrlQty" name="itemQuantity" :title="$t('qty')" align="center"></sk-column>
                    <sk-column :formatter="ctrlDiscount" name="receivingAddress" :title="$t('OffDiscount')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <sk-fold :title="$t('orderCustomerContactHistory')">
            <!-- 对话-->
            <div class="chat-panel">
                <ul class="chat-list">
                    <li v-for="(chatItem, index) in queryChatList" :key="index" >
                        <div class="chat-time">{{ chatItem.createTime | formatMsgTime }}</div>
                        <div class="msg" :class="chatItem.channel=='BRAND'? 'brand':'client'" v-if="chatItem.chatType=='TEXT'">{{ chatItem.chatText }}</div>
                        <div class="msg" :class="chatItem.channel=='BRAND'? 'brand':'client'" v-if="chatItem.chatType=='IMG'">
                            <img :src="chatItem.imgAttachList[0].path" alt="">
                        </div>
                    </li>
                    <!-- 没有对话消息的时候提示 -->
                    <div class="noMsg" v-show="queryChatList.length==0" v-html="this.$t('hasNoMsg')"></div>
                </ul>
            </div>
            <div class="msg-input" v-if="showFlag">
                <textarea v-model="inputMsg"></textarea>
                <div class="btn-group-msg">
                    <sk-button :label="$t('uploadImg')" primary>
                        <input type="file" @change="sendImage" class="file-button">
                    </sk-button>
                    <sk-attach v-show="false" ref="attachment" @assign-id-updated="updatedImg" attach-type="IMG" :file-size-limit="4" @error="imgOutLimit" :max-files="1"></sk-attach>
                    <sk-button primary :label="$t('orderSend')" @click="sendMsg"></sk-button>
                </div>
            </div>
        </sk-fold>
        
        <div  v-if="deliveryFlag">
            <sk-fold :title="$t('deliveryInfo')" id="express_id">
                <sk-table :bind="queryDeliveryType">
                    <div slot="row">
                        <sk-column name="deliveryName" :title="$t('deliveredBy')" align="center" :editable="confirmExpressBtn"></sk-column>
                        <sk-column name="internationalCode" :title="$t('internationalCode')" align="center" :editable="confirmExpressBtn" edit-type="select" :option-bind="internationalCodeDs" display-field="internationalCode" value-field="internationalCode"></sk-column>
                        <sk-column name="deliveryMobile" :title="$t('deliveredPhoneNumber')" align="center" :editable="confirmExpressBtn"></sk-column>
                        <sk-column name="deliveryRemark" :title="$t('notes')" align="center" :editable="confirmExpressBtn"></sk-column>
                    </div>
                </sk-table>
                <sk-row v-if="confirmExpressBtn">
                    <div v-if="showFlag">
                        <sk-col class="checkExpress" :size="1">
                            <sk-button primary :label="$t('addDeliverInfo')" action="add" :bind="queryDeliveryType" @click="addExpresser" v-show="expressBtnFlag"></sk-button>
                            <sk-button primary :label="$t('isExpress')" @click="expressed" v-show="!expressBtnFlag"></sk-button>
                        </sk-col>
                    </div>
                </sk-row>
            </sk-fold>
        </div>
        
        <sk-fold :title="$t('orderConfirmedInfo')">
            <sk-table :bind="confirmShoppingDs">
                <div slot="row">
                    <sk-column :formatter="isPurchase" name="confirmShopping" :title="$t('purchase')" align="center"></sk-column>
                    <sk-column :formatter="confirmUnit" name="confirmUnit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="confirmAmount" :formatter="renderMoney" :title="$t('total')" align="center"></sk-column>
                    <sk-column name="confirmTime" view-type="time" :title="$t('orderConfirmedDate')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
        
        <div v-if="bottomBtnFlag">
            <div v-if="showFlag">
                <sk-fixed-bottom>
                    <sk-button primary :label="$t('accept')" @click="orderPass"></sk-button>
                    <sk-button :label="$t('refuse')" @click="orderRefuse"></sk-button>
                </sk-fixed-bottom>
            </div>
        </div>
    
    </div>
</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import order from "@/lib/dataModules/order"
    
    export default {
        data(){
            window.test = this;
            return {
                order,
                baseData,
                queryDs: null,
                reserveItemDs: null,
                picItemDs: null,
                orderDetail: null,
                internationalCodeDs: null,
                queryDeliveryType: null,
                confirmShoppingDs: null,
                shoppingInfo: null,
                type: this.$route.query.type,
                orderNo: this.$route.query.orderNo,
                orderItems: [],
                queryChatList: [],
                inputMsg: "",
                bottomBtnFlag: false,
                deliveryFlag: false,
                userName: "",
                clientTitle: "",
                clientName: "",
                receiveTime: "",
                expressBtnFlag: true,
                confirmExpressBtn: false,
                waitExpress: false,
                showFlag: true
            }
        },
        
        methods: {
            initBaseData(data){
                /** 判断预约还是送货 **/
                if ( data.deliveryType !== "HOTEL_DELIVERY" ){
                    this.clientName = this.$t('arriver');
                    this.clientTitle = this.$t('arriverInfo');
                    this.receiveTime = this.$t('arriveTime');
                }else {
                    this.deliveryFlag = true;
                    this.clientName = this.$t('receiver');
                    this.clientTitle = this.$t('receiverInfo');
                    this.receiveTime = this.$t('receiveTime');
                    
                    if ( data.orderStatus === "ACCEPT_ORDER" ){
                        this.confirmExpressBtn = true;
                    }
                }
                
                data.storeName = data.store.storeName;
                data.unit = data.totalUnit;
                data.confirmShopping = data.confirmShopping || "";
                data.confirmAmount = data.confirmAmount || "";
                data.auditStatus = "";
                data.mobile = data.orderContact.mobile;
                data.scheduleDateToString = this.$base.formatTime(data.deliveryTime, "yyyy-MM-dd hh:mm");
                
                /** 将预约商品 和 照片预约商品 数据分开**/
                data.reserveItem = [];
                data.picItem = [];
                data.orderDetails.map( (item,key) => {
                    if ( item.orderDetailType === "ITEM" ){
                        data.reserveItem.push(item);
                    } else {
                        data.picItem.push(item);
                    }
                });
                
                data.qty = 0;
                data.reserveItem.map((item,key) =>{
                    data.qty += item.quantity;
                });
                
                
                if ( data.totalAmount === 0 ) {
                    data.totalAmount = "-"
                }
                
                // orderStatus 'NOT_SUBMIT', 'SUBMIT', 'PAID', 'ACCEPT_ORDER', 'SEND_GOODS', 'RECEIPT_INIT', 'RECEIPT_REFUSE', 'COMPLETED', 'CANCEL'
                // preStatus 商户端备货状态(待审核，拒绝，通过) = ['WAIT_AUDITED', 'AUDITED', 'REFUSE_AUDITED']
                if(data.preStatus === "WAIT_AUDITED"){
                    data.auditStatus = this.$t('pending');  // 待审核
                } else if(!!data.confirmShopping && data.confirmShopping === "PURCHASED"){
                    data.auditStatus = this.$t('orderConfirmStatus'); // 已确认
                } else if(data.preStatus === "REFUSE_AUDITED"){
                    data.auditStatus = this.$t('refused'); // 已拒绝
                } else if(data.orderStatus === "CANCEL"){
                    data.auditStatus = this.$t('orderCanceledStatus');  // 已取消
                } else if(data.orderStatus === "SEND_GOODS"){
                    data.auditStatus = this.$t('Delivered'); // 已发货
                } else if(data.orderStatus === "ACCEPT_ORDER"){
                    data.auditStatus = this.$t('verified'); // 已通过
                }else {
                    data.auditStatus = "-";
                }
                
                if (data.orderStatus == 'PAID'){
                    this.bottomBtnFlag = true;
                }
                
                // 已支付 已备货
                if ( data.orderStatus === "PAID" || data.orderStatus === "ACCEPT_ORDER"){
                    this.waitExpress = true;
                }
                return data;
            },
            
            loadData (res) {
                let data = res[0].data;
                this.reserveItemDs.setData(data.reserveItem);
                this.picItemDs.setData(data.picItem);
                this.confirmShoppingDs.setData(data);
            },
            
            renderUserName(v, index, record){
                return record.data.orderContact.contactName;
            },
            
            renderPassport(v, index, record){
                return record.data.orderContact.passportNo;
            },
            
            ctrlDiscount(v){
                return v ? (100-v + "%") : "-";
            },
            
            ctrlQty(v){
                return v === "-" ? "-" : v;
            },
            
            isPurchase(v){
                return !!v ? this.$t('Purchased') : "-"
            },
            
            renderMoney(v){
                return !!v ? v : "-";
            },
            
            confirmUnit(v, i ,r){
                let data = r.data;
                if ( !!data.confirmShopping ){
                    return v;
                }else{
                    return "-";
                }
            },
            
            /** 保存送货人信息**/
            saveClientInfo() {
                let data = this.orderDetail.getCurrentData();
                let time = data.scheduleDateToString;
                let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/g;
                if(!reg.test(time)){
                    this.$store.commit("message", this.$t("timeFormatWrong"));
                    return;
                }
                order.saveArriveTime.execute({
                    data: {
                        orderNo: data.orderNo,
                        deliveryTimeStr: time
                    },
                    failed: function () {
                        this.$store.commit("message", this.$t("timeFormatWrong"));
                    }.bind(this),
                    success: function(){
                        this.$store.commit("message", this.$t("succeedSave"));
                    }.bind(this)
                });
            },
            
            /** 发消息 **/
            sendMsg(){
                if ( !this.inputMsg ){
                    this.$store.commit("message", this.$t('sendNoMsg'));
                    return;
                }
                order.saveOrderChat.execute({
                    data: {
                        chatText: this.inputMsg,
                        orderNo: this.orderNo
                    },
                    success: function(){
                        let chat = {
                            channel: "BRAND",
                            chatType: "TEXT",
                            createTime: new Date().getTime(),
                            chatText: this.inputMsg,
                            userName: "品牌"
                        };
                        this.queryChatList.push(chat);
                        this.inputMsg = "";
                        setTimeout(function(){
                            let list = document.querySelector(".chat-list"),
                                    panel = document.querySelector(".chat-panel");
                            panel.scrollTop = list.offsetHeight;
                        },10);
                    }.bind(this)
                });
            },
            
            /** 订单通过 **/
            orderPass(){
                this.$store.commit("confirm",{
                    message: this.$t('orderPass'),
                    ok: function(){
                        order.orderPassed.execute({
                            data: {
                                orderNo: this.orderNo
                            },
                            success: function(){
                                this.reload();
                            }.bind(this)
                        })
                    }.bind(this)
                });
            },
            
            /** 订单拒绝 **/
            orderRefuse(){
                this.$store.commit("confirm",{
                    message: this.$t('orderRefuse'),
                    ok: function(){
                        order.orderRefuse.execute({
                            data: {
                                orderNo: this.orderNo
                            },
                            success: function(){
                                this.reload();
                            }.bind(this)
                        })
                    }.bind(this)
                })
            },
            
            /** 发送图片 **/
            sendImage: function(e){
                this.$store.commit("loading", "发送图片中...");
                this.$refs.attachment.controller.selectFile(e.target);
                this.$refs.attachment.controller.uploadAll();
            },
            
            imgOutLimit(msg){
                this.$store.commit("message", this.$t(msg));
                this.$store.commit("hideLoading");
            },
            
            /** 上传完成图片拿到assignId之后 **/
            updatedImg(assignId,fileList){
                /** 发送消息传送assignId **/
                order.saveOrderChat.execute({
                    data:{
                        orderNo: this.orderNo,
                        imgAssignId: assignId
                    },
                    success: function(){
                        this.$store.commit("hideLoading");
                        //获取本地图片src
                        let imgSrc = this.$refs.attachment.controller.getViewList()[0].src;
                        let chat = {
                            channel: "BRAND",
                            chatType: "IMG",
                            createTime: new Date().getTime(),
                            imgAttachList: [{
                                path: imgSrc
                            }],
                            userName: "品牌"
                        };
                        this.queryChatList.push(chat);
                        /** 删除图片记录 清空assignId **/
                        this.$refs.attachment.setValue();
                        
                        setTimeout(function(){
                            let list = document.querySelector(".chat-list"),
                                    panel = document.querySelector(".chat-panel");
                            panel.scrollTop = list.offsetHeight;
                        },100);
                    }.bind(this)
                })
            },
            
            /** 添加收货人信息 **/
            addExpresser(){
                this.expressBtnFlag = false;
            },
            /** 确认发货 **/
            expressed(){
                let expressPersonInfo = this.queryDeliveryType.getCurrentData();
                expressPersonInfo.orderNo = this.orderNo;
                if (!expressPersonInfo.deliveryName || !expressPersonInfo.deliveryMobile){
                    this.$store.commit("message",this.$t('askInputExpresser'));
                    return;
                }
                this.$store.commit("confirm",{
                    message: this.$t('confirmExpress'),
                    ok: function(){
                        order.confirmDeliver.execute({
                            data: expressPersonInfo,
                            success: function(){
                                this.$store.commit("message", this.$t('orderPassed'));
                                this.reload();
                            }.bind(this)
                        })
                    }.bind(this)
                })
            },
            formatMsgTime: function(v){
                var v = new Date(v),
                        y = v.getFullYear(),
                        M = v.getMonth() + 1,
                        d = v.getDate(),
                        h = v.getHours(),
                        m = v.getMinutes(),
                        s = v.getSeconds();
                M = M < 10? "0" + M : M;
                d = d < 10? "0" + d : d;
                h = h < 10? "0" + h : h;
                m = m < 10? "0" + m : m;
                s = s < 10? "0" + s : s;
                return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
            },
            
            reload() {
                let name = this.$route.name;
                this.$store.dispatch('router/reload', name);
            }
            
        },
        
        filters: {
            formatMsgTime: function(v){
                var v = new Date(v),
                        y = v.getFullYear(),
                        M = v.getMonth() + 1,
                        d = v.getDate(),
                        h = v.getHours(),
                        m = v.getMinutes(),
                        s = v.getSeconds();
                M = M < 10? "0" + M : M;
                d = d < 10? "0" + d : d;
                h = h < 10? "0" + h : h;
                m = m < 10? "0" + m : m;
                s = s < 10? "0" + s : s;
                return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
            }
        },
        
        created(){
            /** 请求对话消息 **/
            order.queryChat.execute({
                data: {
                    orderNo: this.orderNo
                },
                pageSize: 1000,
                success: function(data){
                    this.queryChatList = data;
                }.bind(this)
            });
            
            if ( this.type === "detail" ){
                this.showFlag = false;
            }
        },
        
        mounted () {
            /** dom挂载之后获取条田窗口高度并scroll到最底部 **/
            setTimeout(function() {
                let list = document.querySelector(".chat-list"),
                        panel = document.querySelector(".chat-panel");
                panel.scrollTop = list.offsetHeight;
            },1000);
        }
    }
</script>

<style lang="scss" scoped>
    .activity-detail {
        padding-bottom: 100px;
    }
    .img-wrapper {
        width: 230px;
        height: 230px;
    }
    .img-wrapper img {
        width: 100%;
        height: 100%;
    }
    .btn-group-bottom {
        z-index: 1000;
        padding: 20px 0;
        position: fixed;
        bottom: 0;
        left: 220px;
        right: 0;
        text-align: center;
        background-color: rgba(0,0,0,0.1)
    }
    .chat-panel {
        width: 70%;
        height: 410px;
        border: 1px solid #ccc;
        padding-bottom: 30px;
        visibility: visible;
        overflow-y: auto;
        background-color: #eee;
    }
    .chat-panel li {
        list-style: none;
    }
    .chat-panel .noMsg {
        text-align: center;
        font-size: 20px;
        padding-top: 150px
    }
    .chat-time {
        height: 80px;
        line-height: 80px;;
        text-align: center;
        clear: both;
    }
    .chat-list {
        padding: 14px 40px;
    }
    .chat-list .msg {
        margin-right: 80px;
        padding: 10px;
        border-radius: 10px;
        position: relative;
        clear: both;
        color: #FFF;
    }
    .chat-list .msg img {
        max-width: 200px;
        vertical-align: bottom;
    }
    .chat-list .msg::before {
        line-height: 40px;
        text-align: center;
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        border: 1px solid #000000;
        font-size: 16px;
    }
    .chat-list .brand {
        margin-right: 80px;
        background-color: #000;
        float: right;
        
    }
    .chat-list .client {
        margin-left: 80px;
        background-color: #fff;
        color: #000;
        float: left;
    }
    .chat-list .brand::before {
        content: '商';
        top: 0;
        right: -80px;
        color: #000000;
    }
    .chat-list .brand::after {
        border: solid 10px;
        border-color: transparent transparent transparent #000000;
        right: -16px;
        position: absolute;
        top: 10px;
        content: '';
        width: 0;
        height: 0;
    }
    .chat-list .client::before {
        content: '客';
        background-color: #000;
        color: #fff;
        left: -80px;
        top: 0;
    }
    .chat-list .client::after {
        border: solid 10px;
        border-color: transparent #FFFFFF transparent transparent;
        left: -20px;
        position: absolute;
        top: 10px;
        content: '';
        width: 0;
        height: 0;
    }
    .msg-input {
        overflow: hidden;
    }
    .msg-input textarea {
        width: 70%;
        height: 140px;
        border: 1px solid #ccc;
        float: left;
        resize: none;
        outline: none;
        border-top: none;
    }
    .btn-group-msg {
        padding: 38px 0 0 10px;
        float: left;
    }
    .btn-group-msg>button {
        display: block;
    }
    .btn-group-msg>button:first-child{
        margin-bottom: 30px;
    }
    .btn-group-msg button + button.mu-raised-button{
        margin-left: 0;
    }
    .file-button{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
    }
    .demo-flat-button {
        background-color: #009688;
        color: #fff;
    }
    .checkExpress{
        text-align: right;
        margin-top: 10px;
    }


</style>
