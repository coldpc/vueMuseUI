<template>
    <div class="sk-img-viewer-container transition"
         :style="{left: routeView.left + 'px', top: routeView.top + 'px', visibility: !!ifShow ? 'visible' : 'hidden', zIndex: !!ifShow ? 1000 : 0}">
        <ul class="images">
            <li><img alt="" style="display: none;"></li>
        </ul>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    
    export default{
        name: "sk-img-viewer",
        data(){
            return {
                imgViewer: null,
                jquery: window.jQuery,
                ifShow: false
            }
        },
    
        created(){
            var _this = this;
            $("body").on("click", "img", function () {
                if (!_this.ifShow) {
                    var src = $(this).attr("src");
                    _this.viewer(src);
                }
            });
        },
    
        methods: {
            viewer(src){
                if (!this.imgViewer){
                    this.init();
                }
                this.imgViewer.attr("src", src);
                this.imgViewer.viewer("show");
            },
        
            init() {
                this.imgViewer = jQuery(this.$el.querySelector("img"));
                window.viewer = this.imgViewer.viewer({
                    inline: false, //
                    fullscreen: false,
                    keyboard: true,
                    movable: true,
                    navbar: false,
                    toolbar: false,
                    zoomable: true,
                    rotatable: false, //旋转
                    scalable: false,
                    show: this.onShow,
                    hide: this.onHide
                });
                
                var _this = this;
                this.imgViewer.on("load.viewer", function () {
                    console.log("load");
                });
                
                this.imgViewer.on("view.viewer", function () {
                });
                
                this.imgViewer.on("viewed.viewer", function () {
                    _this.imgViewer.viewer("move", _this.routeView.left / -2, _this.routeView.top / -4);
                });
                
                
            },
        
            onShow(){
                this.ifShow = true;
            },
            
            move(){
                this.imgViewer.viewer("move", this.routeView.left / -2);
            },
        
            onHide(){
                this.ifShow = false;
            }
        },
        
        computed: {
            ...mapGetters({
                "routeView": "routeView"
            })
        },
    
        mounted(){
        }
    }
</script>

<style>
    .sk-img-viewer-container .viewer-fixed{
        position: absolute;
    }
</style>
<style scoped>
    .sk-img-viewer-container{
        position: fixed;
        bottom: 0px;
        right: 0px;
        z-index: 1;
        visibility: hidden;
    }
</style>

