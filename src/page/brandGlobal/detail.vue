<template>
    <div class="main-container">
        <sk-data-set v-model="queryDs" :data-source="brandInfo"
                     auto-query></sk-data-set>
    
        <sk-data-set auto-query @load="onLoadGradeInfoDs" :query-service="baseData.getAccountGrade"></sk-data-set>
        
        <sk-fold :title="$t('baseInfo')">
            <sk-form :bind="queryDs">
                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :label="$t('brandName')" :bind="queryDs" name="brandName"
                                       readonly></sk-text-input>
                    </sk-col>
                    
                    <sk-col :size="3">
                        <sk-text-input value="" :label="$t('chineseName')" :bind="queryDs" name="brandCname"
                                       readonly></sk-text-input>
                    </sk-col>
                    
                    <sk-col :size="3">
                        <sk-text-input value="" :label="$t('brandEmail')" :bind="queryDs" name="email" :readonly="!hasBrand"
                                       required></sk-text-input>
                    </sk-col>
                </sk-row>
                
                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :label="$t('contact')" :bind="queryDs" name="contact"
                                       required :readonly="!hasBrand"></sk-text-input>
                    </sk-col>
                    
                    <sk-col :size="1.5">
                        <sk-text-input value="" :label="$t('phoneNumber')" :bind="queryDs" name="tel"
                                       required :readonly="!hasBrand"></sk-text-input>
                    </sk-col>
                </sk-row>
    
                <sk-row>
                    <sk-col :size="1">
                        <sk-text-input value="" :label="$t('介绍文案')" :bind="queryDs" name="descDocu"
                                       required :readonly="!hasBrand"></sk-text-input>
                    </sk-col>
                </sk-row>
                
                <sk-row>
                    <sk-col :size="1">
                        <!--头图-->
                        <sk-attach required :label="$t('头图')"
                                   :readonly="!hasBrand" :file-size-limit="2" name="headAssignId" ref="headAssignAtta" @assign-id-updated="uploadSuccessPic" attachType="IMG" source="USER" :max-files="1" :row-num="2"
                        ></sk-attach>
                    </sk-col>
    
                    <sk-col :size="1">
                        <sk-attach required :label="$t('logo')"
                                   :readonly="!hasBrand" :file-size-limit="2" name="picAssignId" ref="headAtta" @assign-id-updated="uploadSuccessPic" attachType="IMG" source="USER" :max-files="1" :row-num="2"
                        ></sk-attach>
                    </sk-col>
                    
                    <sk-col :size="1">
                        <sk-attach required :label="$t('detailedPictures')" ref="bodyAtta"
                                   :readonly="!hasBrand" name="bodyAssignId" @assign-id-updated="uploadSuccessBody" attachType="IMG" source="USER" :max-files="1" :row-num="2" :file-size-limit="2"
                        ></sk-attach>
                    </sk-col>
                    
                    <sk-col :size="1">
                        <!--主营业务图-->
                        <sk-attach required :label="$t('主营业务图')" ref="mainBusinessAtta"
                                   :readonly="!hasBrand" name="mainBusinessAssignId" @assign-id-updated="uploadSuccessBody" attachType="IMG" source="USER" :max-files="1" :row-num="2" :file-size-limit="2"
                        ></sk-attach>
                    </sk-col>
                    
                    <sk-col :size="1">
                        <sk-attach
                                :readonly="!hasBrand"
                                @upload-failed="uploadFailed"
                                @assign-id-updated="uploadSuccess"
                                @no-file-change="uploadSuccess"
                                attach-type="VIDEO"
                                source="USER"
                                ref="videoPicAttach"
                                :height="200"
                                :width="350"
                                :max-files="1"
                                :row-num="2"
                                :label="$t('video')"
                                :remark="$t('itemVideoRemark', {size: '50'})"
                                name="bodyVideoAssignId"
                                accept="video/mp4"
                                :file-size-limit="50"></sk-attach>
                    </sk-col>
                    
                </sk-row>
                
                <sk-fixed-bottom v-show="hasBrand">
                    <sk-col>
                        <sk-button :label="$t('modifyAndSubmit')" action="commit" primary
                                   @click="saveImg"></sk-button>
                        <sk-button :label="$t('cancel')" action="cancel"></sk-button>
                    </sk-col>
                </sk-fixed-bottom>
            
            </sk-form>
        </sk-fold>
    </div>
</template>

<script>
    import brandGlobal from "@/lib/dataModules/brandGlobal"
    import baseData from "@/lib/dataModules/baseData"
    import {mapGetters, mapActions} from 'vuex';
    
    const totalAttaNum = 5;
    
    export default{
        data(){
            return {
                queryDs: null,
                brandGlobal: brandGlobal,
                uploadSuccessNum: 0,
                hasBrand: false,
                baseData
            }
        },
        computed: {
            ...mapGetters({
                "brandInfo": "brand/info"
            })
        },
        methods: {
            ...mapActions({
                alter: 'brand/alter'
            }),
    
            onLoadGradeInfoDs(records){
                var data = this.gradeData = records[0].getData();
                this.hasBrand = data.hasBrandGlobal;
            },
            
            uploadSuccessPic(assignId, list){
                this.queryDs.getCurrentRecord().setValue("logo", list[0].src);
                this.uploadSuccess(assignId);
            },
            
            uploadSuccessBody(assignId, list){
                this.queryDs.getCurrentRecord().setValue("bodyAttachList", list);
                this.uploadSuccess(assignId);
            },
            
            uploadSuccess(){
                this.uploadSuccessNum ++;
                if (this.uploadSuccessNum == totalAttaNum){
                    this.submit();
                }
            },
            
            saveImg(){
                this.queryDs.sendVerify();
                let checkResult = this.queryDs.getCurrentRecord().getVerifyResult();
                
                if (!checkResult.ifPassVerify) {
                    this.$store.commit("message", this.$t('enterFull'));
                } else{
                    this.$store.commit("loading", this.$t('inTheSave'));
                    this.uploadAll();
                }
            },
            
            uploadAll(){
                this.uploadSuccessNum = 0;
                
                // 头图
                let temp = this.$refs.headAssignAtta;
                temp.save();
                
                // logo
                temp = this.$refs.headAtta;
                temp.save();
    
                // 主图
                temp = this.$refs.bodyAtta;
                temp.save();
                
                // 主营业务图
                temp = this.$refs.mainBusinessAtta;
                temp.save();
    
                // 视频上传
                temp = this.$refs.videoPicAttach;
                temp.save();
            },
    
            uploadFailed(){
                //头图上传
                this.uploadSuccessNum = 0;
                this.$store.commit("hideLoading");
            },
            
            submit(){
                let data = this.queryDs.getCurrentData();
                data = this.$base.deepCopy(data);
                delete data.bodyAttachList;
                delete data.picAttachList;
                delete data.logo;
                delete data.updateTime;
                
                brandGlobal.saveOrUpdate.execute({
                    data: data,
                    mask: {info: this.$t('inTheSave')},
                    success: function () {
                        this.$store.commit("message", this.$t('succeedSave'));
                        this.alter(this.$base.deepCopy(this.queryDs.getCurrentData()));
                    }.bind(this)
                })
            }
        }
    }
</script>