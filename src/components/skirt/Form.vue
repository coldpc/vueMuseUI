<template>
    <form action="">
        <slot></slot>
    </form>
</template>
<script type="text/javascript">
    
    /**
     *
     * 为了复制拷贝需要的参数给我们内部的组件
     * 我们定义了很多有用的数据
     *  遍历需要递归
     *
     */
    const tagSign = "sk-"; //标记我呢内部组件
    function assignPropsData(children, bind){
        let child, tag, myChildren, componentOptions;
        
        for (let i = 0, l = children.length; i < l; i++) {
            child = children[i];
            componentOptions = child.componentOptions;
    
            if (componentOptions){
                tag = child.tag;
                if (!!tag && tag.indexOf(tagSign) > 0 && componentOptions && componentOptions.propsData){
                    if (!componentOptions.propsData.bind){
                        componentOptions.propsData.parentBind = bind;
                    }
                }
                myChildren = componentOptions.children;
            }else{
                myChildren = child.children;
            }
            
            if (!!myChildren && myChildren.length > 0) {
                assignPropsData(myChildren, bind);
            }
        }
    }
    
    export default{
        name: "sk-form",
        template: '<slot></slot>',
        
        props: {
            bind: {}
        },
        
        watch: {
            bind(ds){
                assignPropsData(this.$slots.default, ds);
            }
        },
        
        data(){
           return {};
        }
    };
</script>