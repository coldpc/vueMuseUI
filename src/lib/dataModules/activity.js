import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

const config = {
    
    /**获取活动树结构***/
    getStoreNodes: {
        url: "/store/getSubStoreNodes"
    },

    /**新的获取活动树结构***/
    getStoreNodesWithActivityCount: {
        url: "/activity/getSubStoreNodesWithActivityCount"
    },

    // 获取当前门店的所有参加的活动
    getCurrentActivitysByStoreId: {
        url: "/activity/getCurrentActivitysByStoreId",
        params: {
            storeId: ""
        }
    },
    
    // 删除活动
    deleteActivity: {
        url: "/activity/deleteActivity",
        params: {
            activityId: ""
        }
    },
    
    /** 活动上新 **/
    saveOrUpdateActivity: {
        url: "/activity/saveOrUpdateActivity",
        contentType: "json",
        params: {
            activity: ""
        }
    },

    /** 获取活动列表 **/
    getActivityList: {
        url: "/activity/getActivitiesByIds",
        params: {
            order: "asc",
            offset: 0,
            limit: 10,
            storeType: 1
        }
    },

    /** 通过活动名获取活动信息 **/
    getActivityById: {
        url: "/activity/getActivityById",
        params: {
            activityId: "activityId"
        }
    },

    /** 根据storeId 查询信息 **/
    getStoreByStoreId:{
        url: "/store/getStoreByStoreId",
        paras: {
            storeId: ""
        }
    },

    /** 获取活动已经关联的商品 **/
    findActivityItemDetail: {
        url: "/activity/findActivityItemDetail",
        params: {
            activityId: "storeId",
        }
    },

    /** 获取可添加的商品 **/
    getItemsByQueryParams: {
        url: "/item/getItemsByQueryParams",
        params: {
            storeId: "storeId",
            order: "asc",
            itemName: "itemName",
            itemModel: "itemModel"
        }
    },

    /** 活动上架 **/
    changeToOnLine: {
        url: "/activity/changeToOnLine",
        params: {
            activityIds: "activityIds"
        }
    },

    /** 活动下架 **/
    changeToOffLine: {
        url: "/activity/changeToOffLine",
        params: {
            activityIds: "activityIds"
        }
    },

    /** 删除活动 **/
    deleteByIds: {
        url: "/activity/deleteByIds",
        params: {
            activityIds: "activityIds"
        }
    },

     /** 添加关联活动商品 **/
     insertItem: {
        url: "/activity/saveActivityItems",
        params: {
            activityId: "",
            itemIds: ""
        }
     },

    /** 删除关联活动商品 **/
    removeItem: {
        url: "/activity/deleteActivityItems",
        params: {
            activityId: "",
            itemIds: ""
        }
    },

    /** 签到人数浏览 **/
    getActivitySignList: {
        url: "/activitySign/getActivitySignListByActivityId",
        method: "get",
        params: {
            activityId: "activityId"
        }
    },

    /** 获取SKU详情 **/
    getSkusByItemId: {
        url: "/sku/getSkusByItemId",
        params: {
            itemId: "itemId"
        }
    },
    
    getBenefitsByActivityId: {
        url: "/activity/getBenefitsByActivityId",
        params: {
            activityId: "activityId"
        }
    },
    saveActivityBenefitMappings: {
        contentType: "json",
        url: "/activity/saveActivityBenefitMappings",
        params: {
            activityId: "activityId"
        }
    },
    
    saveActivityItemMappings: {
        contentType: "json",
        url: "/activity/saveActivityItemMappings",
        params: {
            activityId: "activityId"
        }
    },
    getItemsByActivityId: {
        url: "/activity/getItemsByActivityId",
        params: {
            activityId: "activityId"
        }
    },
    
    getActivityStoreMappingsTreeByActivityId: {
        url: "/activity/getActivityStoreMappingsTreeByActivityId",
        params: {
            activityId: "activityId"
        }
    },
    saveActivityStoreMappings: {
        contentType: "json",
        url: "/activity/saveActivityStoreMappings",
        params: {
            activityId: "activityId"
        }
    },
    
    getBenefitArgProperties: {
        url: "/activity/getBenefitArgProperties",
        params: {
            benefitType: "benefitType"
        }
    },

    initQueryActivityDate: {
        url: "/activity/getActivityInitDateScope"
    }
};
export default createDataModule(config, "activity")
