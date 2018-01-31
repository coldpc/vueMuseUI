<template>
  <div>
    <sk-mu-checkbox name="country" :bind="queryDs" :option-bind="vendorCountries" display-field="countryName" defineValue="Home" value-field="countryId" @change="changeBox" value="120000"></sk-mu-checkbox>
    <sk-radio name="place" value="France" :bind="queryDs" @change="changeRadio" :option-bind="vendorCountries" display-field="countryName" value-field="enName"></sk-radio>
    <sk-checkbox name="IsHome" label="送货上门" :bind="queryDs" checkValue="Home" unCheckValue="Express" value=""  @change="changeRadio" nativeValue="Home"></sk-checkbox>
  </div>
</template>

<script type="text/javascript">
  import Vue from "vue"
  import DataSet from "@/lib/utils/DataSet"
  import baseData from "@/lib/dataModules/baseData"
  import Radio from "@/components/skirt/Radio"
  import TextInput from "@/components/skirt/TextInput"
  import CheckBox from "@/components/skirt/CheckBox"
  import MuCheckbox from "@/components/skirt/MuCheckbox"


  Vue.component(Radio.name, Radio);
  Vue.component(TextInput.name, TextInput);
  Vue.component(CheckBox.name, CheckBox);
  Vue.component(MuCheckbox.name, MuCheckbox);

  export default {
    name: "sk-data-set",
    data(){
      var queryDs = window.test = new DataSet({
        vue: this,
        autoCreate: true,
        name: "currentData"
      });

      var vendorCountries = new DataSet({
        queryService: baseData.vendorCountries,
        autoQuery: false
      });

      var vendors =  window.vendors = new DataSet({
        bind: queryDs,
        bindField: "countryId",
        queryService: baseData.getStoreByCountry,
        autoQuery: false
      });

      return {
        queryDs,

        vendorCountries,

        vendors,

        currentData: {}
      }
    },

    created(){
      this.vendorCountries.query();
    },

    methods: {

      changeWords(v){
        console.log(v)
      },

      changeBox(v){
        console.log(v)
      },

      changeRadio(v){
        console.log(v)
      }
    }
  }
</script>

<style>

</style>
