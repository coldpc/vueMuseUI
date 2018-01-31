<template>
    <div>
        <sk-data-set ref="table" v-model="queryDs" auto-create></sk-data-set>
        
        <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.vendorCountries" auto-query></sk-data-set>
        <sk-data-set v-model="storeDs" :bind="queryDs" bind-field="countryId" :query-service="baseData.getStoreByCountry"></sk-data-set>
        <sk-data-set v-model="itemListDs" :query-bind="queryDs" auto-query pagination page-size="20" :query-service="item.getItems"></sk-data-set>
        
        <sk-form :bind="queryDs">
            <div>
                <div>
                    <sk-text-input name="name" value="aasdf"></sk-text-input>
                </div>
                <div>
                    <sk-date-picker value="2017/04/05" @change="changDate" name="startDate" label="test"></sk-date-picker>
                </div>
            </div>
            <sk-date-picker @change="changDate" bind-min-date="startDate" value="" name="endDate" label="test"></sk-date-picker>
            
            <sk-select value="119000" @change="changDate" hint-text="选择国家" label="国家" name="countryId" :option-bind="vendorCountriesDs" display-field="countryName" value-field="countryId"></sk-select>
            <!---->
            <sk-time-picker value="09:22" @change="changDate" hintText="startTime" name="startTime" label="startTime"></sk-time-picker>
            
            <sk-time-picker @change="changDate" bind-min-time="startTime" hintText="endTime" name="endTime" label="endTime"></sk-time-picker>
        </sk-form>
        
        <sk-table :bind="itemListDs" selectable showCheckbox>
            <div slot="buttons">
                <sk-button label="保存"></sk-button>
            </div>
            <div slot="row">
                <sk-column editable name="sort" title="排序"></sk-column>
                <sk-column :formatter="renderName" name="itemName" title="商品名字"></sk-column>
                <sk-column :if-hide="ifHide" name="itemId" title="id"></sk-column>
                <sk-column name="updateTime" editable edit-type="date-picker" title=更新时间></sk-column>
                <sk-column name="storeId" editable edit-type="select" :option-bind="storeDs" display-field="storeName" value-field="storeId" title=创建时间></sk-column>
            </div>
        </sk-table>
    </div>
</template>

<script type="text/javascript">
    import baseData from "@/lib/dataModules/baseData"
    import item from "@/lib/dataModules/item"
    
    export default{
        data(){
            window.test = this;
            console.log("page");
            return {
                name: "aaa",
                ifHide: true,
                queryDs: null,
                vendorCountriesDs: null,
                storeDs: null,
                itemListDs: null,
                baseData: baseData,
                item: item
            }
        },
        
        beforeCreate(){
            console.log("11");
        },
        
        computed: {
            
        },
        
        methods: {
            changDate(v){
                
            },
            
            renderName(v){
                return this.name + v;
            }
            
        },
        
        watch: {
            
        }
    }
</script>