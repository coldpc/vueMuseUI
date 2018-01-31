import Record from "./Record"
import EventListener from "@/lib/utils/EventListener"

export default class DataSet extends EventListener{

    event = {
        indexChange: "indexChange", //record ds
        update: "update", //
        remove: "remove", //record index ds
        success: "success", //提交成功
        failed: "failed", //提交失败
        load: "load",//加载数据
        loadFailed: "load-failed",
        beforeSubmit: "beforeSubmit",
        startLoad: "startLoad", //开始加载数据
        delete: "delete"
    };

    actionType = {
        submit: "submit",
        query: "query",
        add: "add",
        insert: "insert",
        reset: "reset",
        delete: "delete"
    };

    /**
     *
     * @param config 配置
     *
     * queryService
     * dataSource
     * submitService
     * autoCreate
     * autoQuery
     * records
     * filter 过滤
     *
     * bind 绑定的dataset
     * bindField 绑定的字段
     * bindParaKey 绑定作为查询条件
     *
     *
     *
     * 当前record
     * currentRecord
     * isDirty: 是否编辑过
     * isNew: 是否新建
     * id: 唯一id
     *
     *
     * fieldConfig： 字段配置
     * defaultValue 默认值
     * type 数据类型
     * valid 校验函数
     *
     *
     *
     *
     */
    constructor(config){
        super();

        //和service相关
        this.hasLoadData = false;
        this.isLoading = false;
        this.submitService = config.submitService; //提交的service
        this.deleteService = config.deleteService; //删除的service
        this.updateService = config.updateService; //更新的service

        //自动创建
        this.autoQuery = config.autoQuery || false; //自动查询
        this.autoCreate = config.autoCreate; //自动创建

        //加载数据的时候处理
        this.parseData = config.parseData; //处理数据

        //查询处理
        this.parseQueryPara = config.parseQueryPara; //处理数据
        this.beforeQuery = config.beforeQuery; //处理数据
        this.queryBind = config.queryBind; //查询绑定ds
        this.queryPara = config.queryPara; //查询绑定ds
        this.fieldConfig = config.fieldConfig;
        this.pagination = config.pagination;
        this.lastQueryPara = null; //记录上次查询参数

        //初始化records
        this.records = [];
        this.pagination = config.pagination;
        this.pageSize = config.pageSize || 10;
        this.currentPage = config.currentPage || 1;
        this.totalPage = 10;

        //查询是否出现loading
        this.queryMask = config.queryMask;

        //初始化事件函数 由于很多回调函数 很难操作回调
        this.initEventFunc(config);

        //初始化数据模型
        if (config.dataSource){
            this.setData(config.dataSource);
        }else if(!!this.autoQuery && this.queryService){
            this.query();
        }else if(config.autoCreate){
            this.add();
        }
    }


    /**
     * 初始化侦听器
     * 这个方法具有唯一性质
     * 不可以多次初始化
     *
     */
    initEventFunc(config){
        //绑定ds操作
        this.bindListener = this.getListener(this, "onUpdateBindFunc");
        this.bindIndexChangeListener = this.getListener(this, "onBindDsIndexChange");

        //提交侦听器
        this.submitListener = this.getListener(this, "onSubmitSuccess");

        //record的更新事件
        this.recordUpdateListener = this.getListener(this, "onRecordUpdate");


        /*********************开始绑定操作***********************/
        //绑定的父级
        this.setBindDs(config.bind, config.bindField, config.bindParaKey);

        //设置查询的ds
        this.setQueryService(config.queryService);

        //设置提交的service
        this.setSubmitService(config.submitService);
    }


    /**
     *
     * @param oldValue 旧的值 可以为空
     * @param newValue 新设置的值
     * @param eventName 事件名称
     * @param listener 侦听器
     * @returns {boolean}
     */
    updateListener(newValue, eventName, listener, oldValue){
        //如果有绑定的ds
        if (oldValue != newValue){
            //先移除旧的
            if (oldValue){
                oldValue.removeEventListener(eventName, listener);
            }

            //绑定新的
            if (newValue){
                newValue.addEventListener(eventName, listener);
            }
            return true;
        }else{
            return false;
        }
    }

    /**
     *
     * 这是绑定的ds的事件回调
     * @param value
     * @param key
     *
     */
    onUpdateBindFunc(value, key){
        if (key == this.bindField){
            var para = this.queryPara || {};
            if (value){
                para[this.bindParaKey] = value;
                this.query(para);
            }else{
                this.setData();
            }
        }
    }
    onBindDsIndexChange(record){
        let key = this.bindField;
        this.onUpdateBindFunc(record.getValue(key), key);
    }

