<template>
    <div class="sk-link-con" :class="className">
        <router-link :to="link">{{label}}</router-link>
    </div>
</template>

<script>
    export default{
        name: "sk-link",
        data(){
            return {};
        },
        
        props: {
            path: {},
            name: {},
            params: {},
            label: {}
        },
        
        computed: {
            link(){
                return {
                    path: this.path,
                    name: this.name,
                    params: this.params
                };
            }
        }
    }
</script>