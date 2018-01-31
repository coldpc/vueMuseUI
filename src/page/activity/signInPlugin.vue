<template>
    <div class="signIn">
        <sk-data-set v-model="queryDs" :query-bind="queryDs" auto-query :queryPara="{activityId: this.activityId}"
                     :query-service="activity.getActivitySignList"></sk-data-set>


        <sk-fold :title="$t('activityLookIntoChecked')">
            <sk-row class="activity-info">
                <sk-col :size="2">
                    <div>
                        <span v-html="this.$t('activityEventName')"></span>
                        <span>{{ activityName }}</span>
                    </div>
                </sk-col>
                <sk-col :size="2">
                    <div>
                        <span v-html="this.$t('activityEventPeriod')"></span>
                        <span>{{ startDate | formatMsgTime}} ~ {{ endDate | formatMsgTime}} </span>
                    </div>
                </sk-col>
            </sk-row>

            <sk-table :bind="queryDs">
                <div slot="row">
                    <sk-column name="1" :title="$t('activityGuestName')" align="center"></sk-column>
                    <sk-column name="2" :title="$t('passportNo')" align="center"></sk-column>
                    <sk-column name="3" :title="$t('activityReserved')" align="center"></sk-column>
                    <sk-column name="4" :title="$t('orderNo')" align="center"></sk-column>
                    <sk-column name="5" :title="$t('activityCheckInTime')" align="center"></sk-column>
                </div>
            </sk-table>
        </sk-fold>
    </div>
</template>

<script type="text/javascript">
    import activity from "@/lib/dataModules/activity"

    export default {
        data(){
            return {
                activity,
                queryDs: null,
                activityName: "",
                startDate: "",
                endDate: "",
                activityId: this.$route.query.activityId
            }
        },
        created(){
            activity.getActivityById.execute({
                data: {
                    activityId: this.$route.query.activityId
                },
                success: (data) => {
                    this.activityName = data.activityName;
                    this.startDate = data.beginTime;
                    this.endDate = data.endTime;
                }
            })
        },

        filters: {
            formatMsgTime: function(v){
                var v = new Date(v),
                        y = v.getFullYear(),
                        M = v.getMonth() + 1,
                        d = v.getDate(),
                        h = v.getHours(),
                        m = v.getMinutes(),
                        s = v.getSeconds();
                M = M < 10? "0" + M : M;
                d = d < 10? "0" + d : d;
                h = h < 10? "0" + h : h;
                m = m < 10? "0" + m : m;
                s = s < 10? "0" + s : s;
                return y + "-" + M + "-" + d ;

            }
        }

    }
</script>

<style lang="scss" scoped>
    .activity-info {
        padding-bottom: 20px;
        font-size: 18px;
    }
</style>