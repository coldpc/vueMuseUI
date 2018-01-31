<template>
    <transition name="slide" v-on:enter="enter" @after-enter="afterEnter">
        <div  v-if="ifShow" class="phone-container transition" :style="{left: routeView.left + 'px', top: routeView.top + 'px'}" @click="hide">
            <div class="phone-content-wrapper" @click.stop="doThis" :style="{width: contentWidth}">
                <img class="phone-img" src="../../assets/phone.png" alt="">
                <div class="phone-content">
                    <slot></slot>
                </div>
                <transition name="fade">
                    <div v-if="hideMask" class="phone-content">
                        <div class="mask" ></div>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<script type="text/javascript">
    import { mapGetters } from 'vuex';
    
    export default {
        name: "sk-phone",
        data(){
            return {
                result: [],
                records: null,
                ifShow: false,
                contentWidth: 0,
                hideMask: true
            }
        },
        
        created(){
            window.addEventListener("resize", this.onWindowResize);
        },
        
        watch: {
        },
    
        computed:{
            ...mapGetters({
                "routeView": "routeView"
            })
        },
        
        methods: {
            
            enter(el){
                this.countWidth(el);
            },
    
            afterEnter(){
                this.hideMask = false;
            },
            
            onWindowResize(){
                let el = this.$el;
                if (el){
                    this.countWidth(el);
                }
            },
            
            countWidth(el){
                let h = el.offsetHeight;
                if (h){
                    this.contentWidth = parseInt(h * 372 / 761) + "px";
                }
            },
    
            doThis(){
                
            },
    
            hide(){
                this.ifShow = false;
                this.hideMask = true;
            },
            
            show(){
                this.ifShow = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .phone-container{
        position: fixed;
        bottom: 0px;
        right: 0px;
        background-color: rgba(0,0,0,0.5);
        text-align: center;
        z-index: 200;
        overflow: hidden;
    }
    .phone-content-wrapper{
        height: 100%;
        display: inline-block;
        position: relative;
        width: auto;
    }
    .mask{
        z-index: 2;
        width: 100%;
        background-color: #000;
    }
    .phone-img, .mask{
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .phone-content{
        position: absolute;
        right: 4%;
        left: 4%;
        top: 11%;
        bottom: 11%;
        background-color: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid #000;
    }
    .slide-enter-active .phone-content-wrapper{
        transition: all .2s ease;
    }
    .fade-enter-active, .fade-leave-active{
        transition: all 0.6s ease;
    }
    .fade-enter-active{
        opacity: 1;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    
    .slide-leave-active .phone-content-wrapper{
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-enter-active{
        opacity: 1;
    }
    .slide-enter, .slide-leave-to{
        opacity: 0;
    }
    .slide-enter .phone-content-wrapper, .slide-leave-to .phone-content-wrapper{
        transform: translate(100px, 0px);
    }
</style>


