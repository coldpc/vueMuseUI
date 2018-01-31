<template>

    <mu-checkbox
      class="demo-checkbox"
      :name="name"
      :nativeValue="nativeValue"
      :label="label"
      v-model="result"
      :labelLeft="labelLeft"
    />
</template>

<script type="text/javascript">
  import DataSet from "@/lib/utils//DataSet"
  import Record from "@/lib/utils/Record"
  import SK from "./SK";

    export default {
        name: "sk-mu-checkbox",
        extends: SK,
        data(){
          return {
            result: [],
            records: null
          }
        },

        created(){

            if (this.readOnly){
                this.setReadOnly(true);
            }
        },

        watch: {
        },

        methods: {

        },

        props: {

          optionBind: {

          },

          valueField: {
            type: String
          },

          defineValue: {
            type: String
          },

          displayField: {
            type: String
          },

          option: {
            type: Array
          },

          model: {
            type: String
          },

          //相当于 input[type=checkbox] 元素的 name 属性
          name: {
            type: String
          },

          //相当于 input[type=checkbox] 元素的 value 属性
          nativeValue:{
            type: String
          },

          //标签文字是否在左边，默认在右边
          labelLeft:{
            type: Boolean
          },

          label: {
              type: String
          },

          value:{

          },

          //只读
          readOnly: {
            type: Boolean,
            default: false
          }

        }
    }
</script>

<style>
  .mu-checkbox-icon {
      margin: 0;
  }
  .mu-checkbox {
    margin-right: 6px;
  }
</style>
