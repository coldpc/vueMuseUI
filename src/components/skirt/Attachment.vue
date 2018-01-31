<template>
    <div class="attachment-container" gutter :style="{width: 10 * (rowNum - 1) + rowNum * width + 'px'}">
        <div class="prompt-con">
            <span>{{label}}</span>
            <span v-if="remark" class="pro-remark">({{remark}})</span>
        </div>
        <sk-row v-if="!(disabled && viewList.length == 0)" v-for="line in lines" :key="line">
            <sk-col :key="num" v-for="num in rowNum" :size="rowNum" :style="{width: width + 'px', height: height + 'px'}">
                <div v-if="getImgSrc(line, num)" class="att-item">
                    <div v-if="!disabled" class="img-close-con" @click="removeItem(line, num)" style="zoom: 0.7;">
                        <div class="i-con">
                            <mu-icon-button icon="close" :size="10"></mu-icon-button>
                        </div>
                    </div>
                    
                    <div v-if="isImgFile(line, num)" class="img-con">
                        <img class="file-img" :src="getImgSrc(line, num)" alt="">
                    </div>
                    <span v-else-if="true">
                        <video style="width: 100%;height: 100%;" :src="getImgSrc(line, num)" controls="controls">
                            您的浏览器不支持 video 标签。
                        </video>
                    </span>
    
                    <!--<div v-show="progressList[getSort(line, num)] != 100 && !!progressList[getSort(line, num)]" class="bar-progress-con" style="position: absolute;bottom: 0px;z-index: 2;width: 100%;opacity: 0.6;">-->
                        <!--<mu-linear-progress :size="height" mode="determinate" :value="progressList[getSort(line, num)]" color="#333"/>-->
                    <!--</div>-->
                </div>
                
                <div v-else-if="!disabled && getAttInput(line, num)" class="att-input att-item">
                    <label class="input-btn" :for="pickerId">
                        <div class="input-icon">
                            <mu-icon color="#aaa" :size="width/2" value="add"/>
                        </div>
                    </label>
                    <input @change="onChangeFile" style="position:absolute;clip:rect(0 0 0 0);" :id="pickerId" :multiple="accessMulti && maxFiles > 1" type="file" :accept="accept" class="upload-img-input">
                </div>
            </sk-col>
        </sk-row>
        
        <div class="error-msg-con" v-show="errorText">{{errorText}}</div>
    </div>
</template>

