<template>
    <sk-win ref="win" :title="$t('addStoreProduct')" :small-title="specName" width="800px" height="800px">
        <sk-data-set v-model="storeItemInfo" :auto-query="false" :query-service="store.getItems" page-size="10"
                     :parse-query-para="storeInfoParams" pagination></sk-data-set>

        <sk-fold :title="$t('product')">
            <sk-row>
                <sk-col :size="1">
                    <sk-button :label="$t('submit')" primary @click="addItems"></sk-button>
                </sk-col>
            </sk-row>

            <sk-table :bind="storeItemInfo" ref="storeItemTable" selectable showCheckbox>
                <div slot="row">
                    <sk-column viewType="img" name="headAttacheList" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column :formatter="forName" @cell-click="goItem" name="itemName" :title="$t('productName')"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
                    <sk-column :formatter="forCatalog" name="catalogMappingList" :title="$t('productCategory')"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="storePrice" :title="$t('productPrice')" view-type="money" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
    </sk-win>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import store from "@/lib/dataModules/store";

    export default {
        data(){
            window.selectStoreItem = this;

            return {
                store,
                storeId : null,
                hasLoadData: false
            };
        },

        created(){
        },

        methods: {
            show(storeId){
                this.storeId = storeId;
                this.storeItemInfo.query();
                this.$refs.win.show();
            },

            hide(){
                this.$refs.win.hide();
            },


            forName(v, index, record){
                return "<a class='goItem' itemId='"+ record.getValue("itemId") +"' title=''>"+ v +"</a>"
            },

            //去商品sku
            goItem(e, v, name, index, record){
                this.$router.push({name: "page.item.maintain", query: {type:"detail",itemId: record.getValue("itemId")}});
            },

            addItems() {
                let selectedItem = this.$refs.storeItemTable.getSelectData();
                if (selectedItem.length === 0) {
                    this.$store.commit('message', this.$t('noItemTrip'));
                    return;
                }
                let itemsId = [];
                selectedItem.forEach((item) => {
                    itemsId.push(item.itemId);
                });
                itemsId = itemsId.join(',');
                store.addStoreItem.execute({
                    data: {
                        storeId: this.storeId,
                        linkBizIds: itemsId
                    },
                    success: (res) => {
                        this.hide();
                        this.$store.commit("message", this.$t("orderPassed"));
                        this.$emit("addItemSuccess")
                    }
                })
            },

            storeInfoParams() {
                return {storeId: this.$route.query.storeId}
            }
        }
    }
</script>


<style scope>

</style>