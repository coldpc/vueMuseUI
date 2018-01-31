import attachment from "@/lib/datamodules/attachment";
import EventListener from "@/lib/utils/EventListener";
import ArrayApi from "@/lib/utils/ArrayApi";

const service = attachment;
const prefix = "file-item-";
//定义文件类型
const fileType = {
    img: "image/gif, image/jpeg, image/png",
    video: "video/mp4,video/mpg,video/avi"
};
const errorCode = {
    imgOutOffNum: "imgOutOffNum",
    imgIncorrect: "imgIncorrect",
    imgOutOffSize: "imgOutOffSize"
};

var sequence = 1;

export default class AttachmentController extends EventListener{
    clientFileList = []; //客户端文件上传 上传完之后将会在移入远程文件
    remoteFileList = []; //远程文件 origin attid attachList
    status = ""; //标记是否需要调用保存接口 更新assignedId分配的文件

    assignId;

    attachType;
    source;
    hasChange = false;
    accept = "";

    eventTypes = {
        filesChange: "filesChange",
        uploadAll: "already-upload-all", //保存了所有的文件
        upload: "upload", //上传了某个文件
        updated: "updated", //更新了附件信息
        uploadFailed: "uploadFailed",
        noNewFile: "noNewFile",
        error: "error",
        progress: 'progress'
    };

    /**
     *
     * @param conifg
     * attachType 附件格式 文件格式
     * source 资源类型 富文本不具有assignId
     * assignId 分配id
     * maxFiles 最多文件数量
     * fileSizeLimit 每个文件限制的大小
     *
     */
    constructor(config){
        super();

        this.attachType = config.attachType;
        this.source = config.source;
        this.maxFiles = parseInt(config.maxFiles);
        this.fileSizeLimit = config.fileSizeLimit;
        this.accept = config.accept;
        this.setAssignId(config.assignId);
    }

    //县校验
    selectFile(input){
        let files = input.files, file, msg;
        for (let i = 0, l = files.length; i < l; i++) {
            file = files[i];

            //文件校验
            msg = this.checkFile(file);
            if ( !!msg ){
                this.dispatch(this.eventTypes.error, msg);
                break;
            }

            //URL.createObjectURL(file)
            this.addClientFile(file, window.URL.createObjectURL(file));

            //this.turnToLocal(files[i]);
        }
        input.value = null;
    }

    /**
     *
     * @param file
     * 校验文件
     * name:"fyzw_200921810852.jpg"
     * size:82377
     * type:"image/jpeg" //video/mp4
     */
    checkFile(file){
        let num = this.getViewList(), code;
        if (this.maxFiles !== 1 && num + 1 >= this.maxFiles){
            // return "超出大小";
            code = errorCode.imgOutOffNum;
        }

        if (this.accept.indexOf(file.type) === -1){
            // return "文件格式不正确";
            code = errorCode.imgIncorrect;
        }

        if (file.size >= this.fileSizeLimit){
            // return "文件过大";
            code = errorCode.imgOutOffSize;
        }

        return code;
    }

    turnToLocal(file){
        let reader, _this = this;
        reader = new FileReader();
        reader.onload = function(){
            _this.addClientFile(file, this.result);
            _this = null;
            file = null;
        };
        reader.readAsDataURL(file);
    }

    addClientFile(file, src){
        //单文件上传比较特殊 不需要删除
        if (this.maxFiles === 1){
            this.clearFiles();
        }

        if (this.maxFiles > this.remoteFileList.length + this.clientFileList.length){
            let o = {
                file: file,
                src: src,
                path: src,
                sign: prefix + (++ sequence),
                sort: (10000 + 1 + sequence),
                fileType: fileType.img.indexOf(file.type) > -1 ? "img" : "video"
            };
            this.clientFileList.push(o);
            this.dispatch(this.eventTypes.filesChange, this.getViewList());
        }
    }

    clearFiles(ifDispatch){
        this.remoteFileList = [];
        this.clientFileList = [];

        if (ifDispatch){
            this.dispatch(this.eventTypes.filesChange, this.getViewList());
        }
    }

    getViewList(){
        return this.remoteFileList.concat(this.clientFileList);
    }

    //设置附件分配id 自动查询
    setAssignId(id, auto = true){
        if (this.assignId !== id){
            this.assignId = id;
            if (!id){
                this.removeAll();
            }else{
                if (auto){
                    this.getRemoteFiles();
                }
            }
        }
    }

