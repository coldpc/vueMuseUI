<template>
    <div>
        <sk-data-set v-model="queryDs" auto-create></sk-data-set>
        
        <sk-data-set v-model="vendorCountriesDs" :query-service="baseData.vendorCountries" auto-query></sk-data-set>
        <sk-data-set v-model="storeDs" :bind="queryDs" bind-field="countryId" :query-service="baseData.getStoreByCountry"></sk-data-set>
        
        <sk-date-picker value="2017-04-05" @change="changDate" :bind="queryDs" name="startDate" label="test"></sk-date-picker>
        <sk-date-picker @change="changDate" bind-min-date="startDate" value="" :bind="queryDs" name="endDate" label="test"></sk-date-picker>
    
        <sk-select value="119000" @change="changDate" hint-text="选择国家" label="国家" :bind="queryDs" name="countryId" :option-bind="vendorCountriesDs" display-field="countryName" value-field="countryId"></sk-select>
        <sk-select  @change="changDate" value="102000" hint-text="选择门店" label="商店" :bind="queryDs" name="storeId" :option-bind="storeDs" display-field="storeName" value-field="storeId"></sk-select>
    
        <!--<sk-time-picker value="09:22" @change="changDate" hintText="startTime" :bind="queryDs" name="startTime" label="startTime"></sk-time-picker>-->
        <!--<sk-time-picker @change="changDate" bind-min-time="startTime" hintText="endTime" :bind="queryDs" name="endTime" label="endTime"></sk-time-picker>-->
        
        <sk-form :bind="queryDs">
            <sk-time-picker @change="changDate" hintText="endTime" name="endTime" label="endTime"></sk-time-picker>
        </sk-form>
    </div>
</template>

<script type="text/javascript">
    import Vue from "vue"
    import DataSet from "@/components/skirt/DataSet"
    import baseData from "@/lib/dataModules/baseData"
    import DatePicker from "@/components/skirt/DatePicker"
    import Select from "@/components/skirt/Select"
    import TimePicker from "@/components/skirt/TimePicker"
    import Form from "@/components/skirt/Form"
    
    Vue.component(DataSet.name, DataSet);
    Vue.component(DatePicker.name, DatePicker);
    Vue.component(Select.name, Select);
    Vue.component(TimePicker.name, TimePicker);
    Vue.component(Form.name, Form);
    
    export default{
        data(){
            window.test = this;
            
            return {
                queryDs: null,
                vendorCountriesDs: null,
                storeDs: null,
                baseData: baseData
            }
        },
        
        computed: {
            
        },
        
        methods: {
            changDate(v){
                console.log(v);
            }
        },
        
        watch: {
            
        }
    }
</script>