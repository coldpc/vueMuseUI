import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

const config = {
    getAllContryList:{
        url: "/country/getAllContryList"
    },
    queryStoreList:{
        url: "/store/queryStoreListByParams",
        paras: {
            order: "asc",
            offset: 0,
            limit: 10,
            countryId: "",
            activeName: "",
            address: "",
            auditStatus: "",
            openFlag: "",
            storeType:0
        }
    },
    getStoreByStoreId:{
        url: "/store/getStoreByStoreId",
        paras: {
            storeId: ""
        }
    },
    getStoreListItems:{
        url: "/item/getStoreListItemsByQueryParams"
    },

    getItems:{
        url: "/item/getItemsByQueryParams"
    },

    saveOrUpdateStore:{
        // path: "duoduo/",
        url: "/store/saveOrUpdateStore",
    },

    //关联商品
    relateItems: {
        url: "/itemAssigned/itemsStoreAssigned",
        event: "",
        params: {
            storeId: "storeId",
            itemIds: "itemIds"
        }
    },

    //移除关联商品
    deleteRelatedProducts:{
        url: "/itemStoreMapping/deleteRelatedProductsByActivityOrStoreId"
    },

    //门店上下线
    storeOpenOrClose:{
        url: "/store/updateOpenFlagByStoreIds",
        storeIds: 'storeIds',
        openFlag: 'openFlag'
    },

    // 门店服务
    storeService: {
        url: "/storeServeConfig/queryStoreServeConfigs"
    },

    // 门店之选
    storeListItem: {
        url: "/storeListItemConfig/queryByPage",
        params: {
            storeId: "storeId"
        }
    },

    // 新增门店之选
    addStoreItem: {
        url: "/storeListItemConfig/saveOrUpdate",
        params: {
            storeId: "storeId",
            linkBizIds: "linkBizIds"
        }
    },

    // 删除门店之选
    deleteStoreItem: {
        url: "/storeListItemConfig/delete",
        params: {
            storeId: "storeId",
            linkBizIds: "linkBizIds"
        }
    },

    // 门店之选商品排序
    sortItem: {
        url: "/storeListItemConfig/sort",
        contentType: 'application/json',
        params: {
            storeListItemConfigs: "storeListItemConfigs"
        }
    }
};

export default createDataModule(config, "store");
