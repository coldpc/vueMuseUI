<template>
    <div class="main-container">
        <sk-data-set ref="table" v-model="queryDs" auto-create></sk-data-set>
        
        <sk-data-set v-model="articleList" :delete-service="article.deleteArticle" :query-bind="queryDs" auto-query
                     pagination page-size="20" :query-service="article.articleList"></sk-data-set>
        <sk-data-set v-model="auditStatus" :data-source="auditStatusData" auto-create></sk-data-set>
        
        <h2 class="title">
            <span>文章列表</span>
            <span class="triangle">△</span>
        </h2>
        
        <transition name="slideUp">
            <div v-show="showFlag">
                <sk-form :bind="queryDs">
                    <sk-row gutter>
                        <sk-col :size="2">
                            <sk-text-input hintText="文章标题" label="文章标题" name="articleTitle"></sk-text-input>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-select value="all" hint-text="请选择" label="审核状态" :bind="queryDs" name="auditStatus"
                                       :option-bind="auditStatus" display-field="display" :data-source="auditStatusData"
                                       value-field="value"></sk-select>
                        </sk-col>
                    </sk-row>
                    
                    <sk-row gutter>
                        <sk-col :size="2">
                            <sk-date-picker value="" name="beginDate" label="开始时间" hintText="开始时间"></sk-date-picker>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-date-picker bind-min-date="beginDate" value="" name="endDate" label="结束时间"
                                            hintText="结束时间"></sk-date-picker>
                        </sk-col>
                    </sk-row>
                    <sk-row gutter class="btn-group">
                        <sk-col :size="1">
                            <div style="text-align: right;">
                                <sk-button :bind="articleList" action="query" label="搜索" primary></sk-button>
                                <sk-button label="清空" action="reset"></sk-button>
                            </div>
                        </sk-col>
                    </sk-row>
                </sk-form>
                
                <sk-table ref="table" :bind="articleList">
                    <div slot="row">
                        <sk-column align="center" width="20px" :formatter="orderIndex" name="adAssignId"
                                   title="序号"></sk-column>
                        <sk-column name="articleTitle" title="文章标题"></sk-column>
                        <sk-column :formatter="renderImg" name="adAttachList" title="缩略图"></sk-column>
                        <sk-column :formatter="transTime" name="createTime" title="创建时间"></sk-column>
                        <sk-column name="itemCounts" title="展示商品数"></sk-column>
                        <sk-column :formatter="showAuditStatus" name="auditStatus" title="审核状态"></sk-column>
                        <sk-column :formatter="operate" @cell-click="doOperation" name="auditStatus"
                                   title="操作"></sk-column>
                    </div>
                </sk-table>
            </div>
        </transition>
    </div>
</template>
<script>
    import article from "@/lib/dataModules/orgPartner"
    
    export default {
        data() {
            return {
                queryDs: null,
                articleList: null,
                article: article,
                auditStatus: null,
                
                auditStatusData: [{
                    display: "全部", value: "all"
                }, {
                    display: "已通过", value: "APPROVE"
                }, {
                    display: "未通过", value: "REFUSE"
                }, {
                    display: "审核中", value: "INIT"
                }],
                
                showFlag: true
            }
        },
        
        computed: {},
        
        methods: {
            orderIndex(v, index, record) {
                return index + 1;
            },
            showAuditStatus(v) {
                switch (v) {
                    case "INIT":
                        return "审核中";
                    case "REFUSE":
                        return "未通过";
                    case "APPROVE":
                        return "已通过";
                }
            },
            renderImg(v) {
                if (!v.length)
                    return;
                let url = v[0].path;
                return "<img src='" + url + "' style='height: 40px' />";
            },
            transTime(v) {
                let time = new Date(v);
                return time.toISOString().substring(0, 16).replace("T", " ")
            },
            operate(v, i, colum) {
                let html = "";
                switch (v) {
                    case "INIT":
                        html = "<a class='look'>查看</a>";
                        break;
//                    case "REFUSE":
//                    case "APPROVE":
                    default:
                        html = "<a class='edit'>编辑</a><br><a class='delete'>删除</a>";
                        break;
                }
                return html
            },
            clearDs() {
                this.queryDs.setData([])
            },
            
            doOperation(e, v, name, index, record) {
                let type = e.target.className,
                        table = this.$refs.table;
                switch (type) {
                    case 'edit':
                    case 'look':
                        this.$store.dispatch('router/push', {
                            title: "创建文章",
                            name: "page.orgPartner.createArticle",
                            params: {key: record.getValue("articleId"), type: type}
                        });
                        break;
                    
                    case 'delete':
                        table.deleteRow(index);
                }
            }
            
        },
        
        created() {
            
        }
    }
</script>
<style lang="scss" scoped>
    .main-container {
        width: 90%;
        max-width: 1000px;
        margin: auto;
    }
</style>
