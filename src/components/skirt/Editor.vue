<template>
    <div :style="eStyle">
        <ue-editor @before-create="beforeCreateEdit" ueditorPath="../../../static/ueditor/" :ueditor-config="editConfig" @ready="editorReady"></ue-editor>
    
        <sk-win :if-can-ctrl="!isLoading" ref="uploadWin" title="上传图片" scrollable>
            <sk-attach ref="attachment" @change-img-list="onChangeImg" @uploadAll="onUploadAll" :source="'RICH_TEXT'" attachType="IMG" :max-files="10" :row-num="5"></sk-attach>
            <div style="margin-top: 10px;overflow: hidden;">
                <div style="float: right;">
                    <sk-button label="确定" primary @click="saveUploadImg"></sk-button>
                </div>
                <div v-if="isLoading" class="loading-con">
                    <mu-circular-progress :size="20" :strokeWidth="2" color="#444"/>
                </div>
            </div>
        </sk-win>
    </div>
</template>

<script>
    import UEditor from "vue-ueditor";
    import toolbars from "@/lib/utils/toolbars";
                    
    export default{
        name: "sk-editor",
        
        beforeCreate(){
        },
        
        data(){
            let editConfig = this.config;
            editConfig.toolbars = this.toolbars;
            editConfig.initialFrameHeight = this.height;
            
            return {
                editor: null,
                dialog: false,
                isLoading: false,
    
                UE: null,
                editConfig
            };
        },
        components: {"ue-editor": UEditor},
        
        props: {
            config: {
                default: function(){
                    return {
                        autoHeight: false
                    }
                },
                type: Object
            },
    
            toolbars: {
                type: Array,
                default: function () {
                    return toolbars;
                }
            },
    
            eStyle: {},
    
            height: {default: "500"}
        },
        
        methods: {
            editorReady(editorInstance){
                editorInstance.container.style.width = "100%";
//                editorInstance.container.style.initialFrameHeight = this.height + "px";
                editorInstance.container.style.maxWidth = "1000px";
                editorInstance.container.style.margin = "0 auto";
                
                this.editor = editorInstance;
                this.$emit("ready", editorInstance);
                
                editorInstance.setContent('');
                this.createStyle(editorInstance);
            },
            
            createStyle(editorInstance){
                let iframe = editorInstance.container.querySelector("iframe");
                let style = document.createElement("style");
                style.setAttribute("type", "text/css");
                style.innerHTML = 'img{max-width: 100% !important;}';
                iframe.contentWindow.document.querySelector("head").appendChild(style);
            },
            
            ctrlUploadWin: function (ifClose, ifForce) {
                if (ifClose){
                    this.$refs.uploadWin.hide(ifForce);
                }else{
                    this.$refs.uploadWin.show(ifForce);
                }
            },
    
            beforeCreateEdit(UE){
                var _this = this;
    
                this.UE = UE;
                
                UE.registerUI('yk-upload-pic', function(editor, uiName) {
                    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                    editor.registerCommand(uiName, {
                        execCommand: function() {
                            //alert('execCommand:' + uiName)
                        }
                    });
                    //创建一个button
                    var btn = new UE.ui.Button({
                        //按钮的名字
                        name: uiName,
                        //提示
                        title: uiName,
                        //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                        cssRules: 'background-position: -380px 0;',
                        //点击时执行的命令
                        onclick: function() {
                            _this.ctrlUploadWin(false);
                        }
                    });
                    //当点到编辑内容上时，按钮要做的状态反射
                    editor.addListener('selectionchange', function() {
                        var state = editor.queryCommandState(uiName);
                        if (state == -1) {
                            btn.setDisabled(true);
                            btn.setChecked(false);
                        } else {
                            btn.setDisabled(false);
                            btn.setChecked(state);
                        }
                    });
                    //因为你是添加button,所以需要返回这个button
                    return btn;
                });
            },
    
    
            onUploadAll(imgList){
                this.isLoading = false;
                this.ctrlUploadWin(true, true);
    
                let html = "";
                for (let i = 0, l = imgList.length; i < l; i++) {
                    html += getImgHtml(imgList[i].path);
                }
                
                //插入富文本
                this.editor.setContent(html, true);
                
                function getImgHtml(path) {
                    return "<img style='max-width=100%;' src='" + path + "'>";
                }
            },
    
            onChangeImg(viewList){
                if (viewList.length < 2){
                    return;
                }
                //this.onUploadAll(viewList);
            },
    
            saveUploadImg(){
                this.isLoading = true;
                this.$refs.attachment.save();
            }
        }
    }
</script>


<style lang="scss" scoped>
    .loading-con{
        float: right;
        margin-top: 6px;
        padding-right: 20px;
    }
</style>