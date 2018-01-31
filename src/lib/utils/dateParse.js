const parse = {
    lastDays: (function () {
        function getDate(dDays) {
            var d = new Date();
            d.setDate(d.getDate() + dDays);
            return new Date(d);
        }
        return [
            {
                d: getDate(-1),
                name: "昨天"
            },
            {
                d: getDate(0),
                name: "今天"
            },
            {
                d: getDate(1),
                name: "明天"
            },
            {
                d: getDate(2),
                name: "后天"
            }
        ];
    })(),

    getDayName(date) {
        var lastDays = this.lastDays;
        var d;
        for (var i = 0, l = lastDays.length; i < l; i++) {
            d = lastDays[i].d;
            if (d.getFullYear() == date.getFullYear() && d.getMonth() == date.getMonth() && d.getDate() == date.getDate()){
                return lastDays[i].name;
            }
        }
    },

    cDayNames: new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"),

    format: function (date, fmt, c) {
        if (!date){
            return date;
        }
        if (typeof date == "number" || typeof date == "string"){
            date = new Date(parseInt(date));
        }
        if (!fmt){
            fmt = "yyyy-MM-dd hh:mm:ss";
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

        if (c && c.toLowerCase() == "zhs"){
            var name = this.getDayName(date);
            if (name){
                fmt = name + fmt.substr(10);
            }
        }
        return fmt;
    }
};

export default parse;