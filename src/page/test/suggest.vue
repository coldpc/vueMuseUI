<template>
  <div>
    <div>{{currentData.startDate}}</div>
    <input type="text" v-model="currentData.myname">
    <sk-suggest  @change="changDate" value="aaaaaaaaaa" :bind="queryDs" name="storeId" :option-bind="vendorCountries" display-field="countryName" value-field="countryId"></sk-suggest>
  </div>
</template>

<script type="text/javascript">
  import Vue from "vue"
  import DataSet from "@/lib/utils/DataSet"
  import baseData from "@/lib/dataModules/baseData"
  import Suggest from "@/components/skirt/Suggest"

  Vue.component(Suggest.name, Suggest);


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
      changDate(v){
        console.log("date", v);
      }
    }
  }
</script>
