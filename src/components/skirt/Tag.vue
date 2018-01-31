<template>
    <div :disabled="disabled" class="tags-part" :class="focusClass" style="width: 100%;" @mousedown="onMouseDown">
        <div @keydown.enter="addTag" class="input-con">
            <sk-text-input @focus="onFocus" @blur="onBlur" :error="errorText" :fullWidth="true" :readonly="disabled" :help-text="helpText" :label="label" v-model="newTag"></sk-text-input>
        </div>
        <div class="add-btn-con">
            <mu-float-button icon="add" @click="addTag" mini/>
        </div>
        <div class="tags-con transition">
            <span v-for="(tag,index) in tags" :key="index" class="tag-item">
                <mu-chip class="demo-chip" :show-delete="!readonly" @delete="handleClose(index)">{{tag}}</mu-chip>
            </span>
            <span class="tag-text">{{tagText}}</span>
        </div>
        <div class="masker" @click="onClickMasker"></div>
    </div>
</template>


<script type="text/javascript">
    import SK from "./SK";
    
    export default{
        name: "sk-tag",
        extends: SK,
        data(){
            return {
                tags: [],
                newTag: "",
                focusClass: "",
                canBlur: true,
                tagText: ""
            }
        },
        
        props: {
            blank: {default: ",", type: String},
            maxLength: {default: 9}
        },
        
        methods: {
            addTag(){
                let newTag = this.newTag;
                let tags = this.tags || [];
                newTag.replace("\n", "");
                
                if ((!!this.maxLength && this.maxLength == tags.length) || !newTag || tags.indexOf(newTag) > -1){
                    return;
                }
    
                tags.push(newTag);
                this.setValue(tags);
            },
            
            setValue(value){
                value = value || [];
                if (value && typeof value == "string"){
                    value = value.split(this.blank);
                }
                this.tags = value;
                this.result = value;
                this.newTag = "";
                this.tagText = !!value ? value.join("，") : "";
            },
    
            handleClose(index){
                let tags = this.tags;
                tags.splice(index, 1);
                this.setValue(tags);
                this.input.focus();
            },
    
            onClickMasker(e){
                let input = this.input;
                if (!input){
                    input = this.input = e.target.parentNode.querySelector(".mu-text-field-input");
                    input.onBlur = this.onBlur;
                }
                input.focus();
            },
    
            onFocus(){
                this.canBlur = true;
                this.focusClass = 'focus-tag-part';
            },
            
            onBlur(){
                if (this.canBlur){
                    this.newTag = "";
                    this.focusClass = '';
                }else{
                    this.input.focus();
                }
            },
    
            onMouseDown(){
                this.canBlur = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .tags-part{
        width: 100%;
        position: relative;
    }
    .input-con{
        padding-right: 40px;
    }
    .tags-con{
        display: inline-block;
        margin-left: -10px;
        position: absolute;
        top: 14px;
        left: -2px;
        width: 100%;
        z-index: 2;
        overflow: hidden;
        height: 50px;
        text-overflow: ellipsis;
        padding-right: 50px;
        white-space: nowrap;
    }
    .tag-text{
        display: inline-block;
        margin-top: 20px;
        margin-left: 14px;
        font-size: 12px;
    }
    .tag-item{
        display: none;
    }
    .masker{
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 3;
        background-color: #ccc;
        opacity: 0;
        cursor: text;
    }
    .tags-part[disabled] .masker{
        cursor: inherit;
    }
    .focus-tag-part{
        .masker {
            display: none;
        }
        .tag-item{
            display: inline-block;
        }
        .tag-text{
            display: none;
        }
        .tags-con{
            top: 70px;
            height: auto;
            text-overflow: ellipsis;
            padding-right: 50px;
            white-space: normal;
        }
    }
    .tags-con .tag-item {
        margin-left: 10px;
        margin-top: 18px;
        zoom: 0.8;
    }
    .add-btn-con{
        display: inline-block;
        vertical-align: middle;
        position: absolute;
        top: 12px;
        right: -5px
    }
</style>