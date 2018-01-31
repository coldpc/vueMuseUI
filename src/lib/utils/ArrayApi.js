export default {
    //根据某个字段的值过滤数组
    getDataByAttr(data, attr, value, noEqual){
        data = data || [];
        var l = data.length;
        var d, result = [];
        for (var i = 0; i < l; i++){
            d = data[i];
            if (!noEqual){
                if (d[attr] == value){
                    result.push(d);
                }
            }else if (d[attr] != value){
                result.push(d);
            }
        }
        return result;
    },

    //提取数组一个字段的数组
    getFieldValue(data, attr, space){
        let result = [];
    
        data = data || [];
        for (let i = 0, l = data.length; i < l; i++){
            result.push(data[i][attr]);
        }

        if (space){
            result = result.join(space);
        }
        return result;
    },

    getFieldsValue(data, keys){
        let result = [], obj, copy, h, j, temp;

        if (!(keys instanceof Array)){
            keys = [keys];
        }
        for (let i = 0, l = data.length; i < l; i++) {
            obj = data[i];
            copy = {};
            result.push(copy);

            for (h = 0, j = keys.length; h < j; h++) {
                temp = obj[keys[h]];
                copy[keys[h]] = temp;
            }
        }
        return result;
    },

    //搜索
    searchIndexByAttr(data, attr, value){
        let l = data.length;
        let d, result = -1;
        for (let i = 0; i < l; i++){
            d = data[i];
            if (d[attr] == value){
                result = i;
                break;
            }
        }
        return result;
    },

    //分类数据
    classify(data, key) {
        var classifyKey, classifyResult, obj, arr;

        //将数据分类 {a: [], b: []}
        classifyResult = {};
        for (var i = 0, l = data.length; i < l; i++) {
            obj = data[i];
            classifyKey = obj[key];

            arr = classifyResult[classifyKey] || (classifyResult[classifyKey] = []);
            arr.push(obj);
        }

        //将分类成功的object变成数组
        var result = [], kind, o;
        for (var k in classifyResult){
            kind = classifyResult[k]; //一个数组

            o = {};
            o.data = kind;
            o[key] = k;

            result.push(o);
        }

        return result;
    }
}