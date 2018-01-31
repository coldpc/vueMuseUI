import {createDataModule} from "@/lib/dataModules/BaseDataCenter"

var config = {
    enumeration: {
        sourceType: {
            //来源:USER(用户,/user); ORDER(订单,/order); ITEM(商品,/item); BRAND(品牌,/brand); RICH_TEXT(富文本,/rich_text); OUTSIDE(外部,/OUTSIDE).
            user: "USER",
            order: "ORDER",
            item: "ITEM",
            brand: "BRAND",
            richText: "RICH_TEXT",
            outside: "OUTSIDE",
            message: "MESSAGE"
        },

        attachType: {

            //文件类型:IMG(图片,[.jpg, .jpeg, .png],BUCKET_IMG); VIDEO(视频,[.mp3],BUCKET_IMG); FILE(文件,[.*],BUCKET_IMG).
            img: "IMG",
            video: "VIDEO",
            file: "FILE"
        }
    },

    getAttachByAssignId: {
        url: "attach/queryByAttachAssignId",
        path: "uploadapi/"
    },

    maintainAssignId: {
        url: "attach/saveOrUpdateReturnAssignId",
        path: "uploadapi/",
        paras: {
            attachAssignId: "",
            attachList: ""
        }
    },

    upload: {
        url: "attach/upload",
        path: "uploadapi/",
        contentType: "file",
        paras: {
            attachType: "",
            source: ""
        }
    }
};
export default createDataModule(config, "attachment")
