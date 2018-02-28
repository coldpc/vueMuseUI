<script type="text/javascript">
    import DataSet from "@/lib/utils/DataSet"
    
    var  sequence = 1;
    
    export default{
        name: "sk-data-set",
        
        template: " ",
        
        data(){
            return {
                id: "dataSet" + (sequence ++),
                ds: null,
                c: {}
            }
        },
        
        props: {
            queryService: {
                    
            },
            
            submitService: {
                
            },
    
            deleteService: {
                
            },
    
            updateService: {
                
            },
    
            
            pagination: {
                default: false,
                type: Boolean
            },
            pageSize: {
                default: 20
            },
            
            //自动查询
            autoQuery: {
                type: Boolean,
                default: false
            },
            
            //自动创建
            autoCreate: {
                type: Boolean,
                default: false
            },
    
            //绑定的父级
            bind: {
                type: DataSet
            },
            
            bindField: {
                type: String
            },
    
            bindParaKey: {
                type: String
            },
    
            parseData: {
                type: Function
            },
    
            parseQueryPara: {
                type: Function
            },
    
            //字段配置 数据检验相关
            fieldConfig: {},
            
            //查询绑定
            queryPara: {},
            beforeQuery: {},
            queryMask: {default: null, type: Object},
            queryBind: {type: DataSet},
            dataSource: {},
    
            //为了实现v-mode做的实现
            value: {}
        },
        
        beforeCreate(){
        },
        
        created(){
            let dataSource = this.dataSource;
            this.dataSource = null;
            
            let ds = this.ds = new DataSet(this);
            this.initEvent(ds);
            
            if (dataSource) {
                ds.setData(dataSource);
            }
        },
        
        watch: {
            bind(ds){
                if (!!ds){
                    this.setBindDs(ds);
                }
            },
            queryBind(ds){
                if (!!ds) {
                    this.setQueryBindDs(ds);
                }
            },
            dataSource(data){
                this.ds.setData(data);
            }
        },
        
        methods: {
            setBindDs(ds){
                this.ds.setBindDs(ds);
            },
    
            setQueryBindDs(ds){
                if (this.ds){
                    this.ds.setQueryBind(ds);
                }
            },
    
            onLoadDs(records){
                this.$emit("load", records, this.ds);
            },
            
            initEvent(ds){
                this.$emit("input", ds);
    
                //抛出事件 ready
                this.$emit("ready", ds);
                
                ds.addEventListener(ds.event.startLoad, function (ds) {
                    this.$emit("startLoad", ds);
                }.bind(this));
                
                ds.addEventListener(ds.event.load, function (records, ds) {
                    this.$emit("load", records, ds);
                }.bind(this));
    
                ds.addEventListener(ds.event.indexChange, function (record, ds) {
                    this.$emit("indexChange", record, ds);
                }.bind(this));
    
                ds.addEventListener(ds.event.remove, function (record, index, ds) {
                    this.$emit("remove", record, index, ds);
                }.bind(this));
                
                ds.addEventListener(ds.event.success, function (data, res, ds) {
                    this.$emit("success", data, res, ds);
                }.bind(this));
    
                ds.addEventListener(ds.event.failed, function (message, res, ds) {
                    this.$emit("failed", message, res, ds);
                }.bind(this));
    
                ds.addEventListener(ds.event.loadFailed, function (message, res, ds) {
                    this.$emit("loadFailed", message, res, ds);
                }.bind(this));
                
                ds.addEventListener(ds.event.update, function (value, key, record) {
                    this.$emit("update", value, key, record, this.ds);
                }.bind(this));
            }
        }
    }
</script>
