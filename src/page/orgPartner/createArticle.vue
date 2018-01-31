<template>
    <div class="create-article-container">
        <div class="article-content">
            <div class="article-title common-wrapper">
                <sk-text-input :readonly="readonly" v-model="data.articleTitle" label="文章标题" :max-length="20"></sk-text-input>
            </div>
            
            <div class="article-tag common-wrapper">
                <sk-row>
                    <sk-col :size="2">
                        <div @keydown.enter="addTag">
                            <sk-text-input :readonly="readonly" help-text="最多三个 （Enter）" label="输入标签" v-model="newTag"></sk-text-input>
                        </div>
                    </sk-col>
                    <sk-col :size="2">
                        <div style="padding-top: 10px;">
                            <mu-float-button icon="add" @click="addTag" mini/>
                        </div>
                    </sk-col>
                </sk-row>
                
                <div class="tags-list">
                    <span v-for="(tag,index) in data.tags" :key="index" class="tag-item">
                        <mu-chip class="demo-chip" :show-delete="!readonly" @delete="handleClose(index)">{{tag}}</mu-chip>
                    </span>
                </div>
            </div>
            
            <div class="article-ad common-wrapper">
                <sk-attach :readonly="readonly" label="主图（请上传15:8的比例）" @no-file-change="onNoImgChange" @assign-id-updated="afterSaveAdImg"
                           v-model="data.assignId" @change-img-list="onChangeImg" ref="attachment" attachType="IMG"
                           source="USER" :max-files="1" :row-num="5"></sk-attach>
                <div v-if="!!src" class="ad-content">
                    <img :src="src" alt="">
                </div>
            </div>
            
            
            <div class="article-editor-wrapper">
                <div class="article-detail">
                    <div class="phone-con">
                        <img src="../../assets/phone.png">
                        <div class="phone-content">
                            <h2 style="font-weight: normal;">{{data.articleTitle}}</h2>
                            <!--<img v-if="src" :src="src" alt=""/>-->
                            <p>
                                <span>你创建的</span>
                                <span>阅读量1122次</span>
                            </p>
                            <div class="module-list" v-for="(module, index) in modules" :key="index">
                                <div v-if="!readonly" class="remove-module-con">
                                    <mu-icon-button icon="close" @click="removeModule(index)"/>
                                </div>
                                <div v-if="module.moduleType == 'ITEM'">
                                    <ul class="item-list">
                                        <li class="item-wrapper" v-for="(item, inx) in module.content"
                                            :key="index + '-' + inx">
                                            <div class="img-wrapper">
                                                <img class="item-img" :src="item.headPicUrl.pic_content">
                                            </div>
                                            <div class="item-info">
                                                <p>{{item.brandName}}</p>
                                                <p>{{item.itemName}}</p>
                                                <p>{{item.storePrice}}</p>
                                                <button>查看详情</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div v-else="">
                                    <div class="module-wrapper" v-html="module.content[0]"></div>
                                </div>
                            </div>
                        </div>
                        <div class="add-content-btn-con" v-if="!readonly">
                            <div class="btns">
                                <mu-flat-button @click="onShowLov" label="添加商品" icon="add" :primary="showSelectItem"/>
                                <mu-flat-button @click="onShowEditor" label="插入文本" icon="format_align_justify"
                                                :primary="showRichEditor"/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="!readonly" class="editor-part rich-editor" v-show="showRichEditor">
                    <sk-button label="插入" @click="insertRichText"></sk-button>
                    <sk-editor :height="570" :e-style="{marginTop: '10px'}" @ready="editorReady"></sk-editor>
                </div>
                
                <div v-if="!readonly" class="editor-part" v-show="showSelectItem">
                    <sk-lov ref="selectItems" @onReturn="onSelectedItems" :visible="showLov"></sk-lov>
                </div>
                
                <div style="clear: both;"></div>
            </div>
            
            <div v-if="!readonly" style="z-index: 1000;padding: 20px 0px;position: fixed;bottom: 0px;left: 220px;right: 0px;text-align: center;background-color: rgba(0,0,0,0.1)">
                <sk-button full-width primary label="保存" @click="saveAdImg"></sk-button>
            </div>
        </div>
    </div>
