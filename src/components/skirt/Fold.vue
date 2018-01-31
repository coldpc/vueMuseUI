<template>
    <div class="fold-part">
        <div class="fold-header">
            <div class="fold-btn" @click="toggle">
                <span class="fold-title">{{title}}</span>
                <span class="icon-con" style="padding-top: 10px;">
                    <i v-if="!show" class="material-icons">keyboard_arrow_down</i>
                    <i v-else class="material-icons">keyboard_arrow_up</i>
                </span>
            </div>
        </div>
        
        <transition name="slide-fade" @before-enter="beforeEnter"  @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
            <div v-if="show" class="fold-content">
                <div class="fold-detail">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    export default{
        name: "sk-fold",
        
        data(){
            return {
                show: true
            }
        },
        
        props: {
            title: {
                type: String
            }
        },
        
        methods: {
            toggle(){
                let show = !this.show;
                this.show = show;
    
                //隐藏
                if (!show){
                    let dom = this.$el.querySelector(".fold-detail");
                    this.nextHeight = dom.offsetHeight + "px";
                }
            },
    
    
            beforeEnter(el){
                el.style.height = "0px";
            },
    
            beforeLeave(el){
                this.enter(el);
            },
    
            leave(el){
                setTimeout(function () {
                    this.beforeEnter(el);
                    el = null;
                }.bind(this), 100);
            },
    
            afterLeave(){
            },
            
            enter(el){
                let content = el.querySelector(".fold-detail");
                el.style.height = content.offsetHeight + "px";
            },
    
            afterEnter(el){
                el.style.height = "auto";
            }
        }
    }
</script>


<style lang="scss" scoped>
    .fold-part{
        margin-top: 20px;
    }
    .fold-header{
        padding: 10px 0;
        font-size: 16px;
        cursor: pointer;
    }
    .fold-btn{
        display: inline-block;
        cursor: pointer;
    }
    .fold-content {
    }
    .icon-con, .fold-title{
        vertical-align: middle;
        display: inline-block;
    }
    .slide-fade-enter-active, .slide-fade-leave-active{
        transition: all .45s cubic-bezier(0.23, 1, 0.32, 1);
        opacity: 1;
    }
    .slide-fade-before-enter, .slide-fade-leave-to{
        opacity: 0;
    }
    
</style>

