import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    enumeration: {
        deliverType: {
            hotel: "HOTEL_DELIVERY", //开启送货上门
            store: "STORE_DELIVERY" //关闭送货上门
        },

        shoppingType: {
            reserve: "NO", //预约购物
            online: "YES" //在线购物
        },

        storeDeliveryFlag: {
            nonsupport: "OPPOSE_HOME", //不支持
            support: "SUPPORT_HOME" //支持
        }
    },

    getItems: {
        url: "/item/getItemsByQueryParams",
        paras: {
            rootCatalogId: "",
            countryId:103000,
            order: "asc",
            offset: 0,
            limit:10,
            storeId: ""
        }
    },

    /** 订单列表 **/
    queryOrderList: {
        url: "/orderHead/queryVendorOrderPageList",
        paras: {
          offset: 0,
          limit: 10,
        }
    },

    /** 订单的信息(接口数据不全) **/
     queryByOrderScheduleNo: {
        url: "/order/queryByOrderScheduleNo",
        params: {
            orderScheduleNo: ""
        }
    },

    /** 订单的信息(接口数据全) **/
     getInfo: {
        url: "/orderHead/getOrderDetail",
        params: {
            orderNo: ""
        }
    },
    
    /** 保存到店时间 ****/
    saveArriveTime: {
        url: "/orderHead/modifyScheduleDate",
        params: {
            orderNo: "",
            deliveryTimeStr: ""
        }
    },

    /** 预定商品订单 **/
     queryScheduleDetailByBrandIdScheduleNo: {
        url: "/order/queryScheduleDetailByBrandIdScheduleNo",
        params: {
            orderScheduleNo: ""
        }
    },

    /** 照片预定商品订单 **/
     getItemPicListByBrandIdScheduleNo: {
        url: "/order/getItemPicListByBrandIdScheduleNo",
        params: {
            orderScheduleNo: ""
        }
    },

    /** 客户商家对话框信息 (分页的形式) **/
    queryChat: {
        url: "/orderHead/getOrderChatsByOrderNo",
        params: {
            orderNo: "",
            pageSize: ""
        }
    },

    /** 发送消息 ( 包括文字和图片)**/
    saveOrderChat: {
        url: "/orderHead/saveOrderChat",
        params: {
            orderNo: "",
            chatText: "",
            imgAssignId: ""  //发图片需要assignId
        }
    },

    /** 审核备货通过 **/
    orderPassed: {
        url: "/orderHead/orderPassed",
        params: {
            orderNo: ""
        }
    },

    /** 订单拒绝 **/
    orderRefuse: {
        url: "/orderHead/orderRefuse",
        params: {
            orderNo: ""
        }
    },

    /** 查询送货信息 **/
    queryOrderDelivery: {
        url: "/orderHead/queryOrderDelivery",
        params: {
            orderNo: ""
        }
    },

    /** 批量通过订单 **/
    batchOrderPassed: {
        url: "/orderHead/batchOrderPassed",
        params: {
            orderNo: ""
        }
    },

    /** 订单确认 (确认是否购买) **/
    confirmOrderSchedule: {
        url: "/orderHead/confirmOrder",
        params: {
            orderNo: "",
            confirmShopping: "",  //NOT_PURCHASED-未购买；PURCHASED-已购买
            confirmAmount: "",
            confirmUnit: ""
        }
    },

    /** 确认发货 **/
    confirmDeliver: {
        url: "/orderHead/confirmDeliver",
        params: {
            orderNo: "",
            deliveryName: "",
            deliveryMobile: "",
            deliveryRemark: ""
        }
    }

};

export default createDataModule(config, "order");

