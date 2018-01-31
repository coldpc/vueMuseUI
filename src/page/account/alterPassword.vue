<template>
    <div class="main-container">
        <sk-data-set v-model="queryDs" :query-service="account.selectBrand" :auto-query="false" auto-create></sk-data-set>
        
        <div style="width: 500px;">
            <sk-fold :title="$t('alterPassword')">
                <div>
                    <sk-text-input :bind="queryDs" type="password" required :label="$t('oldPassword')" name="oldPwd" :hint-text="$t('oldPlaceholder')"></sk-text-input>
                </div>
                <div>
                    <sk-text-input :bind="queryDs" type="password" :error="error" :label="$t('enterPassWord')" :hint-text="$t('enterPlaceholder')" name="newPwd" @change="change" @blur="validNewPassword"></sk-text-input>
                </div>
                <div>
                    <sk-text-input :bind="queryDs" type="password" required :error="reError" :label="$t('reEnterPassword')" name="newPwdOk" :hint-text="$t('reEnterPlaceholder')" @change="changeRe" @blur="validReNewPassword"></sk-text-input>
                </div>
                <div>
                    <sk-button primary :label="$t('submit')" @click="submit"></sk-button>
                </div>
            </sk-fold>
        </div>
    </div>
</template>

<script type="text/javascript">
    import account from "@/lib/dataModules/account";
    export default{
        data(){
            
            window.test = this;
            return {
                queryDs: null,
                error: "",
                reError: "",
                account
            };
        },
        
        methods: {
            validNewPassword(e, v){
                if (!v || v.length < 6){
                    this.error = this.$t("minLength");
                }
            },
            
            change(){
                this.error = "";
            },
            
            changeRe(){
                this.reError = "";
            },
            
            validReNewPassword(e, v){
                let newValue = this.queryDs.getCurrentRecord().getValue("newPwd");
                if (v != newValue){
                    this.reError = this.$t("notEqual");
                }
            },
    
            submit(){
                let data = this.queryDs.getCurrentData();
                if (!data.oldPwd || !data.newPwd || !data.newPwdOk || this.error || this.reError){
                    this.$store.commit("message", this.$t('pleaseCompleteInfo'));
                }else{
                    account.changePassword.execute({
                        data: data,
                        success: function () {
                            this.queryDs.clearCurrent();
                            this.$store.commit("message", this.$t('saveSuccess'));
                        }.bind(this)
                    });
                }
            }
        },
        
        created(){}
    }
</script>