    getRemoteFiles(){
        service.getAttachByAssignId.execute({
            data: {
                attachAssignId: this.assignId
            },
            success: function (list) {
                /**
                 *
                 *  attachId:"2017061913132717615588985747"
                 *  attachType:"IMG"
                 *  path:"http://img.yaok.com/user/2017-06-19/7a169ec9-82c6-4403-856e-f4f272dd58b71600x1200-Thinkdots.jpg"
                 *  source:"USER"
                 *
                 */
                let remoteFileList = this.remoteFileList, item;
                for (let i = 0, l = list.length; i < l; i++) {
                    item = list[i];
                    remoteFileList.push({
                        src: item.path,
                        fileType: item.attachType.toLowerCase(),
                        sign: item.path,
                        sort: i,
                        path: item.path,
                        attachId: item.attachId
                    });
                }

                if (item){
                    this.source = item.source;
                    this.attachType = item.attachType;
                }

                this.dispatch(this.eventTypes.filesChange, this.getViewList());

            }.bind(this)
        });
    }

    //触发上传批处理
    uploadAll(){
        let clientFileList = this.clientFileList, l;

        l = clientFileList.length;
        if (l === 0){
            if (this.hasChange || (this.getViewList().length > 0 && !this.assignId)){
                this.updateAssign();
            }else{
                if (this.assignId){
                    this.dispatch(this.eventTypes.updated, this.assignId, this.getViewList());
                }else{
                    this.dispatch(this.eventTypes.noNewFile, this.getViewList());
                }
            }
        }else{
            for (let i = 0; i < l; i++) {
                this.doUpload(clientFileList[i], this.source, this.attachType);
            }
        }
    }

    //单个文件上传
    doUpload(fileItem, source, attachType) {
        let formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("source", source);
        formData.append("attachType", attachType);

        service.upload.execute({
            data: formData,

            //url: service.upload.item.url + '?attachType=' + attachType + '&source=' + source,

            onUploadProgress: function(progressEvent){
                this.dispatch(this.eventTypes.progress, Math.round((progressEvent.loaded * 100) / progressEvent.total), fileItem);
            }.bind(this),

            success: function(res){
                this.uploadSuccess(fileItem, res);
                fileItem = null;
            }.bind(this),

            failed: function(message){
                fileItem = null;
                this.uploadFailed(message);
            }.bind(this)
        });
    }

    /**
     * attachId:"2017061815490512854716112612"
     * attachType:"IMG"
     * bucket:"BUCKET_IMG"
     * path:"http://img.yaok.com/user/2017-06-18/be392004-2643-41c8-b6a4-5a1181e00296fyzw_2009218101719.jpg"
     * source:"USER"
     *
     **/
    uploadSuccess(fileItem, res){
        let clientFileList = this.clientFileList, temp;
        for (let i = 0, l = clientFileList.length; i < l; i++) {
            temp = clientFileList[i];
            if (temp.sign === fileItem.sign){
                this.clientFileList.splice(i, 1);
                break;
            }
        }

        let o = {
            src: fileItem.src,
            sign: fileItem.sign,
            path: res.path,
            attachId: res.attachId,
            sort: fileItem.sort,
            fileType: fileItem.fileType
        };

        //抛出消息
        this.dispatch(this.eventTypes.upload, o, fileItem);
        this.remoteFileList.push(o);
        if (this.clientFileList.length === 0){
            this.dispatch(this.eventTypes.uploadAll, this.remoteFileList);
            this.updateAssign();
        }

        //释放
        fileItem = null;
        res = null;
        o = null;
    }

    uploadFailed(message){
        this.dispatch(this.eventTypes.uploadFailed, message);
    }

    updateAssign(){
        if (this.source !== "RICH_TEXT"){
            let list = [].concat(this.remoteFileList);
            list.sort(function (a, b) {
                return a.sort - b.sort;
            });

            let fileList = ArrayApi.getFieldValue(list, "attachId").join(",");
            service.maintainAssignId.execute({
                data: {
                    attachAssignId: this.assignId,
                    attachList: fileList
                },
                success: function (assignId) {
                    this.assignId = this.assignId || assignId;
                    this.dispatch(this.eventTypes.updated, this.assignId, this.getViewList());
                }.bind(this),
                failed: function (msg) {
                    this.uploadFailed(msg);
                }.bind(this)
            });
        }
    }

    removeFileBySign(sign){
        let fileList = this.clientFileList;
        let index = ArrayApi.searchIndexByAttr(fileList, "sign", sign);

        if (index > -1){
            fileList.splice(index, 1);
            this.dispatch(this.eventTypes.filesChange, this.getViewList());
        }else{
            fileList = this.remoteFileList;
            index = ArrayApi.searchIndexByAttr(fileList, "sign", sign);
            this.hasChange = true;

            if (index > -1){
                fileList.splice(index, 1);
            }
            this.dispatch(this.eventTypes.filesChange, this.getViewList());
        }
    }

    removeAll(){
        this.clientFileList = [];
        this.remoteFileList = [];
        this.dispatch(this.eventTypes.filesChange, this.getViewList());
    }
};