import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    enumeration: {
    },

    userMenu: {
        url: "/user/getUserMenus",
        paras: {
        }
    }
};

export default createDataModule(config, "userPermission");