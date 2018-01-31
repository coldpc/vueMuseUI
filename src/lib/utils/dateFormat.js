const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'];
const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const enDateFormat = {
    formatDisplay (date) {
        return '' + dayList[date.getDay()] + "，" + monthList[date.getMonth()] + " " + date.getDate();
    },
    formatMonth (date) {
        return "" + monthLongList[date.getMonth()] + " " + date.getFullYear();
    },
    getWeekDayArray (firstDayOfWeek) {
        let beforeArray = [];
        let afterArray = [];
        for (let i = 0; i < dayAbbreviation.length; i++) {
            if (i < firstDayOfWeek) {
                afterArray.push(dayAbbreviation[i])
            } else {
                beforeArray.push(dayAbbreviation[i])
            }
        }
        return beforeArray.concat(afterArray)
    }
};


let localConfig = {
    dayAbbreviation: ['日', '一', '二', '三', '四', '五', '六'],
    dayList: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    monthLongList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
};
const chiDateFormat = {
    formatDisplay (date) {
        var day = date.getDate()
        return `${localConfig.monthList[date.getMonth()]}-${day > 9 ? day : '0' + day} ${localConfig.dayList[date.getDay()]}`
    },
    formatMonth (date) {
        return `${date.getFullYear()} ${localConfig.monthLongList[date.getMonth()]}`
    },
    getWeekDayArray (firstDayOfWeek) {
        let beforeArray = []
        let afterArray = []
        const dayAbbreviation = localConfig.dayAbbreviation
        for (let i = 0; i < dayAbbreviation.length; i++) {
            if (i < firstDayOfWeek) {
                afterArray.push(dayAbbreviation[i])
            } else {
                beforeArray.push(dayAbbreviation[i])
            }
        }
        return beforeArray.concat(afterArray)
    }
};

export default {
    enDateFormat,
    chiDateFormat
}