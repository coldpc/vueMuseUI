<template>
    <sk-win ref="win" :title="$t('itemTag')" width="600px">

        <sk-data-set v-model="addTagDs" :auto-query="false" auto-create></sk-data-set>
        <sk-data-set v-model="tagListDs" :auto-query="true" :query-service="baseData.getItemTagList" :parse-data="getTagList"></sk-data-set>

        <div class="table-content">
            <sk-row>
                <sk-col :size="1">
                    <sk-select
                            value=""
                            :label="$t('tagType')"
                            name="itemTagType"
                            :bind="addTagDs"
                            :option-bind="tagListDs"
                            display-field="desc"
                            value-field="value"
                            @change="changeTagType"
                            :readonly="TagTypeFlag"
                    ></sk-select>
                </sk-col>
            </sk-row>

            <sk-row>
                <sk-col :size="4">
                    <sk-date-picker name="beginDate" :bind="addTagDs" :option-bind="datePicker" :readonly="editDateFlag"  :hint-text="$t('startDate')"></sk-date-picker>
                </sk-col>
                <sk-col :size="4">
                    <sk-time-picker name="beginTime" :bind="addTagDs" :option-bind="datePicker" :readonly="editDateFlag" :hint-text="$t('startTime')" ></sk-time-picker>
                </sk-col>
                <sk-col :size="4">
                    <sk-date-picker name="endDate" :bind="addTagDs" :option-bind="datePicker" :readonly="editDateFlag" :hint-text="$t('endDate')" bind-min-date="beginDate"></sk-date-picker>
                </sk-col>
                <sk-col :size="4">
                    <sk-time-picker name="endTime" :bind="addTagDs" :option-bind="datePicker" :readonly="editDateFlag" :hint-text="$t('endTime')"></sk-time-picker>
                </sk-col>
            </sk-row>

            <sk-row>
                <sk-col :size="2">
                    <sk-text-input value="" :hint-text="$t('descInChinese')" :label="$t('descInChinese')" :bind="addTagDs" name="description"></sk-text-input>
                </sk-col>
                <sk-col :size="2">
                    <sk-text-input value="" :hint-text="$t('descInEnglish')" :label="$t('descInEnglish')" :bind="addTagDs" name="enDescription"></sk-text-input>
                </sk-col>
            </sk-row>

            <div style="text-align: right;margin-top: 20px;">
                <sk-button :label="$t('cancel')" @click="hide"></sk-button>
                <sk-button primary :label="$t('save')" @click="save"></sk-button>
            </div>
        </div>
    </sk-win>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import baseData from "@/lib/dataModules/baseData"

    export default {
        data(){
            window.addTagW = this;
            return {
                baseData,
                addTagDs: null,
                tagListDs: null,
                tagTypeList: [],
                editDateFlag: false,
                TagTypeFlag: false,

                type: '', // add or edit
                editIndex: null
            };
        },

        created(){
        },

        methods: {

            show(data,type,index){
                this.TagTypeFlag = false;
                let copyData = this.$base.deepCopy(data);
                this.type = type;
                this.editIndex = index;

                if ( type === 'add'){
                    // 新增商品标签
                    this.addTagDs.clearCurrent();
                    this.addTagDs.setData({itemTagType: ''});
                }else {
                    // 编辑商品标签
                    this.TagTypeFlag = true;
                    this.addTagDs.clearCurrent();
                    if (!!copyData.beginDate) {
                        // 这一段代码为了处理时间拼接,解决没有 dateTimePicker
                        let formatBeginDate = new Date(copyData.beginDate),
                            formatEndDate = new Date(copyData.endDate),
                            beginHour = formatBeginDate.getHours() < 10 ? "0" + formatBeginDate.getHours() : formatBeginDate.getHours().toString(),
                            endHour = formatEndDate.getHours() < 10 ? "0" + formatEndDate.getHours() : formatEndDate.getHours().toString(),
                            beginMin = formatBeginDate.getMinutes() < 10 ? "0" + formatBeginDate.getMinutes() : formatBeginDate.getMinutes().toString(),
                            endMin = formatEndDate.getMinutes() < 10 ? "0" + formatEndDate.getMinutes() : formatEndDate.getMinutes().toString();

                        copyData.beginTime = beginHour + ':' + beginMin;
                        copyData.endTime = endHour + ':' + endMin;
                    }
                    this.addTagDs.setData(copyData);
                }
                this.$refs.win.show();
            },

            hide(){
                this.$refs.win.hide();
            },

            changeTagType(value){
                this.tagTypeList.forEach( item => {
                    if (item.code === value){
                        this.editDateFlag = !item.canEditDate;
                        if (!item.canEditDate){
                            let tagDs = this.addTagDs.getAllData()[0];
                            this.addTagDs.setData({beginDate:'',beginTime:'',endDate:'',endTime:'',description: tagDs.description,enDescription: tagDs.enDescription});
                        }
                    }
                })
            },

            getTagList(data){
                this.tagTypeList = this.$base.deepCopy(data);
                return data;
            },

            save(){
                let addTagData = this.addTagDs.getCurrentData(),
                    parentQueryDs = window.test.tagDs.getAllData(),
                    sameTagFlag = false;

                // 提交数据控制
                if (!addTagData.itemTagType){
                    this.$store.commit('message',this.$t('selectItemTag'));
                    return;
                }
                if (!this.editDateFlag){
                    if (!addTagData.beginDate || !addTagData.beginTime || !addTagData.endDate || !addTagData.endTime){
                        this.$store.commit('message',this.$t('pleaseFillDateTime'));
                        return;
                    }
                }

                // 新增情况下判断是否存在相同的数据(标签)了
                if (this.type === 'add'){
                    parentQueryDs.forEach( item => {
                        if (item.itemTagType === addTagData.itemTagType){
                            this.$store.commit('message', this.$t('notSameItemTag'));
                            sameTagFlag = true;
                        }
                    });
                }

                if (sameTagFlag){
                    sameTagFlag = false;
                    return;
                }

                // 时间不可输入情况下
                if (!addTagData.beginDate){
                    addTagData.beginDate = '';
                    addTagData.endDate = '';
                }else {
                        let beginDate = addTagData.beginDate,
                            endDate = addTagData.endDate,
                            beginTime1 = Number(addTagData.beginTime.substr(0,2)) * 3600000,
                            endTime1 = Number(addTagData.beginTime.substr(-2,2)) * 60 * 1000,
                            beginTime2 = Number(addTagData.endTime.substr(0,2)) * 3600000,
                            endTime2 = Number(addTagData.endTime.substr(-2,2)) * 60 * 1000;

                    beginDate = beginDate + beginTime1 + endTime1;
                    endDate = endDate + beginTime2 + endTime2;
                    addTagData.beginDate = beginDate;
                    addTagData.endDate = endDate;
                }

                this.type === 'add' ? this.$emit('saveTagData', addTagData) : this.$emit('saveEditTagData', addTagData, this.editIndex);
                this.addTagDs.clearCurrent();
                this.hide();
            }
        }
    }
</script>


<style scope>
    .table-content{
        margin-top: 10px;
        max-height: 300px;
        overflow-y: auto;
    }
</style>