    /**
     *
     * @param data
     * 加载完成
     *
     * 服务端默认分页格式的数据为
     *
     * items 数据
     * pageNum 当前页
     * pageSize page尺寸
     * totalCount 总记录条数
     * totalPages 总页数
     *
     **/
    onQueryLoad(data){
        this.isLoading = false;
        if (this.pagination && data.items){
            //debugger;
            //this.currentPage = data.pageNum > 0 ? data.pageNum : 1;
            this.totalCount = data.totalCount;
            this.totalPages = data.totalPages;
            this.setData(data.items);
        }else{
            this.setData(data);
        }
    }

    /**
     *
     */
    onRecordUpdate(...args){
        this.dispatch(this.event.update, ...args);
    }

    /**
     *
     * @param data 提交成功
     *
     */
    onSubmitSuccess(data, res){
        this.dispatch(this.event.success, data, res, this);
    }


    /************************设置值集合*************************/
    //设置绑定的父级ds
    setBindDs(ds, field = this.bindField, paraKey = this.bindParaKey){
        if (ds){
            this.updateListener(ds, ds.event.update, this.bindListener, this.bind);
            this.updateListener(ds, ds.event.indexChange, this.bindIndexChangeListener, this.bind);
        }

        //设置值
        this.bindParaKey = paraKey || field;
        this.bindField = field;
        this.bind = ds;
    }

    reset(){
        this.setData();
        this.hasLoadData = false;
        this.isLoading = false;
    }

    //设置查询的service
    setQueryService(queryService){
        if (queryService){
            this.updateListener(queryService, queryService.eventName, this.queryListener, this.queryService);
        }
        this.queryService = queryService;
    }

    //设置查询的service
    setSubmitService(submitService){
        if (submitService){
            this.updateListener(submitService, submitService.eventName, this.submitListener, this.submitService);
        }
        this.submitService = submitService;
    }

    //设置查询绑定的ds
    setQueryBind(ds){
        this.queryBind = ds;
    }

    //设置数据
    setData(data, status = Record.statusMap.old){
        this.hasLoadData = true;
        var records = [],
            _this = this;

        if (data){

            //是否处理一下
            if (typeof _this.parseData == "function"){
                data = _this.parseData(data);
            }

            //是否为数组
            if (data instanceof Array){
                for (var i = 0, l = data.length; i < l; i++) {
                    records.push(_this.createRecord(data[i], status));
                }
            }else{
                records.push(_this.createRecord(data, status));
            }
        }
        this.setRecords(records);
    }

    //设置查询的参数
    setQueryPara(data){
        this.queryPara = data;
    }

    //内部创建record 便不是给ds创建记录
    createRecord(data, status = Record.statusMap.new){
        let record = new Record(this, data, status);
        record.addEventListener(record.event.update, this.recordUpdateListener);
        return record;
    }

    //新增
    add(data){
        if (!this.hasLoadData && this.records.length == 0){
            this.setData();
        }

        let record = this.createRecord(data, Record.statusMap.new);
        this.records.push(record);
        this.setCurrentRecord(record);
        return record;
    }

    addMultiple(data){
        let records = [];
        for (let i = 0, l = data.length; i < l; i++) {
            records.push(this.add(data[i]));
        }
        return records;
    }

    /**
     *
     * @param value
     * 可以直接传index
     * 也可以传record
     */
    remove(value){
        let records, currentRecord, record, index;

        records = this.records;
        currentRecord = this.currentRecord;

        if (!(value instanceof Record)){
            index = value;
            record = records[index];
        }else{
            record = value;
            index = records.indexOf(record);
        }

        if (index >= 0){
            records.splice(index, 1);
            this.dispatch(this.event.remove, record, index, this);
            if (record == currentRecord){
                this.setCurrentRecord(records.length - 1);
            }
        }
    }

    setRecords(records){
        this.records = records;
        this.dispatch(this.event.load, records, this);
        this.setCurrentRecord(records[0]);
    }

    /**
     *
     * @param value
     * 直接设置record或者绑定的index
     *
     */
    setCurrentRecord(value){
        let record;
        if (!(value instanceof Record)){
            record = this.records[value];
        }else{
            record = value;
        }

        if (record){
            this.currentRecord = record;
            this.currentData = record.data;

            this.dispatch(this.event.indexChange, record, this);
        }
    }

    /*********************分页相关*********************************/
    setCurrentPage(page){
        if (this.currentPage != page) {
            this.currentPage = page;
            let para = this.lastQueryPara;
            this.query(this.setPaginationPara(para), true);
        }
    }

    setPageSize(size){
        this.pageSize = size;
        let para = this.lastQueryPara;
        this.query(this.setPaginationPara(para), true);
    }

