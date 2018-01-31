<template>
    <div class="sku-detail">
        <sk-win :title="$t('skuDetail')" ref="modal" :scrollable="true" height="100%">
            <div class="modal-wrapper">
                <div class="skuRow">
                    <sk-row class="sku-info">
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="this.$t('countryArea')"></span>
                                <span>{{ countryName }}</span>
                            </div>
                        </sk-col>
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="this.$t('Currency')"></span>
                                <span>{{ unit }}</span>
                            </div>
                        </sk-col>
                    </sk-row>
                    <sk-row class="sku-info">
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="this.$t('activityStoreEventName')"></span>
                                <span>{{ activityName }}</span>
                            </div>
                        </sk-col>
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="this.$t('itemPrice')"></span>
                                <span>{{ skuPrice | formatMoney}}</span>
                            </div>
                        </sk-col>
                    </sk-row>
                    <sk-row class="sku-info">
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="$t('productName')"></span>
                                <span>{{ itemName }}</span>
                            </div>
                        </sk-col>
                        <sk-col :size="2">
                            <div class="info-con">
                                <span v-html="$t('productCode')"></span>
                                <span>{{ skuModel }}</span>
                            </div>
                        </sk-col>
                    </sk-row>
                </div>

                <sk-table :bind="ds">
                    <div slot="row">
                        <sk-column name="skuName" :title="$t('SizeColor')" align="center"></sk-column>
                        <sk-column name="skuPrice" view-type="money" :title="$t('price')" align="center"></sk-column>
                        <sk-column name="headAttachList" view-type="img" :title="$t('thImg')" align="center"></sk-column>
                    </div>
                </sk-table>

            </div>
        </sk-win>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import activity from "@/lib/dataModules/activity"

    export default {
        name: 'sk-sku',
        data(){
            return {
                ds: new DataSet({
                    queryService: activity.getSkusByItemId,
                    autoQuery: false
                }),
                itemId: "",
                dataList: null,
                oldItemId: "none",
                unit: "",
                skuPrice: "",
                skuName: "",
                skuModel: "",
                itemName: ""

            }
        },
        props: {
            countryName:{
                type: String
            },
            activityName:{
                type: String
            }
        },
        methods: {
            renderImg(v){
                if ( !!v ){
                    let url = v[0].path;
                    return "<img src='"+ url +"' style='width: 25%' />";
                }else {
                    return "未找到图片";
                }
            },

            show(itemId, name){
                let ds = this.ds;
                if (this.oldItemId != itemId){
                    ds.query({
                        itemId: itemId
                    });
                    this.oldItemId = itemId;
                }
                this.$refs.modal.show();
                this.itemName = name;
            },

            hide(){
                this.$refs.modal.hide();
            }
        },
        created(){
            let ds = this.ds;
            ds.addEventListener(ds.event.load, function ( records,ds ){
                this.dataList = records[0].data;
                this.unit = this.dataList.unit;
                this.skuPrice = this.dataList.skuPrice;
                this.skuName = this.dataList.skuName;
                this.skuModel = this.dataList.skuModel;

            }.bind(this));
        },
        filters:{
            formatMoney(value){
                value = value || "";
                let v = parseFloat(value);
                if (!v && v !== 0){
                    return value;
                }
                var n = 2;
                v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = v.split(".")[0].split("").reverse(), r = v.split(".")[1],
                        t = "";
                for (var i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return t.split("").reverse().join("") + "." + r;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .info-con {
        line-height: 2;
        display: table;
    }
    .info-con span:first-child {
        font-weight: 700;
        width: 80px;
        margin-left: 10px;
        display: table-cell;
    }
</style>
