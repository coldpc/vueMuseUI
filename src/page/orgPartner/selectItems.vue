<template>
    <div class="lov-container" v-show="ifShow || 1 == 1" @click="onClickContainer">
        <div class="lov-content">
            <sk-data-set v-model="queryDs" auto-create></sk-data-set>
            <sk-data-set v-model="brandDs" pagination page-size="10000" auto-query :query-service="serviceList.queryBrandList"></sk-data-set>
            <sk-data-set v-model="storeDs" pagination :bind="queryDs" bind-field="brandGlobalId" :query-service="serviceList.queryStoreList"></sk-data-set>
            <sk-data-set v-model="catalogDs" :query-service="serviceList.queryCatalogList" auto-query></sk-data-set>

            <sk-data-set v-model="itemListDs" :query-bind="queryDs" pagination page-size="20" :query-service="serviceList.queryItems"></sk-data-set>


            <div class="lov-body">
                <sk-form :bind="queryDs">
                    <sk-row>
                        <sk-col :size="3">
                            <sk-select v-model="brandId" @change="onChangeBrandId" :error="errorText" :bind="queryDs" label="品牌" name="brandGlobalId" :option-bind="brandDs" display-field="brandName" value-field="id"></sk-select>
                        </sk-col>
                        <sk-col :size="3">
                            <sk-select :bind="queryDs" label="门店" name="storeId" :option-bind="storeDs" value-field="storeId" display-field="storeName"></sk-select>
                        </sk-col>
                        <sk-col :size="3">
                            <sk-select :bind="queryDs" label="大类" name="rootCatalogId" :option-bind="catalogDs" value-field="catalogId" display-field="catalogName"></sk-select>
                        </sk-col>
                    </sk-row>

                    <sk-row>
                        <sk-col :size="3">
                            <sk-text-input :bind="queryDs" name="itemName" label="商品名称"></sk-text-input>
                        </sk-col>
                        <sk-col :size="3">
                            <sk-text-input :bind="queryDs" name="itemModel" label="商品货号"></sk-text-input>
                        </sk-col>
                    </sk-row>
                </sk-form>

                <div class="query-result">
                    <sk-table ref="table" :bind="itemListDs" selectable showCheckbox >
                        <div slot="buttons">
                            <sk-button @click="query()" label="搜索" ></sk-button>
                            <sk-button :bind="queryDs" action="reset" label="清空" ></sk-button>
                            <sk-button @click="onConfirm" primary label="确定"></sk-button>
                        </div>
                        <div slot="row">
                            <sk-column :formatter="renderImg" name="headPicUrl" title="缩略图"></sk-column>
                            <sk-column name="itemName" title="商品名称"></sk-column>
                            <sk-column name="itemModel" title=品牌名></sk-column>
                            <sk-column name="brandName" title=分类></sk-column>
                            <sk-column name="storeName" title=门店名></sk-column>
                        </div>
                    </sk-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import Vue from "vue";
    import selectItem from "@/lib/dataModules/selectItem"
    import itemService from "@/lib/dataModules/item"

    export default {
        data(){
            return {
                queryDs: null,
                brandDs: null,
                storeDs: null,
                catalogDs: null,
                itemListDs: null,

                ifShow: false, //是否显示窗口
                brandId: "",
                errorText: "",

                serviceList: selectItem
            };
        },

        props: {
        },

        created(){
        },

        watch: {
        },

        computed: {
        },

        methods: {
            hide(){
                this.ifShow = false;
            },

            show(){
                this.ifShow = true;
            },

            renderImg(v){
                return '<img style="max-width: 80%;" src=\'' + v.pic_content + "'>" ;
            },

            onClickContainer(e){
                if (e.target.className.indexOf("lov-container") > -1){
                    this.hide();
                }
            },

            query(){
                if (this.brandId){
                    this.itemListDs.query();
                }else{
                    this.errorText = "品牌必须选择的哦";
                }
            },

            onChangeBrandId(v){
                this.errorText = !!v ? "" : "品牌必须选择的哦";
            },

            onConfirm(){
                this.$emit("onReturn", this.$refs.table.getSelectData());
                this.hide();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lov-container{
    }
    .lov-content{
        padding: 30px;
        border: 1px solid #eee;
        min-height: 750px;
    }
</style>
