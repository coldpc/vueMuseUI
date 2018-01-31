<template>
    <mu-radio
            class="demo-radio"
            :name="name"
            :nativeValue="nativeValue"
            :label="label"
            v-model="result"
            :labelLeft="labelLeft"
            :readOnly="readOnly"
    />
</template>

<script type="text/javascript">
  import DataSet from "@/lib/utils//DataSet"
  import Record from "@/lib/utils/Record"
  import SK from "./SK";

  export default {
    name: "sk-radio",
    extends: SK,
    data(){
      return {
        disabled: false,
      }
    },

    created(){

      if (this.readOnly){
        this.setReadOnly(true);
      }
    },

    methods: {

      setReadOnly(ifReadOnly){
        this.disabled = ifReadOnly;
      }

    },

    props: {

        //相当于 input[type=radio] 元素的 value 属性
        nativeValue: {
            type: String
        },

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

        //输入框的标签

        labelLeft:{
            type: Boolean,
            default: false
        },

        //只读
        readOnly: {
            type: Boolean,
            default: false
        }

    }
  }
</script>

<style lang="scss">
    .mu-radio {
        margin-right: 20px;
    }
    .mu-radio-wrapper .mu-radio-icon {
        margin-right: 6px !important;
    }
</style>
