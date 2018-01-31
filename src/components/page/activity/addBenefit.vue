<template>
    <sk-win :title="$t('优惠设置')" ref="win" width="70%" @onHide="onHideWin">
        <div class="main-container">
            <div class="service">
                <sk-data-set v-model="saveActivityBenefitDs" auto-create></sk-data-set>
                
                <!-- 优惠类型 -->
                <sk-data-set v-model="benefitTypeDs" :query-service="enumServiceModule.getBenefitType" auto-query></sk-data-set>
                
                <!--根据优惠类型的参数-->
                <sk-data-set v-model="benefitArgsDs" :parse-data="ctrlBenefitArgs" :query-service="activityServiceModule.getBenefitArgProperties" :bind="saveActivityBenefitDs" bind-field="benefitType"></sk-data-set>
            </div>
            
            <sk-fold :title="$t('activityBaseInfo')">
                <sk-form class="activity-form" :bind="saveActivityBenefitDs">
                    <sk-row>
                        <sk-col :size="3">
                            <sk-select
                                    :label="$t('activityType')"
                                    name="benefitType"
                                    :option-bind="benefitTypeDs"
                                    display-field="desc"
                                    value-field="code"
                                    required
                            ></sk-select>
                        </sk-col>
                        
                        <sk-col :size="3">
                            <sk-text-input :hint-text="$t('activityName')" :label="$t('activityName')" name="mappingName" required ></sk-text-input>
                        </sk-col>
                        
                        <sk-col :size="3">
                            <sk-text-input :hint-text="$t('activityEnName')" :label="$t('activityEnName')" name="enMappingName" required ></sk-text-input>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row>
                        <sk-col :size="3">
                            <sk-text-input type="number" :hint-text="$t('benefitLevel')" :label="$t('benefitLevel')" name="weight" required ></sk-text-input>
                        </sk-col>
                        <sk-col :size="3">
                            <sk-text-input :hint-text="$t('activityBenefitDesc')" :label="$t('activityBenefitDesc')" name="description" required ></sk-text-input>
                        </sk-col>
                        <sk-col :size="3">
                            <h5 class="sub-title" v-html="$t('activityIsDisplay')" style="padding: 0px;margin: 0px;line-height: 40px;color: #333;font-size: 12px;font-weight: normal;"></h5>
                            <sk-radio name="status" :label="$t('enable')" nativeValue="ENABLE"></sk-radio>
                            <sk-radio name="status" :label="$t('disabled')" nativeValue="DISABLE"></sk-radio>
                        </sk-col>
                    </sk-row>
                </sk-form>
            </sk-fold>
            
            <sk-fold :title="$t('benefitSet')">
                <div style="margin-top: 10px;max-height: 260px;overflow-y: auto;">
                    <sk-table :bind="benefitArgsDs" ref="benefitsListTable">
                        <div slot="row">
                            <sk-column name="benefitArgName" align="center" :title="$t('benefitParaName')"></sk-column>
                            <sk-column name="benefitArgDesc" align="center" :title="$t('benefitParaDesc')"></sk-column>
                            <sk-column name="benefitArgValue" type="number" required editable :title="$t('benefitParaValue')"></sk-column>
                        </div>
                    </sk-table>
                </div>
            </sk-fold>
            
            <div style="padding-top: 50px;text-align: center;">
                <sk-button :label="$t('save')" primary @click="save"></sk-button>
            </div>
        </div>
    </sk-win>
</template>

