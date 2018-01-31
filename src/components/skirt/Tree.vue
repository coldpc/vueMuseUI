<template>
    <div class="sk-tree-container">
        <div class="tree"></div>
    </div>
</template>

<script>
    import "@/components/fancytree/lib/jqueryUi/jquery-ui-1.10.4.custom.min.js"
    import "@/components/fancytree/dist/jquery.fancytree.min.js"
    import "@/components/fancytree/dist/jquery.fancytree-custom.min.js"
    import "@/components/fancytree/dist/src/jquery.fancytree.filter.js"
    import "@/components/fancytree/dist/skin-win8/ui.fancytree.css"
    
    export default {
        name: "sk-tree",
        
        data() {
            return {
                treeData: null,
                treePlugin: null
            };
        },
        
        created() {
            this.treeData = this.source;
        },
    
        props: {
            //树的数据
            source: {type: Array},
            
            //Make sure that the active node is always visible, i.e. its parents are expanded (default: true).
            activeVisible: {
                default: true,
                type: Boolean
            },
    
            //object	Default options for ajax requests
            ajax: {
                type: Object
            },
            aria: {
                default: false,
                type: Boolean //Add WAI-ARIA attributes to markup
            },
            autoActivate: {
                default: true, //Boolean	Activate a node when focused with the keyboard (default: true)
                type: Boolean
            },
        
            //Boolean	Automatically collapse all siblings, when a node is expanded (default: false).
            autoCollapse: {
                type: Boolean,
                default: false
            },
        
            //	Scroll node into visible area, when focused by keyboard (
            autoScroll: {type: Boolean, default: false},
        
            //	Display checkboxes to allow selection (,
            checkbox: {type: Boolean, default: false},
        
            //Defines what happens, when the user click a folder node.
            //1:activate, 2:expand, 3:activate and expand, 4:activate/dblclick expands (default: 4)
            clickFolderMode: {type: Number},
        
            //0..2 (null: use global setting $.ui.fancytree.debugInfo)
            debugLevel: {type: Number},
        
            //callback(node) is called for ner nodes without a key. Must return a new unique key. (default null: generates default keys like that: "_" + counter)
            defaultKey: {type: Function},
        
            //Accept passing ajax data in a property named `d`
            enableAspx: {type: Boolean, default: true},
        
            //List of active extensions [filter]
            extensions: {type: Array, default: function () {
                return []
            }},
    
            filter: {
                type: Object,
                default: function () {
                    return {
                        mode: "hide"
                    };
                }
            },
        
            //Set focus when node is checked by a mouse click (
            focusOnSelect: {type: Boolean, default: false},
        
            //	Add `id="..."` to node markup (
            generateIds: {Boolean, default: false},
        
            //Display node icons (
            icons: {type: Boolean, default: true},
            idPrefix: {type: String, default: "ft_"},
        
            //Path to a folder containing icons using 'skin/' subdirectory
            imagePath: {type: String, default: null},
        
            //Support keyboard navigation (
            keyboard: {type: Boolean, default: true},
            
            //    1: single, 2: multi, 3: multi - hier(default: 2
            selectMode:  {type: Number, default: 2},
            
            // effect
            toggleEffect: {
                type: Object,
                default: function () {
                    return {
                        effect: "blind",
                        options: {
                            direction: "vertical",
                            scale: "box"
                        },
                        duration: 200
                    }
                }
            }
        },
        
        watch: {
            source: function (newData) {
                this.treeData = newData;
            },
    
            treeData: function (treeData) {
                this.setSource(treeData);
            }
        },
        
        methods: {
            init(){
                if (!this.treePlugin) {
                    this.treePlugin =  window.jQuery(this.$el.querySelector(".tree")).fancytree(this.getConfig());
                }
            },
            
            getConfig(){
                return {
                    extensions: this.extensions,
                    filter: this.filter,
                    checkbox: this.checkbox, // 启用checkbox
                    selectMode: this.selectMode,
                    source: this.treeData,
                    select: this.onSelect,
                    focus: this.onFocus,
                    click: this.onClick
                }
            },
            
            setSource: function (sourceData) {
                this.treePlugin.fancytree("option", "source", sourceData);
                this.$emit("updated", this.getTree());
            },
            
            onSelect(event, data){
                this.$emit("select", data);
            },
            
            getTree(){
                return this.treePlugin.fancytree("getTree");
            },
            
            getSelectedNodes(){
                let result = window.jQuery.map(this.getTree().getSelectedNodes(), function(node){
                    return node.data;
                });
                return result;
            },
            
            //data.node.data
            onFocus(event, data){
                this.$emit("focus", event, data);
            },
    
            // 点击节点
            onClick(event, data){
                this.$emit("click", event, data);
            },
            
            filterTreeByKeyword(keyword){
                let tree = this.treePlugin.fancytree("getTree");
                let n, leavesOnly = false;
        
                if (!keyword){
                    tree.clearFilter();
                    n = [];
                }else{
                    n = tree.filterNodes(keyword, leavesOnly);
                }
                return n;
            }
        },
        
        mounted: function () {
            this.init();
        }
    }
</script>

<style lang="scss">
    .tree ul.fancytree-container li{
        padding: 0px;
    }
</style>
