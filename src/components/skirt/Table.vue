<template>
    <div class="sk-table-container">
        <div class="sk-buttons-part">
            <slot name="buttons"></slot>
        </div>

        <div class="editor-part" v-show="1 == 2">
            <slot name="row"></slot>
        </div>

        <div v-if="hasInit" class="sk-table-content">
            <table class="sk-table" :height="height" ref="table">
                <thead>
                    <tr>
                        <th class="sk-th check-box-td" v-if="showCheckbox && hasRecords">
                            <mu-checkbox v-if="multiSelectable" class="mu-checkbox" @change="selectAll" v-model="hasSelectedAll" :disabled="!selectable && isLoading"/>
                        </th>
                        <th class="sk-th sk-line-number-td" v-if="showLineNumber && hasRecords">{{$t('lineNo')}}</th>
                        <th :style="{width: column.width}" class="sk-th column.name" v-show="!column.ifHide" :key="column.columnId" :tooltip="column.tooltip" :tooltipPosition="column.tooltipPosition" v-for="(column, index) in columns">{{column.title}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="sk-row" @click="onClickRow(index, record)" v-if="!rowsStatus[index]" :selectable="record.selectable" :selected="record.selected" v-for="(record, index) in records" :key="record.recordId" :id="record.recordId">
                        <td class="sk-td check-box-td" v-if="showCheckbox">
                            <mu-checkbox class="mu-checkbox" @change="select(record)" v-model="record.selected" :disabled="!selectable"/>
                        </td>
                        <td class="sk-td sk-line-number-td" v-if="showLineNumber">{{index+1}}</td>
                        <sk-column v-show="!column.ifHide" :key="column.columnId" :column="column" :rowIndex="index" :record="record" v-for="(column, i) in columns"></sk-column>
                    </tr>

                    <tr v-if="!hasRecords">
                        <td class="sk-td" :colspan="columnLength" style="padding: 10px 0; color: #aaa;">
                            <div class="loading-part" v-if="isLoading">
                                <mu-circular-progress :size="20" :strokeWidth="2" color="#444"/>
                                <span class="loading-info">{{$t('loading')}}</span>
                            </div>
                            <div class="no-data-info" v-if="!isLoading && hasLoadData">{{$t('noData')}}</div>
                            <div class="no-data-info" v-if="!isLoading && !hasLoadData">{{$t('noData')}}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div v-if="pagination && totalCount>0" class="pagination-part">
            <div style="float: left;">
                <mu-pagination ref="pag" @page-change="onChangPage" :show-size-changer="false" :total="totalCount" :page-size="myPageSize" :current="currentPage" ></mu-pagination>
            </div>
            <div class="page-size-select">
                <sk-select :option="pageSizeOption" v-model="pageSize" @change="onPageSizeChange"></sk-select>
            </div>
            <div style="clear: both;"></div>
        </div>
    
    
        <transition name="load-fade">
            <div class="switch-page-loading" v-if="isRefresh">
                <div class="loading-part">
                    <mu-circular-progress :size="30" :strokeWidth="2" color="#eee"/>
                    <span class="loading-info" style="color: #eee;">{{$t('loading')}}</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    import Record from "@/lib/utils/Record"

    /**
     *
     * @type {number}
     * 需要创建sk-td
     *
     */

    var id = 1;
    var columnIdSequence = parseInt(Math.random() * 10000);
    const columnIdPrefix = "column-id-";
    const checkBoxName = "owner-checkBox";

    export default{
        name: "sk-table",
        data(){
            return {
                classList: {
                    hover: "sk-row-hover"
                },
                hoverClass: "",
    
                rowsStatus: {}, //显示隐藏row
    
                id: "sk-table" + (id++),
                bindListener: null,
                records: null,
                columns: null,
                tds: null,
                pagination: false,
                hasInit: false,
                
                ///columnLength: 1,
    
                showSizeChanger: true, //pageSize改变
                pageSize: 20,
                totalCount: 0,
                currentPage: 1,
    
                isLoading: false, //是否加载中
                isRefresh: false, //是否刷新
                hasLoadData: false, //是否已经加载过数据
                hasSelectedAll: false //是否选择了全部
            }
        },

        props: {
            onRemove: {},
    
            bind: {type: DataSet},

            config: {},
            showCheckbox: {
                type: Boolean,
                default: false
            },
    
            showLineNumber: {
                type: Boolean,
                default: false
            },
            
            selectable: {
                type: Boolean,
                default: true
            },

            //是否可以多选
            multiSelectable: {
                type: Boolean,
                default: true
            },
            height: {default: "auto"},
            fixedHeader: {default: true},
    
            pageSizeOption: {
                default: function () {
                    return [10, 20, 50, 100];
                }
            }
        },

        beforeCreate(){

        },
        
        

        created(){
            //是否有绑定的ds
            let temp = this.bind;
            if (temp){
                this.setBindDs(temp);
            }

            this.initRowConfig();
        },

        watch: {
            bind(dataSet, old){
                this.setBindDs(dataSet, old);
            },
            
            records(v){
                if (v.length == 0){
                    this.hasSelectedAll = false;
                }
            }
        },

        computed: {
            hasRecords(){
                let records = this.records;
                return (records && records.length > 0);
            },
    
            columnLength(){
                let columns = this.columns, a = 0;
                for (var i = 0, l = columns.length; i < l; i++) {
                    a += columns[i].ifHide ? 0 : 1;
                }
                return a;
            },
            myPageSize(){
                return parseInt(this.pageSize);
            }
        },

        methods: {
            setBindDs(ds, old){
                if (!!old){
                    old.removeEventListener(old.event.load, this.onLoad);
                    old.removeEventListener(old.event.load, this.onDsStartLoad);
                    old.removeEventListener(old.event.update, this.onDsUpdate);
                    old.removeEventListener(old.event.loadFailed, this.onLoadFailed);
                }
                
                ds.addEventListener(ds.event.load, this.onLoad);
                ds.addEventListener(ds.event.startLoad, this.onDsStartLoad);
                ds.addEventListener(ds.event.update, this.onDsUpdate);
                ds.addEventListener(ds.event.loadFailed, this.onLoadFailed);
                
                if (ds.hasLoadData){
                    this.setPageView(ds);
                    this.setRecords(ds.records);
                }
                
                //设置状态
                this.isLoading = ds.isLoading;
                this.hasLoadData = ds.hasLoadData;
                this.pageSize = parseInt(ds.pageSize);
            },
            
            //ds开始加载执行的操作
            onDsStartLoad(){
                if (this.hasRecords){
                    this.isLoading = false;
                    this.isRefresh = true;
                }else{
                    this.isLoading = true;
                    this.isRefresh = false;
                }
            },

            //设置分页信息
            setPageView(ds){
                this.pagination = ds.pagination;
                this.currentPage =  parseInt(ds.currentPage);
                this.totalCount =  parseInt(ds.totalCount);
                this.pageSize =  parseInt(ds.pageSize);
                
                if (this.$refs.pag){
                    this.$refs.pag.actualPageSize = this.pageSize;
                }
            },

            //设置绑定的数据
            setRecords(options){
                this.hasSelectedAll = false;
                this.ifLoading = false;
                this.isRefresh = false;
                this.records = options;
            },

            setConfig(){
                this.config = config;
            },

            onLoad(records){
                this.isLoading = false;
                this.hasLoadData = true;
                this.setRecords(records);
                this.setPageView(this.bind);
            },
    
            onLoadFailed(){
                this.hasLoadData = true;
                this.setRecords([]);
                this.isLoading = false;
                this.isRefresh = false;
            },
    
            onDsUpdate(value, key, record){
                let columns = record.columns;
                if (columns){
                    let columnComponent = columns[key];
                    if (columnComponent){
                        columnComponent.refresh();
                    }
                }
            },

            /**************事件处理****************/

            rowSelection(){

            },
    
            onClickRow(index, record){
                this.$emit('select-row', index, record);
                this.bind.setCurrentRecord(record);
            },

            //切换页面
            onChangPage(page){
                if (this.currentPage != page) {
                    this.isLoading = true;
                    this.bind.setCurrentPage(page);
                    this.isRefresh = true;
                }
            },

            onPageSizeChange(size){
                if (size != this.pageSize) {
                    this.isLoading = true;
                    this.bind.setPageSize(size);
                    this.isRefresh = true;
                }
            },

            /***************渲染相关函数***************/
            getColumnId(){
                return columnIdPrefix + (++ columnIdSequence);
            },

            initRowConfig(){
                let row = this.$slots.row;
                let tds, td, options, columns = [], column;
                tds = row[0].children; //获取孩子节点

                for (let i = 0, l = tds.length; i < l; i++) {
                    td = tds[i];

                    if (td.tag){
                        options = td.componentOptions || {};
                        column = Object.assign(options.propsData, {});
                        column.columnId = this.getColumnId();
                        column.listeners = options.listeners;
                        columns.push(column);
                    }
                }

                this.columns = columns;
                this.hasInit = true;
            },

            onChangeColumnProps(name, key, value){
                let columns = this.columns, column;
                for (var i = 0, l = columns.length; i < l; i++) {
                    column = columns[i];
                    if (column.name == name){
                        column[key] = value;
                    }
                }
            },

            onClickAll(v){
                let bind = this.bind;
                if (v && bind){
                    bind.selectAll()
                }
            },

            /**************选择**************/
            selectAll(checked){
                let records = this.records;
                for  (let i = 0, l = records.length; i < l; i ++){
                    records[i].selected = checked;
                }
                
                this.hasSelectedAll = checked;
                this.$emit("select", this.getSelectRecords());
            },

            select(record){
                let checked = record.selected;
                
                let records = this.records, rec, index;
                for  (let i = 0, l = records.length; i < l; i ++){
                    rec = records[i];
                    
                    if (record != rec){
                        //是否可以多选
                        if (this.multiSelectable){
                            if (rec.selected != checked){
                                checked = false;
                                break;
                            }
                        }else{
                            rec.selected = false;
                        }
                    }else{
                        index = i;
                    }
                }
                this.hasSelectedAll = checked;
                
                this.onClickRow(index, record);
                
                this.$emit("select", this.getSelectRecords());
            },
    
            /**
             * @param index 可以为record对象
             */
            deleteRow(index){
                if (typeof index != "object"){
                    this.bind.deleteRecord(this.records[index]);
                }else {
                    this.bind.deleteRecord(index);
                }
            },
    
            /**
             *
             * @returns {Array}
             */
            hideRow(index){
                this.$set(this.rowsStatus, index, true);
            },
            
            hideColumn(name){
                this.setColumnConfig(name, "ifHide", true);
            },
            
            setTitle(name, value){
                this.setColumnConfig(name, "title", value);
            },
            
            setColumnConfig(name, key, value){
                let columns = this.columns, column;
                for (var i = 0, l = columns.length; i < l; i++) {
                    column = columns[i];
                    if (column.name == name){
                        column[key] = value;
                        this.$set(columns, i, column);
                    }
                }
            },
            
            getSelectData(){
                let records = this.records, result = [], record;
                if (records){
                    for (let i = 0, l = records.length; i < l; i++) {
                        record = records[i];
                        if (record.selected){
                            result.push(record.getData());
                        }
                    }
                }
                return result;
            },
    
            getSelectRecords(){
                let records = this.records, result = [], record;
                if (records){
                    for (let i = 0, l = records.length; i < l; i++) {
                        record = records[i];
                        if (record.selected){
                            result.push(record);
                        }
                    }
                }
                return result;
            },
    
            onMouseOver(e){
                e.target.classList.add(this.classList.hover);
            },
            
            onMouseLeave(e){
                e.target.classList.remove(this.classList.hover);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sk-table-container{
        position: relative;
    }
    .sk-table-container {
        td{
            padding: 10px;
            border-collapse: collapse;
            vertical-align: middle;
        }
        .check-box-td, .sk-line-number-td{
            width: 80px;
            text-align: center;
        }

        .pagination-part{
            margin-top: 10px;
        }
        .sk-table-content{
            position: relative;
        }
        
        .sk-table{
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            border-bottom: 1px solid #eee;
            background-color: #fefefe;
            box-shadow: 1px 1px 10px -5px #000;
        }
        
        .sk-row:hover{
            background-color: rgba(173,143,63,0.05);
        }

        .sk-row{
            background-color: rgba(173, 143, 63, 0);
            transition-duration: 0.3s;
            transition-property: all;
        }
        
        .sk-th, td{
            border-top: 1px solid #f2f2f2;
            border-right: none;
            border-left: none;
        }
        
        .sk-th{
            padding: 10px;
            font-weight: normal;
            background-color: #fafafa;
        }

        .sk-buttons-part{
            margin-bottom: 10px;
        }

        .loading-part {
            .mu-circular-progress, .loading-info {
                vertical-align: middle;
            }
        }

        .switch-page-loading{
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            z-index: 2;
            background: rgba(0, 0, 0, 0.4);
        }
        .load-fade-enter-active, .load-fade-leave-active {
            transition: opacity .5s;
            opacity: 1;
        }
        .load-fade-enter, .load-fade-leave-to{
            opacity: 0
        }
        .switch-page-loading .loading-info{
            margin-left: 10px;
        }

        .switch-page-loading .loading-part{
            top: 50%;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            font-size: 16px;
        }

        .loading-part {
            text-align: center;
        }

        .no-data-info {
            text-align: center;
            color: #333;
        }

        .mu-text-field {
            margin-bottom: 0px;
        }

    }
</style>


<style lang="scss">
    .sk-table-container{
        .mu-text-field-content{
            padding-bottom: 0px;
            padding-top: 0px;
        }
        .mu-text-field{
            min-height: 10px;
            margin-bottom: 0px;
        }
        .mu-text-field-input{
            border: thin solid #ddd;
            padding: 8px;
            height: 36px;
            font-size: 14px;
            line-height: 24px;
            border-radius: 2px;
        }
        .mu-text-field-input:focus{
            border-color: #333;
            box-shadow: 0px 0px 11px -3px #000;
        }
        .mu-text-field-line, .mu-text-field-focus-line{
            display: none;
        }
        .mu-text-field-help{
            display: none;
        }
        .has-error-editor .mu-text-field-input{
            border-color: #e00;
            box-shadow-color: #e00;
        }
        .page-size-select{
            float: left;
            width: 150px;
            text-align: center;
        }
        .sk-td-content{
            word-break: break-all;
            max-width: 100%;
            white-space: normal;
        }
    }
</style>