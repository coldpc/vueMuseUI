<script type="text/javascript">
    import Money from "@/lib/utils/money"
    export default{
        name: "sk-column",
        functional: false,     //就可以访问外部数据
        template: '<slot></slot>',

        props: {
            record: {},
            column: {},
            ifHide: {type: Boolean, default: false},
            
            width: {type: String, default: "auto"},
            align: {type: String, default: "left"},
            rowIndex:{},
            editable:{},
            name:{},
            editType:{},
            type: {type: String},
            min: {type: Number},
            required: {default: false},
            formatter: {type: Function},
            title:{},
            displayField:{},
            valueField:{},
            optionBind:{},
            checkedValue:{},
            uncheckedValue:{},
            className:{},
            
            viewType: {default: "text", type: String}
        },

        data(){
            return {
                owner: {}
            };
        },

        render: function (createElement) {
            if (!this.column){
                return createElement("p");
            }
            
            //现将数据拷贝过去
            let column = this.column;
            let editable = column.editable;
            editable = editable !== false && typeof editable !== 'undefined';

            if (editable){
                let editType = column.editType || "text-input";
                let componentName;

                switch(editType){
                    default:
                        componentName = editType;
                }
                componentName = "sk-" + componentName;

                let props = column;
                props.record = this.record;
                props.type = column.type;

                //返回
                return createElement(
                    "td",
                    {
                        on: {
                            click: this.onClick,
                            cellClick: this.onClick
                        },
                        props: {
                            name: this.column.name,
                            required: this.column.required
                        },
                        style: {
                            width: this.column.width,
                            textAlign: "center" || this.column.align
                        }
                    },
                    [
                        createElement(componentName, {
                            props: props
                        })
                    ]
                );
            }else{
                //保存cellContent
                let display = this.getDisplay();
                let cellContent = this.owner.cellContent = createElement("div", {
                    style: {},
    
                    props: {},
    
                    attrs: {
                        name: this.name,
                        class: "sk-td-content " + this.column.className,
                        title: !this.column.formatter ? display : ""
                    },
    
                    domProps: {
                        innerHTML: display
                    }
                });
    
                let record = this.record, name = this.column.name;
                if (record){
                    let columns = record.columns || (record.columns = {});
                    columns[name] = this;
                }
                
                return createElement(
                    "td",
                    {
                        on: {
                            click: this.onClick,
                            cellClick: this.onClick
                        },
                        props: {
                            name: name
                        },
                        style: {
                            width: this.column.width,
                            textAlign: "center" || this.column.align
                        }
                    },
                    [cellContent]
                );
            }
        },

        created(){

        },

        watch: {
            optionBind(ds){
                this.$parent.onChangeColumnProps(this.name, "optionBind", ds);
            },

            ifHide(v){
                this.$parent.onChangeColumnProps(this.name, "ifHide", v);
            },
            
            title(v){
                this.$parent.onChangeColumnProps(this.name, "title", v);
            },
            
            editable(v){
                this.$parent.onChangeColumnProps(this.name, "editable", v);
            }
        },

        methods: {
            refresh(){
                this.owner.cellContent.elm.innerHTML = this.getDisplay();
            },
            
            //获取tdValue
            getValue(){
                if (this.record){
                    let v = this.record.getValue(this.column.name);
                    return this.$base.htmlEncode(v);
                }
            },
    
            updateCell(){
                this.cellContent.innerHTML = this.getDisplay();
            },
            
            getDisplay(){
                if (!this.record || !this.column){
                    return;
                }
                
                let func = this.column.formatter;
                let value = this.getValue();

                //value可以二次渲染
                if (typeof func === "function"){
                    return func(value, this.rowIndex, this.record);
                }else{
                    return this.getViewByType(value);
                }
            },
            
            onClick(e){
                if (this.column){
                    let listener = this.column.listeners;
                    if (listener && listener['cell-click']){
                        listener['cell-click'](e, this.getValue(), this.column.name, this.rowIndex, this.record);
                    }
                }
            },
            
            getViewByType(v){
                let viewType = this.column.viewType;
                let result;
                switch(viewType){
                    case "img":
                        let src = (!!v && v[0] && v[0].path) ? v[0].path : "";
                        if (src){
                            result = "<div class='sk-img-viewer'><img class='sk-img' src='" + src + "'/></div>";
                        }else{
                            result = "";
                        }
                        break;
                    
                    case "money":
                        result = Money.format(v);
                        break;

                    case "time":
                        result = this.formatTime(v);
                        break;
                    
                    default:
                        result = v;
                }
                
                return result;
            },

            formatTime: function(v){
                v = !!v ? v : "-";
                if (v === "-"){
                    return v
                }
                return this.$base.formatTime(v);
            }
        }
    };
</script>
