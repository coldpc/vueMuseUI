import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    enumeration: {
        baseInfoType: {
            attr: "ATTRIBUTE", //属性
            spec: "SPEC" //规格
        }
    },

    //商品列表查询
    getItems: {
        url: "/item/getItemsByQueryParams",
        paras: {
            rootCatalogId: "",
            countryId: 103000,
            order: "asc",
            offset: 0,
            limit: 10,
            storeId: ""
        }
    },
    
    getItemsForActivitySelect: {
        url: "/item/getItemsForActivitySelect",
        paras: {}
    },

    //删除商品
    deleteByIds: {
        url: "/item/deleteByIds",
        event: "",
        params: {
            itemIds: "itemIds"
        }
    },

    //上架
    online: {
        url: "/item/changeToOnLine",
        event: "",
        params: {
            itemIds: "itemIds"
        }
    },

    //下架
    offline: {
        url: "/item/changeToOffLine",
        event: "",
        params: {
            itemIds: "itemIds"
        }
    },

    //取消分配
    cancelAssign: {
        url: "/item/assignCancel",
        event: "",
        params: {
            itemIds: "itemIds"
        }
    },

    getItemsOrderBySort: {
        url: "/item/getItemsOrderBySort",
        event: "",
        params: {
            rootCatalogId: "",
            catalogId: ""
        }
    },

    //提交排序
    batchUpdateItemSort: {
        url: "/item/batchUpdateItemSort",
        params: {
            itemListString: ""
        }
    },

    //获取商品基本属性 通过大类 商品上新用
    getItemBaseInfo: {
        url: "/itemAttributeMaster/queryByTypeAndCatalogIdOrderBySort",
        params: {catalogId: "", type: ""}
    },

    //获取商品
    getItemById: {
        url: "/item/getItemSaveOrInsert",
        event: "",
        params: {
            itemId: ""
        }
    },

    //商品上新或者保存
    maintain: {
        url: "/item/saveOrInsert",
        contentType: 'application/json',
        params: {}
    },

    //查询分配国家的详情 itemIds
    getAssignCountryDetail: {
        url: "/itemAssigned/getCountryTodoAssigned",
        params: {itemIds:""}
    },

    //分配国家
    assignCountry: {
        contentType: "json",
        url: "/itemAssigned/countryAssigned",
        params: {}
    },

    //取消分配国家
    unAssignCountry: {
        contentType: "json",
        url: "/itemAssigned/countryUnAssigned",
        params: {}
    },

    //查询分配门店的详情
    getAssignStoreDetail: {
        url: "/itemAssigned/getStoreTodoAssigned",
        itemIds:""
    },

    //分配门店
    assignStore: {
        contentType: "json",
        url: "/itemAssigned/storeAssigned",
        params: {
            hasShelfFlag: "",
            itemList: "",
            optStores: ""
        }
    },

    //取消分配门店
    unAssignStore: {
        contentType: "json",
        url: "/itemAssigned/storeUnAssigned",
        params: {
            hasShelfFlag: "",
            itemList: "",
            optStores: ""
        }
    },

    //获取商品分配详情
    getItemAssignDetail: {
        url: "/itemAssigned/getItemAssignsDetail",
        params: {itemId:''}
    },

    //取消商品分配到某个国家 countryItemId
    cancelAssignOneCountry: {
        url: "/itemAssigned/unAssignedCountry",
        paras: {itemIds:""}
    }

};

export default createDataModule(config, "order");

