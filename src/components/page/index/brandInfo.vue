<template>
    <sk-data-set v-model="brandInfoDs" @load="onLoadBrandInfo" :query-service="brandGlobal.queryBrandGlobal" :auto-query="!brandInfo && hasLogin"></sk-data-set>
</template>

<script>
    import brandGlobal from "@/lib/dataModules/brandGlobal"
    import { mapGetters, mapActions } from 'vuex';
    
    export default{
        data(){
            return {
                brandGlobal,
                brandInfoDs: null
            };
        },
        
        created(){
            
        },
        
        computed: {
            ...mapGetters({
                "hasLogin": "hasLogin",
                "brandInfo": "brand/info"
            })
        },
        
        watch: {
            hasLogin(v){
                if (v){
                    this.brandInfoDs.query();
                }
            }
        },
        
        methods: {
            ...mapActions({
                alter: 'brand/alter'
            }),
            
            onLoadBrandInfo(records){
                let data = records[0].getData();
                if(data.picAttachList && data.picAttachList.length > 0){
                    data.logo = data.picAttachList[0].path;
                }
                this.alter(data);
            }
        }
    }
</script>