<script type="text/javascript">
    import Vue from "vue";
    import attachment from "@/lib/datamodules/attachment";
    import attachmentController from "@/lib/utils/attachmentController";
    import SK from "./SK"

    const prefix = "uploader-picker-";
    var sequence = 1;
    
    export default {
        name: "sk-attach",
        
        extends: SK,
        
        data(){
            return {
                pickerId: prefix + (sequence ++),
                viewList: [],
                lines: 0,
                controller: new attachmentController({
                    attachType: this.attachType.toUpperCase(),
                    source: this.source.toUpperCase(),
                    maxFiles: this.maxFiles,
                    fileSizeLimit: this.fileSizeLimit * 1024 * 1024,
                    accept: this.accept,
                    type: ""
                }),
                
                progressList: {'0': 0},
    
                updatedAssignId: false //标记是否为updated
            };
        },
        
        props: {
            rowNum: {value: Number, default: 6}, //一行展示多少个
            height: {value: Number, default: 110}, //一行展示多少个
            width: {value: Number, default: 110}, //一行展示多少个
            accessMulti: {type: Boolean, default: true},
            maxFiles: {type: Number, default: 9},
            fileSizeLimit: {type: Number, default: 8}, //文件大小
            fileSingleSizeLimit: {type: Number, default: 1},
            accept: {type: String, default: "image/gif, image/jpeg, image/png"}, //video/*
            attachType: {type: String, default: attachment.enumeration.attachType.img},
            source: {type: String, default: attachment.enumeration.sourceType.user},
            label: {type: String},
            remark: {type: String}
        },
        
        //创建前
        beforeCreate(){
        },
        
        //创建后
        created(){
            let controller = this.controller;
            controller.addEventListener(controller.eventTypes.filesChange, function (list) {
                this.updateView(list);
            }.bind(this));
    
            controller.addEventListener(controller.eventTypes.updated, function (assignId, fileList) {
                this.setValue(assignId, true);
            }.bind(this));

            controller.addEventListener(controller.eventTypes.uploadAll, function (remoteFileList) {
                this.$emit("uploadAll", remoteFileList);
            }.bind(this));

            controller.addEventListener(controller.eventTypes.noNewFile, function (fileList) {
                this.$emit("no-file-change", fileList);
            }.bind(this));

            controller.addEventListener(controller.eventTypes.error, function (msg) {
                this.setError(this.$t(msg));
                this.$emit("error", msg);
            }.bind(this));

            controller.addEventListener(controller.eventTypes.uploadFailed, function (msg) {
                this.$store.commit("message", msg);
                this.$store.commit("hideLoading");
                this.$emit("upload-failed", msg);
            }.bind(this));

            controller.addEventListener(controller.eventTypes.progress, function (progress, fileItem) {
                this.$set(this.progressList, fileItem.sign, progress);
                this.$emit("upload-progress", progress);
            }.bind(this));

            this.updateView([], true);
        },

        methods: {
            getImgSrc(line, num){
                let index = this.getIndex(line, num);
                let item = this.viewList[index];
                if (item){
                    return item.src;
                }else{
                    return false;
                }
            },

            getSort(line, num){
                let index = this.getIndex(line, num);
                let item = this.viewList[index];
                if (item){
                    return item.sign;
                }else{
                    return 0;
                }
            },

            isImgFile(line, num){
                let index = this.getIndex(line, num);
                return this.viewList[index].fileType == 'img';
            },

            setValue(v, ifUpdated){
                this.result = v;
                this.controller.setAssignId(v);
                
                if (ifUpdated){
                    this.updatedAssignId = true;
                }
            },

            removeItem(line, num){
                let index = this.getIndex(line, num);
                let item = this.viewList[index];
                if (item) {
                    this.controller.removeFileBySign(item.sign);
                }
                this.verify(this.bindRecord);
            },

            getIndex(line, num){
                return (line - 1) * this.rowNum + num - 1;
            },

            getAttInput(line, num){
                let index = this.getIndex(line, num);
                return index == this.viewList.length;
            },

            /***************事件*****************/
            onChangeFile(e){
                let input = e.target;
                this.controller.selectFile(input);
                this.verify(this.bindRecord);
            },

            upload(){
                this.controller.upload();
            },

            updateView(viewList, ifInit){
                this.lines = Math.ceil((1 + viewList.length) / this.rowNum);
                this.viewList = viewList;
                this.$emit("change-img-list", viewList);

                let progressList = this.progressList;
                for (var i = 0, l = viewList.length; i < l; i++) {
                    if (progressList[viewList[i]] !== undefined){
                        progressList[viewList[i].sign] = 0;
                    }
                }
            },

            save(){
                this.controller.uploadAll();
            },

            //覆盖父级校验方法
            verify(record){
                let errorMsg = "";
                let ifRequired = this.required;
                let v = this.viewList.length;

                record = record || this.bindRecord;
    
                if (record && record.ifInit){
                    return;
                }

                if (ifRequired){
                    if (v == 0){
                        errorMsg = this.$t("requiredError");
                    }
                }else{
                    let func = this.validFunc;
                    if (typeof func == "function"){
                        errorMsg = func(this.result, this.viewList);
                    }
                }

                this.setError(errorMsg);

                if (record){
                    record.setVerifyResult(this.name, !errorMsg || errorMsg === true, errorMsg);
                }
            }
        },

        watch: {
            updatedAssignId(v){
                if (v && this.controller.assignId){
                    this.$emit("assign-id-updated", this.controller.assignId, this.viewList);
                    this.updatedAssignId = false;
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .error-msg-con{
        color: #f44336;
        font-size: 12px;
        margin-top: 2px;
    }
    .file-img{
        height: 100%;
    }
    
    .att-item{
        text-align: center;
        position: relative;
        width: 100%;
        height: 100%;
        padding: 6px;
        border: 1px dashed #ccc;
        .img-con{
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }
    .att-item.att-input{
        border: 1px dashed #ccc;
    }
    .att-input .input-btn{
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        text-align: center;
        cursor: pointer;
    }
    .att-input .input-icon{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .img-close-con{
        position: absolute;
        top: -10px;
        right: -10px;
        color: #666;
        z-index: 2;
    }
    .att-item:hover .img-close-con{
        color: #000;
    }
    .row + .row{
        margin-top: 10px;
    }
    
    .attachment-container{
        margin-top: 15px;
    }
    
    .prompt-con{
        padding-bottom: 6px;
    }
    
    .pro-remark{
        margin-left: 10px;
        color: #aaa;
    }
    .i-con{
        transform: scale(0.6, 0.6);
        display: inline-block;
        margin-right: -6px;
        margin-top: -6px;
    }
</style>