import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    getAllContryList: {
        // url: "/country/getAllContryList"
        url: "/country/getContryListByBrandId"
    },
    
    vendorCountries: {
        url: "/country/queryVendorCountriesByParams"
    },

    getCityListByCountryId: {
        url: "/city/getCityListByCountryId",
        paras: {
            countryId: ""
        }
    },

    getStoreByCountry: {
        url: "/store/queryAbbrStoresByUserAndParams",
        paras: {
            countryId: ""
        }
    },

    //货币
    getCurrencyList: {
        url: "/exchangeUnit/getCurrencyList",
    },

    //国家区号
    getInInternationalCode: {
        url: "/country/smsInternationalCode"
    },

    getActivity: {
        url: "activity/getActivitiesByIds",
        paras: {

        }
    },

    getAbbrStoreByCountryId: {
        url: "/activity/getAbbrStoreByCountryId",
        paras:{
            countryId: ""
        }
    },

    //商品大类别
    getRootCatalogs: {
        url: "/catalog/getRootCatalogs",
    },

    //商品小类别
    getCatalogsByParentId: {
        url: "/catalog/getCatalogsByParentId",
        paras:{
            parentCatalogId: ""
        }
    },

    //获取商品标签
    getItemTagList: {
        url: "/enum/getItemTagType"
    },

    //选择品牌列表
    getBrands: {
        url: "/brandGrade/getAbbrBrandGlobalsExcludeTreeForSelectBrand"
    },

    //获取商户级别
    getAccountGrade: {
        url: "/brandGrade/getBrandGradesByVendorUser"
    },

    //获取账号级别
    getVendorGrade: {
        url: "/brandGrade/getBrandGradeById"
    },

    userMenus: {
        url: "/user/getUserMenus"
    }
};
export default createDataModule(config, "baseData")
