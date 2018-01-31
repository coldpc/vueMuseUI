import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    queryBrandGlobal:{
        url:"/brandGlobal/queryBrandGlobalByLoginUser"
    },

    saveOrUpdate: {
        url: "/brandGlobal/saveOrUpdate"
    }
}

export default createDataModule(config, "brandGlobal");