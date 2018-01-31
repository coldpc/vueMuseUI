<template>
    <sk-location>
        <template slot="location" scope="props">
            <img :src="src" alt="" @click="show">
            <transition name="fade" @after-enter="onViewerEnter">
                <div v-if="ifShow" class="sk-viewer-wrapper" :style="{left: props.left, top: props.top}" @click="hide">
                    <img class="viewer-content" :src="src" alt="" @click.stop @load="onLoadImg" :style="style">
                </div>
            </transition>
        </template>
    </sk-location>
</template>

<script>
    export default{
        name: "sk-viewer",
        
        data(){
            return {
                ifShow: false,
                img: null,
                naturalWidth: 0,
                naturalHeight: 0,
                
                w: "1",
                h: "1"
            };
        },
        
        created(){
            
        },
        
        props: {
            src: {type: String},
            width: {type: String, default: "100%"},
            height: {type: String, default: "auto"}
        },
        computed: {
            style(){
                let [w, h, style] = [this.w, this.h, {}];
                
                style = {
                    width: w + 'px',
                    height: h + 'px',
                    marginLeft: w / -2 + "px",
                    marginTop: h / -2 + "px"
                };
                
                return style;
            }
        },
        
        methods: {
            show(){
                this.ifShow = true;
            },
            hide(){
                this.ifShow = false;
            },
    
            onLoadImg(e){
                debugger;
                let img = this.img = e.target;
                this.naturalWidth = img.naturalWidth;
                this.naturalHeight = img.naturalHeight;
                this.setInitView();
            },
    
            onViewerEnter(el){
                let viewer = this.viewer = {
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
                
                let maxWidth = parseInt(viewer.width * 0.4);
                let maxHeight = parseInt(viewer.height * 0.4);
                
                //maxWidth / maxHeight * this.naturalWidth
                console.log("viewer:", viewer);
                this.setInitView();
            },
            
            setInitView(){
                let viewer = this.viewer;
                let img = this.img;
                
                if (viewer && img){
                    let maxWidth = parseInt(viewer.width * 0.4);
                    let maxHeight = parseInt(viewer.height * 0.4);
                    
                    let imgWidth = this.naturalWidth;
                    let imgHeight = this.naturalHeight;
    
                    imgWidth = imgWidth > maxWidth ? maxWidth : imgWidth;
                    imgHeight = imgHeight  * imgWidth / this.naturalWidth;
    
                    if(imgHeight > maxHeight){
                        imgHeight = maxHeight;
                        imgWidth = imgHeight  * this.naturalWidth / this.naturalHeight;
                    }
                    
                    this.w = imgWidth;
                    this.h = imgHeight;
                }
            },
    
            onScroll(e){
                console.log(e);
            },
            
            initEvent(){
                window.addEventListener("scroll", this.onScroll);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sk-viewer-wrapper{
        bottom: 0px;
        position: fixed;
        right: 0px;
        background-color: rgba(0,0,0,0.2);
    }
    img{
        width: 100%;
    }
    .viewer-content{
        top: 50%;
        left: 50%;
        position: absolute;
    }
</style>