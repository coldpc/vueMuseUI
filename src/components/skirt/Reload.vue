<template>
    <div v-if="!isReload" class="route-reload-container">
        <slot></slot>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import ArrayApi from "./../../lib/utils/ArrayApi";
    
    export default {
        name: 'sk-reload',
        data(){
            return {
                isReload: false
            };
        },
        
        props: {
            name: {
                default: '',
                type: String
            }
        },
        
        computed:{
            ...mapGetters({
                "routerOptions": "router/routerOptions"
            })
        },
        
        watch: {
            routerOptions() {
                let activeRoute = ArrayApi.getDataByAttr(this.routerOptions, 'active', true)[0];
                if (activeRoute && (!this.name || this.name === activeRoute.name) && activeRoute.needReload){
                    activeRoute.needReload = false;
                    this.isReload = true;
                }
            }
        },
        
        methods: {
        },
        updated() {
            if (this.isReload) {
                this.isReload = false;
            }
        }
    }
</script>