<script>
    import enumServiceModule from "@/lib/dataModules/enum"
    import activityServiceModule from "@/lib/dataModules/activity"
    import ArrayApi from "@/lib/utils/ArrayApi"
    
    export default{
        data(){
            window.benefit = this;
            return {
                enumServiceModule,
                activityServiceModule,
                
                benefitTypeDs: null,
                benefitArgsDs: null,
                saveActivityBenefitDs: null,
                
                activityId: "",
                queryPara: null,
    
                editBenefit: null,
                activityData: null,
                activityBenefitMappings: null
            }
        },
        methods: {
            onHideWin(){
                this.saveActivityBenefitDs.clearCurrent();
                this.benefitArgsDs.setData([]);
            },
            
            show: function (activityData, activityBenefitMappings, editBenefit) {
                editBenefit = editBenefit || {};
                this.activityBenefitMappings = activityBenefitMappings;
                this.activityData = activityData;
                this.editBenefit = editBenefit;
                
                this.saveActivityBenefitDs.setData(editBenefit);
                this.benefitArgsDs.setData([]);
                this.$refs.win.show();
            },
            
            hide() {
                this.$refs.win.hide();
            },

            save() {
                let data = this.getSaveData();
                if (data){
                    activityServiceModule.saveActivityBenefitMappings.execute({
                        data: data,
                        success: () => {
                            this.hide();
                            this.$store.commit("message", this.$t('succeedSave'));
                            this.$emit("updated");
                        }
                    })
                }
            },
    
            // 处理加载的参数配置
            ctrlBenefitArgs: function (data) {
                let activityBenefitArgs = this.editBenefit.activityBenefitArgs || [];
                let findArg, arg, key = "benefitArgName", valueField = "benefitArgValue";
                for (let i = 0, l = data.length; i < l; i++ ) {
                    arg = data[i];
                    findArg = ArrayApi.getDataByAttr(activityBenefitArgs, key, arg[key]);
                    if (!!findArg && findArg.length > 0){
                        findArg = findArg[0];
                        arg[valueField] = findArg[valueField] || "";
                    }
                }
                return data;
            },
    
            getEditBenefitData: function () {
                let data = this.$base.deepCopy(this.saveActivityBenefitDs.getCurrentData());
                data.activityBenefitArgs = this.benefitArgsDs.getAllData();
                return data;
            },
            
            findCurrentBenefitIndex: function (activityBenefitMappings, activityBenefitId) {
                let index = -1; // 查找位置
                if (activityBenefitId) {
                    let benefit;
                    for (let i = 0; i < activityBenefitMappings.length; i++) {
                        benefit = activityBenefitMappings[i];
                        if (activityBenefitId == benefit.activityBenefitId) {
                            index = i;
                            break;
                        }
                    }
                }
                return index;
            },
            
            getSaveData: function () {
                // 先看看是否有activityBenefit
                let currentBenefit = this.getEditBenefitData(),
                    validation = true;

                currentBenefit.activityBenefitArgs.forEach((item) => {
                    if (!item.benefitArgValue){
                        return validation = false;
                    }
                });

                if (!currentBenefit.benefitType){
                    this.$store.commit('message', this.$t('isSelectedActiveType'));
                    return false;
                }else if (!currentBenefit.mappingName){
                    this.$store.commit('message', this.$t('isSelectedActiveName'));
                    return false;
                }else if (!currentBenefit.enMappingName){
                    this.$store.commit('message', this.$t('isSelectedActiveEnName'));
                    return false;
                }else if (!currentBenefit.weight){
                    this.$store.commit('message', this.$t('isSelectedActiveRank'));
                    return false;
                }else if (!validation){
                    this.$store.commit('message', this.$t('isSelectedActiveInfo'));
                    return false;
                }

                let activityBenefitMappings = this.activityBenefitMappings || [];
                let activityData = this.activityData;
                // activityBenefitMappings //maintain 传递过来的数据
                // currentBenefit 编辑好的数据
                activityBenefitMappings.forEach((benefit,index1) => {
                    if (benefit.activityBenefitArgs){
                        benefit.activityBenefitArgs.forEach((arg, index2) => {
                            if (arg.argId && currentBenefit.activityBenefitArgs[index2] && (index1 === index2) && (currentBenefit.activityBenefitId === arg.activityBenefitId)){
                                currentBenefit.activityBenefitArgs[index2].argId = arg.argId;
                            }
                        });
                    }
                });

                // 判断是否有activityBenefitId
                let index = this.findCurrentBenefitIndex(activityBenefitMappings, currentBenefit.activityBenefitId);
                if (index != -1){
                    activityBenefitMappings.splice(index, 1, currentBenefit);
                }else {
                    activityBenefitMappings.push(currentBenefit);
                }
    
                activityData.activityBenefitMappings = activityBenefitMappings;
                return activityData;
            }
        },
        
        created(){
        
        },
        
        watch: {},
        
        computed: {
        
        },
        
        mounted(){}
    }
</script>

<style>
    .mu-radio-wrapper .mu-radio-label{
        font-size: 12px;
    }
</style>