</template>


<script type="text/javascript">
    import orgPartner from "@/lib/dataModules/orgPartner"
    import SelectItems from "./selectItems"
    import ArrayApi from "@/lib/utils/ArrayApi";
    
    export default {
        data(){
            window.test = this;
            
            return {
                articleId: "",
                data: {
                    addSrc: "",
                    assignId: "",
                    tags: [],
                    articleTitle: "",
                    ad: ""
                },
                
                showLov: false,
                showRichEditor: true,
                showSelectItem: false,
                
                editor: null,
                readonly: false,
                
                editorConfig: {
                    width: "100%"
                },
                
                src: "",
                
                newTag: "",
                
                modules: []
            }
        },
        
        components: {"sk-lov": SelectItems},
        
        methods: {
            editorReady(editorInstance){
                this.editor = editorInstance;
            },
            
            onShowLov(){
                this.showRichEditor = false;
                this.showSelectItem = true;
            },
            
            onChangeImg(viewList){
                if (viewList.length > 0) {
                    this.src = viewList[0].src;
                } else {
                    this.src = "";
                }
            },
            
            addTag(){
                let tag = this.newTag;
                let tags = this.data.tags;
                
                if (tag && tags.length < 3 && tags.indexOf(tag) == -1) {
                    tags.push(tag);
                }
                this.newTag = "";
            },
            
            handleClose(index){
                this.data.tags.splice(index, 1);
            },
            
            //当选择item时候
            onSelectedItems(data){
                if (data.length > 0) {
                    this.modules.push({
                        moduleType: "ITEM",
                        content: data
                    });
                }
                console.log(data);
            },
            
            //显示富文本
            onShowEditor(){
                this.showRichEditor = true;
                this.showSelectItem = false;
            },
            
            insertRichText(){
                let content = this.editor.getContent();
                if (content) {
                    this.modules.push({
                        content: [content],
                        moduleType: "RICH_TEXT"
                    });
                    this.editor.setContent("");
                }
            },
            
            removeModule(index){
                this.modules.splice(index, 1);
            },
            
            save(){
                let modules = this.modules, module, newModule, result = [];
                for (let i = 0, l = modules.length; i < l; i++) {
                    module = modules[i];
                    if (module.moduleType == "ITEM") {
                        newModule = {moduleType: "ITEM"};
                        newModule.content = ArrayApi.getFieldValue(module.content, "itemId");
                        result.push(newModule);
                    } else {
                        result.push(module);
                    }
                }
                var obj = {
                    articleId: this.articleId,
                    articleTitle: this.data.articleTitle,
                    adAssignId: this.data.assignId,
                    tagsString: JSON.stringify(this.data.tags),
                    informationArticleModules: JSON.stringify(result)
                };
                
                orgPartner.create.execute({
                    data: obj,
                    success: function (articleId) {
                        this.articleId = articleId;
                        this.$base.removeLoading("");
                        this.$base.message("保存成功！");
                    }.bind(this),
                    failed: function (msg) {
                        this.$base.removeLoading("");
                        this.$base.message(msg);
                    }.bind(this)
                })
            },
            
            checkData(){
                let msg = "", obj;
                
                obj = this.data;
                if (!obj.articleTitle) {
                    msg = "请设置标题";
                } else if (obj.articleTitle.length > 20) {
                    msg = "标题超出啦！";
                }
                
                if (obj.tags.length < 1) {
                    msg = "请至少填写一个标签";
                }
                if (this.modules.length < 1) {
                    msg = "请至编辑文章内容!";
                }
                
                if (msg) {
                    this.$base.message(msg);
                    return false;
                } else {
                    return true;
                }
            },
            
            saveAdImg(){
                if (this.checkData()) {
                    this.$base.showLoading("保存中...");
                    this.$refs.attachment.save();
                }
            },
            
            onNoImgChange(list){
                if (list.length == 0 && !this.data.assignId) {
                    this.$base.message("请上传主图！");
                } else {
                    this.save();
                }
            },
            
            afterSaveAdImg(id, list){
                this.data.assignId = id;
                if (list.length == 0 && !this.this.data.assignId) {
                    this.$base.message("请上传主图！");
                } else {
                    this.save();
                }
            }
        },
        
        created(){
            let id = this.$route.params.key;
            if (id){
                if (this.$route.params.type == "look"){
                    this.readonly = true;
                }
                orgPartner.articleDetail.execute({
                    data: {
                        articleId: id
                    },
                    success: function (data) {
                        this.articleId = data.articleId;
                        
                        let modules = data.informationArticleModuleList, module;
                        for (var i = 0, l = modules.length; i < l; i++) {
                            module = modules[i];
                            if (module.moduleType == "ITEM"){
                                module.content = module.items;
                                delete module.items;
                            }
                        }
                        this.modules = modules;
                        
                        this.data = {
                            assignId: data.adAssignId,
                            articleTitle: data.articleTitle,
                            tags: ArrayApi.getFieldValue(data.tagTexts, "tagContent")
                        }
                    }.bind(this)
                });
            }
        }
        
    }
