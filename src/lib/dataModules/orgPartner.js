import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    create: {
        url: "/article/addArticle",
        event: "",
        params: {
            loginName: "userName",
            password: "password"
        }
    },

    articleList: {
        url: "/article/queryArticleList",
        paras: {}
    },

    deleteArticle: {
        url: "/article/deleteArticle",
        params: {
            articleId: "articleId"
        }
    },

    articleDetail: {
        url: "/article/queryArticleDetail",
        params: {
            articleId: "articleId"
        }
    }
};
export default createDataModule(config, "account")
