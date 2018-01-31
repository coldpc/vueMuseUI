import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    login: {
        url: "/user/login",
        event: "",
        params: {
            loginName: "userName",
            password: "password"
        }
    },

    logout: {
        url: "/user/logout"
    },

    selectBrand: {
        url: "/brandGrade/getBrandGradesByUserId"
    },

    adminLogin: {
        url: "/user/adminLogin"
    },

    changePassword: {
        url: "/user/updateUserPwdByUserId",
        params: {
            oldPwd:21,
            newPwd:21,
            newPwdOk:21
        }
    }
};
export default createDataModule(config, "account")
