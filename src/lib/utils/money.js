export default {
    format(value, nullText){
        value = value || "";
        let v = parseFloat(value);

        //不存在合法值得情况用nullText
        if (!v && v !== 0){
            return nullText;
        }

        //存在值
        let n = 2;
        v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = v.split(".")[0].split("").reverse(), r = v.split(".")[1],
            t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
}