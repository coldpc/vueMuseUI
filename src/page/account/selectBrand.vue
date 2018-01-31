<template>
    <div class="main-container" data-o-account-select="select">
        <sk-data-set v-model="brandDs" :query-service="account.selectBrand" :auto-query="true" @load="onLoadBrands"></sk-data-set>
        <div class="main-content">
            <div class="img-con">
                <img src="../../assets/top2.png" alt="">
            </div>
            <div class="form-con">
                <sk-row>
                    <sk-col width="75">
                        <!--<mu-auto-complete hintText="请随便输入点啥" labelFloat label="full width" fullWidth @input="handleInput" :dataSource="dataSource"/>-->
                        <div @key.enter="login">
                            <sk-suggest :hint-text="this.$t('pleaseSelect')" v-model="brand" :max-height="400" :option-bind="brandDs" display-field="brandName" value-field="brandGlobalId"></sk-suggest>
                        </div>
                    </sk-col>
                    <sk-col width="25">
                        <sk-button @click="login" :label="$t('ok')"></sk-button>
                    </sk-col>
                </sk-row>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    
    import account from "@/lib/dataModules/account"
    import Suggest from "@/components/skirt/Suggest"
    
    export default{
        components: {
            "sk-suggest": Suggest
        },
        
        data(){
            return {
                brand: "",
                brandDs: null,
                brandInfoDs: null,
                account
            };
        },
        
        methods: {
            onLoadBrands(records){
                if (records.length <= 1){
                    this.brand = records[0].getValue("brandGlobalId");
                    this.login();
                }else{
                    this.$el.querySelector(".mu-text-field-input").focus();
                }
            },
            
            login(){
                if (!this.brand){
                    return;
                }
                this.account.adminLogin.execute({
                    data: {
                        brandGlobalId: this.brand
                    },
                    mask: {},
                    success: this.onLoginSuccess,
                    failed: this.onLoginSuccess
                });
            },
    
            onLoginSuccess(){
                this.$store.dispatch("login");
                this.$router.replace({
                    name: "home"
                });
            }
        },
        
        created(){}
    }
</script>

<style lang="scss">
    .mu-popover .mu-menu-destop .mu-menu-item{
        padding: 0 10px;
    }
    .main-container[data-o-account-select] {
        .mu-text-field-content {
            background: #fff;
            padding: 0px;
            border-radius: 2px;
            text-indent: 10px;
            height: 36px;
            line-height: 61px;
        }
        .mu-raised-button-label{
            color: #333;
        }
        .mu-select-field .mu-dropDown-menu {
            height: 36px;
        }
        .mu-dropDown-menu-text-overflow{
            line-height: 36px;
        }
        .mu-text-field-input{
            text-indent: 10px;
            height: 34px;
        }
    }
</style>

<style lang="scss" scoped>
    .main-container{
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: rgb(33, 33, 33);
    }
    .main-content{
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .img-con{
        text-align: center;
    }
    .form-con{
        width: 400px;
        margin-top: 40px;
    }
</style>