    nextPage(){
        let page = this.currentPage;
        page += 1;
        this.setCurrentPage(page);
    }

    prePage(){
        let page = this.currentPage;
        page -= 1;
        if (page > 0){
            this.setCurrentPage();
        }
    }

    /*****************************get*****************************/
    getCurrentValue(key){
        let record = this.getCurrentRecord();
        if (record){
            return record.getValue(key);
        }
    }

    //获取
    getCurrentData(){
        var record = this.currentRecord;
        return !!record ? record.data : null;
    }

    getCurrentRecord(){
        return this.currentRecord;
    }

    getAllData(){
        let data = [], records = this.records;
        for (var i = 0, l = records.length; i < l; i++) {
            data.push(records[i].getData());
        }
        return data;
    }

    //获取查询参数
    getQueryPara(initPara){
        var temp, para;


        para = Object.assign({}, initPara);

        //如果存在queryBind 先设置值
        temp = this.queryBind;
        if (temp){
            para = Object.assign(para, temp.getCurrentData() || {});
        }

        //queryBind
        temp = this.queryPara;
        if (temp){
            para = Object.assign(para, temp || {});
        }

        //处理查询参数
        if (typeof this.parseQueryPara == "function"){
            para = this.parseQueryPara(para);
        }

        //添加分页参数
        para = this.setPaginationPara(para);
        return para;
    }

    setPaginationPara(para){
        if (this.pagination){
            if (!para){
                para = {};
            }
            para.pageSize = this.pageSize;
            para.pageNum = this.currentPage;
        }
        return para;
    }

    /*********************对ds的操作******************************/
    doAction(type){
        let actions = this.actionType;
        switch (type){
            case actions.query:
                this.query();
                break;

            case actions.submit:
                this.submit();
                break;

            case actions.delete:
                this.delete();
                break;

            case actions.add:
                this.add();
                break;

            case actions.reset:
                this.clearCurrent();
                break;

            default:
                return false;
        }

        return true;
    }

    clearCurrent(data){
        this.getCurrentRecord().clearData(data);
    }

    submit(){
        let service = this.submitService;
        let data = this.getCurrentData();
        service.execute({
            data: data,
            mask: {},
            success: function () {
            
            }.bind(this)
        })
    }

    /**
     *
     * @param record
     * 一行记录的record
     *
     */
    deleteRecord(record){
        let deleteService = this.deleteService;
        if (deleteService){
            deleteService.execute({
                data: record.getData(),
                success: function () {
                    this.remove(record);
                    record = null;
                }.bind(this)
            });
        }else{
            this.remove(record);
            record = null;
        }
    }

    /**
     *
     * @param para 查询的参数
     * @param ifPagination 是否为分页查询
     */
    query(para, ifPagination){
        let beforeQuery = this.beforeQuery;
        if (typeof beforeQuery == "function"){
            if (!beforeQuery(this)){
                return false;
            }
        }

        this.isLoading = true;
        this.dispatch(this.event.startLoad, this);

        if (!ifPagination){
            this.currentPage = 1;
            para = this.getQueryPara(para);
        }

        this.lastQueryPara = para;

        this.queryService.execute({
            data: para,
            mask: this.queryMask,
            complete: function (res) {
                if (typeof res != 'object' || res.code != 0){
                    this.dispatch(this.event.loadFailed, res);
                }
            }.bind(this),
            success: function (data, res) {
                this.onQueryLoad(data, res);
            }.bind(this)
        });

        return true;
    }

    //更新
    update(){}

    //如果存在deleteService将会直接调用
    delete(outerRecords){
        let records = outerRecords || this.getSelectedRecords();
        for (let i = 0; i < records.length; i++) {
            this.deleteRecord(records[i]);
        }
        return records;
    }

    //获取选中的records
    getSelectedRecords(){
        let records = this.records, record, result = [];
        for (let i = 0; i < records.length; i++) {
            record = records[i];
            if (record.selected){
                result.push(record);
            }
        }
        return result;
    }

    getSelectedData(){
        return this.getRecordsData(this.records, true);
    }

    getRecordsData(records, ifSelected){
        let record, result = [];
        for (let i = 0; i < records.length; i++) {
            record = records[i];
            if (!ifSelected || (ifSelected && record.selected)){
                result.push(record.getData());
            }
        }
        return result;
    }

    sendVerify(){
        let records = this.records, ifPass = true, result;
        for (var i = 0, l = records.length; i < l; i++) {
            result = records[i].sendVerify();
            ifPass = ifPass && result.ifPassVerify
        }
        return ifPass;
    }

    updateRecordsData(records, data){
        for (let i = 0, l = records.length; i < l; i++) {
            records[i].update(data);
        }
    }
}