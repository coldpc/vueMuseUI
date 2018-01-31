import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

let config = {
    getBenefitType: {
        url: "/enum/getBenefitType"
    },
    
    getActivityBlackWhiteType: {
        url: "/enum/getActivityBlackWhiteType"
    },
    
    getActivityType: {
        url: "/enum/getActivityType"
    },

    getVenderActivityType: {
         url: "/enum/getActivityTypeForVendor"
    },
    
    getActivityDistributeType: {
        url: "/enum/getActivityDistributeType"
    },
    
    getActivityCountType: {
        url: "/enum/getActivityCountType"
    },

    getActivityStore: {
        url: "/store/getAbbrStoresByRegionIds"
    }
};
export default createDataModule(config, "enum");