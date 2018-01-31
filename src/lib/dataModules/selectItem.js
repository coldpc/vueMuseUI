import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    queryItems: {
        url: "/item/getItemsByQueryParams",
        params: {
            brandGlobalId: "userName"
        }
    },

    //获取所有品牌
    queryBrandList: {
        url: "/brandGlobal/queryBrandGlobalsByParams",
        paras: {}
    },

    //获取门店
    queryStoreList: {
        url: "/store/queryStoreList",
        paras: {
            brandGlobalId: "",

        }
    },

    queryCatalogList: {
        url: "/catalog/queryRootCatalogs",
        paras: {}
    }
};
export default createDataModule(config, "selectItems")
