import EventListener from "@/lib/utils/EventListener"

//id前缀
const prefix = "record";
var num = parseInt(Math.random() * 1000000);
export default class Record extends EventListener{

    static statusMap = {
        new: "new",
        old: "old",
        dirty: "dirty"
    };

    event = {
        update: "update",
        clear: "clear",
        verify: "verify" //校验
    };

    constructor(dataSet, data, status){
        super();

        this.fieldConfig = dataSet.fieldConfig || {};
        this.status = status;
        this.recordId = this.getId();
        this.selected = false;
        this.verifyResult = {};
        this.setData(data);
    }

    //发起校验
    sendVerify(){
        this.ifInit = false;
        this.verifyResult = {
            ifPassVerify: true
        };
        this.dispatch(this.event.verify, this);
        return this.verifyResult;
    }

    getData(){
        return this.data;
    }

    clearData(data){
        data = data || {};
        this.setData(data);
        this.ifInit = true;
        this.dispatch(this.event.clear);
    }

    setVerifyResult(name, ifPass, msg){
        let result = this.verifyResult;
        result[name] = {
            ifPass: ifPass,
            name: name,
            errorMsg: msg
        };
        result.ifPassVerify = result.ifPassVerify && ifPass;
        result.firstErrorMsg = result.firstErrorMsg || msg;
    }

    getVerifyResult(){
        return this.verifyResult;
    }

    getId(){
        num ++;
        return prefix + num;
    }

    setValue(key, value, origin){
        let oldValue = this.getValue(key);

        if (oldValue !== value){
            if (this.status === Record.statusMap.old){
                this.status = Record.statusMap.dirty;
            }
            this.data[key] = value;
            this.dispatch(this.event.update, value, key, this, origin);
        }

        if (value){
            this.ifInit = false;
        }
    }

    resetValue(key, value, origin){
        let oldValue = this.getValue(key);
        if (oldValue != value){
            this.data[key] = value;
            this.dispatch(this.event.update, value, key, this, origin);
        }
    }

    getValue(key){
        if (this.data && key){
            return this.data[key];
        }
    }

    update(data){
        let _this = this;
        for (let key in data){
            _this.setValue(key, data[key]);
        }
    }

    setData(data){
        this.data = this.ctrlData(data);
    }

    ctrlData(data){
        var temp, defaultValue, fieldConfig;

        data = data || {};
        fieldConfig = this.fieldConfig;

        for (var key in fieldConfig){
            defaultValue = fieldConfig[key];
            if (defaultValue){
                defaultValue = defaultValue["defaultValue"];
                temp = data[key];
                data[key] = temp === undefined ? defaultValue : temp;
            }
        }
        return data;
    }

    valid(){
        var validConfig = this.fieldConfig,
            valid,
            result = [],
            error;

        /**
         * var fieldConfig = {
         * name: {
         * valid: function(){},
         * defaultValue: 1
         *
         */
        for (var key in data){
            valid = validConfig[key]["valid"];

            if (typeof valid == "function"){
                error = valid(data[key]);
                if (error){
                    result.push({
                        field: key,
                        message: error
                    });
                }
            }
        }

        this.validResult = result;
        return result;
    }
}