</script>

<style>
    .module-wrapper img {
        max-width: 100% !important;
    }
</style>

<style lang="scss" scoped>
    .create-article-container {
        padding-bottom: 100px;
    }
    
    .editor-part {
        padding-top: 6px;
        width: 700px;
        float: left;
    }
    
    .article-ad {
        margin-top: 20px;
    }
    
    .article-content {
        margin-top: 40px;
        margin-left: 40px;
    }
    
    .common-wrapper {
        width: 600px;
    }
    
    .ad-content {
        height: 320px;
        margin-top: 20px;
        position: relative;
        overflow: hidden;
    }
    
    .ad-content img, .input-btn {
        width: 100%;
        height: 100%;
    }
    
    .input-btn {
        cursor: pointer;
        display: block;
    }
    
    .tag-item + .tag-item {
        margin-left: 6px;
    }
    
    .tags-list {
        margin-top: 10px;
    }
    
    .article-editor-wrapper {
        margin-top: 20px;
    }
    
    .phone-con {
        width: 375px;
        position: relative;
        height: 760px;
    }
    
    .phone-con img {
        width: 100%;
    }
    
    .phone-content {
        position: absolute;
        top: 90px;
        left: 20px;
        right: 20px;
        bottom: 80px;
        cursor: pointer;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 6px;
    }
    
    .add-content-btn-con {
        position: absolute;
        top: 0;
        text-align: center;
        margin-top: 20px;
        padding-top: 10px;
        height: 60px;
        width: 80%;
        left: 10%;
        background-color: #f1f1f1;
    }
    
    .article-detail {
        width: 400px;
        float: left;
    }
    
    .item-list {
        list-style: none;
        padding: 10px;
    }
    
    .item-wrapper {
        overflow: hidden;
        position: relative;
        padding-left: 110px;
    }
    
    .item-wrapper + .item-wrapper {
        margin-top: 10px;
    }
    
    .img-wrapper {
        width: 100px;
        height: 100px;
        overflow: hidden;
        position: absolute;
        left: 0px;
        top: 0px;
    }
    
    .img-wrapper .item-img {
        width: 100%;
    }
    
    .item-info p {
        line-height: 20px;
        padding: 0px;
        margin: 0px 0 4px 0;
    }
    
    .item-info button {
        background: transparent;
        border: 1px solid #333;
        border-radius: 8px;
    }
    
    .module-wrapper {
        padding: 0 10px;
        margin: 10px 0;
    }
    
    .module-wrapper img {
        max-width: 100%;
    }
    
    .module-list {
        border: 1px dashed transparent;
        position: relative;
    }
    
    .module-list:hover .remove-module-con {
        display: inline-block;
    }
    
    .remove-module-con {
        position: absolute;
        right: 0px;
        top: 0px;
        display: none;
        zoom: 0.6;
    }
    
    .module-list:hover {
        border-color: #000;
    }
    
    .rich-editor {
        width: 700px;
        float: left;
    }
</style>