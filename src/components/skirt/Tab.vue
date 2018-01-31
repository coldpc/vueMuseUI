<template>
    <div class="sk-tab-container">
        <div class="sk-tab-title" @click="onClick">
            <slot name="titles"></slot>
        </div>
        <div class="sk-tab-body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script>
    
    const titleContainerClass = ".sk-tab-title";
    const bodyCOntainerClass = ".sk-tab-body";
    const titleClass = ".tab-title";
    const activeStatus = "active";
    
    export default {
        data() {
            return {
                current: -1
            }
        },
    
        name: "sk-tab",
    
        props: {
            active: {
                type: Number,
                default: 0
            }
        },
    
        beforeCreate(){},
    
    
    
        created(){
        },
    
        watch: {
            current: function (index, oldIndex) {
                this.setCurrent(index, oldIndex);
            }
        },
        
        methods: {
            
            setCurrent: function (index, oldIndex) {
                let titleElement = this.$el.querySelector(titleContainerClass).children[0];
                let bodyElement = this.$el.querySelector(bodyCOntainerClass).children[0];
                bodyElement.children[index].style.display = "block";
                titleElement.children[index].classList.add(activeStatus);
                
                if (oldIndex >= 0){
                    bodyElement.children[oldIndex].style.display = "none";
                    titleElement.children[oldIndex].classList.remove(activeStatus);
                }
    
                this.$emit("switch", index);
            },
            
            onClick: function (e) {
                let titleElement = this.getTitleElement(titleClass, e.target);
                let index = this.getElementIndex(titleElement);
                if (index >= 0 && index != this.current){
                    this.current = index;
                }
            },
            
            getTitleElement(selector, node){
                let currentNode = node;
                let result;
                let body = "body";
                selector = selector.substr(1);
                
                while (currentNode.tagName.toLocaleLowerCase() != body){
                    if (currentNode.classList.contains(selector)){
                        result = currentNode;
                        break;
                    }else{
                        currentNode = currentNode.parentNode;
                    }
                }
                
                if (result){
                    return currentNode;
                }
            },
            
            getElementIndex: function (element) {
                return Array.prototype.slice.call(element.parentNode.children).indexOf(element)
            }
        },
        mounted: function () {
            this.current = this.active || 0;
        }
    }
</script>

<style lang="scss" scoped>
    .sk-tab-container{
        background-color: #fefefe;
        margin-top: 20px;
        border: 1px solid #eee;
        min-height: 400px;
    }
    .sk-tab-body .sk-tab-content{
        display: none;
    }
    .sk-tab-title > div{
        display: flex;
        flex-direction: row;
        background-color: #fefefe;
        border-bottom: 1px solid #eee;
    }
    .sk-tab-body{
        padding: 20px;
    }
</style>