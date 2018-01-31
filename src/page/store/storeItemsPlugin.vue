<template>
    <div class="main-container">
        <sk-data-set v-model="queryDs" :query-service="store.storeListItem" :query-para="{storeId: this.storeId}" :parse-data="parseLoadData" auto-query></sk-data-set>

        <sk-fold :title="this.$t('product')">
            <sk-row>
                <sk-col :size="1">
                    <sk-button :label="$t('activityAddProduct')" primary @click="addItems"></sk-button>
                    <sk-button :label="$t('saveSort')" primary @click="saveSort"></sk-button>
                </sk-col>
            </sk-row>

            <sk-table :bind="queryDs" ref="storeItemTable">
                <div slot="row">
                    <sk-column viewType="img" name="headAttacheList" :title="$t('thImg')" align="center"></sk-column>
                    <sk-column :formatter="forName" @cell-click="goItem" name="itemName" :title="$t('productName')"></sk-column>
                    <sk-column name="itemModel" :title="$t('productCode')"></sk-column>
                    <sk-column name="store" :formatter="forCountry" :title="$t('country')"></sk-column>
                    <sk-column name="store" :formatter="forCity" :title="$t('city')"></sk-column>
                    <sk-column name="store" :formatter="forStoreName" :title="$t('store')"></sk-column>
                    <sk-column name="catalogMappingList" :title="$t('productCategory')"></sk-column>
                    <sk-column name="unit" :title="$t('currency')" align="center"></sk-column>
                    <sk-column name="storePrice" :title="$t('productPrice')" view-type="money" align="center"></sk-column>
                    <sk-column name="storeListItemConfigIdSort" type="text" editable :title="$t('sort')" align="center"></sk-column>
                    <sk-column name="activityBenefitId" :title="$t('operation')"  align="center" :formatter="forOperate" @cell-click="onClickOperationCell"></sk-column>
                </div>
            </sk-table>
        </sk-fold>

        <sk-select-store-items ref="selectItem" @addItemSuccess="addItemSuccess"></sk-select-store-items>

    </div>

</template>

<script>
    import baseData from "@/lib/dataModules/baseData";
    import store from "@/lib/dataModules/store";
    import SelectStoreItems from "../../components/page/store/selectStoreItem.vue"

    export default {
        components: {
            "sk-select-store-items": SelectStoreItems
        },
        data() {
            return {
                store,
                queryDs: null,
                storeId: this.$route.query.storeId
            }
        },
        methods: {
            parseLoadData(data) {
                let newData = [];
                data.items.forEach((item) => {
                    item.item.storeListItemConfigId = item.storeListItemConfigId;
                    item.item.storeListItemConfigIdSort = item.sort;
                    newData.push(item.item);
                });
                return newData;
            },

            forName(v, index, record){
                return "<a class='goItem' itemId='"+ record.getValue("itemId") +"' title=''>"+ v +"</a>"
            },

            forCountry(v) {
                return v.city.countryName;
            },

            forCity(v) {
                return v.city.cityName;
            },

            forStoreName(v) {
                return v.storeName;
            },

            //去商品sku
            goItem(e, v, name, index, record){
//                this.$router.push({name: "page.item.maintain", query: {type:"detail",itemId: record.getValue("itemId")}});
                this.$store.dispatch('router/push', {
                    name: "page.item.maintain",
                    title: '商品详情',
                    query: {type:"detail",itemId: record.getValue("itemId")}
                });
            },

            addItems() {
                this.$refs.selectItem.show(this.storeId);
            },

            addItemSuccess() {
                this.queryDs.query();
            },

            saveSort() {
                let items = this.queryDs.getAllData(),
                    submitSortData = [];
                items.forEach((item) => {
                    submitSortData.push({storeListItemConfigId: item.storeListItemConfigId, sort: item.storeListItemConfigIdSort});
                });

                store.sortItem.execute({
                    data: JSON.stringify(submitSortData),
                    success: () => {
                        this.$store.commit("message", this.$t("orderPassed"));
                        this.queryDs.query();
                    }
                })

            },


            deleteItem(record) {
                this.$store.commit("confirm", {
                    message: this.$t('DeleteNow'),
                    ok: function () {
                        let storeListItemConfigId = record.data.storeListItemConfigId;
                        store.deleteStoreItem.execute({
                            data: {
                                store: this.storeId,
                                storeListItemConfigId: storeListItemConfigId
                            },
                            success: () => {
                                this.$store.commit("message", this.$t("orderPassed"));
                                this.queryDs.query();
                            }
                        })
                    }.bind(this)
                });
            },

            onClickOperationCell(e, value, name, index, record) {
                let actionType = e.target.className;
                switch (actionType) {
                    case "delete":
                        this.deleteItem(record);
                        break;
                }
            },

            forOperate(v){
                return "<a class='delete'>"+ this.$t('delete') +"</a>"
            },
        }
    }
</script>

<style scoped>

</style>