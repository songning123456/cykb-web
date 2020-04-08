let convertDate = {};
/**
 *
 * @param systemTime new Date()
 * @param updateTime String
 */
convertDate.convertZh = function (systemTime, updateTime) {
    let result = '';
    let sTime = systemTime.getTime();
    let uTime = convertDate.strToDate(updateTime).getTime();
    let compare = sTime - uTime;
    if (compare >= 0 && compare < 1000 * 3600) {
        result = '刚才';
    } else if (compare >= 1000 * 3600 && compare < 1000 * 3600 * 24) {
        result = '一小时前';
    } else if (compare >= 1000 * 3600 * 24 && compare < 1000 * 3600 * 24 * 3) {
        result = '一天前';
    } else if (compare >= 1000 * 3600 * 24 * 3 && compare < 1000 * 3600 * 24 * 7) {
        result = '三天前';
    } else if (compare >= 1000 * 3600 * 24 * 7 && compare < 1000 * 3600 * 24 * 30) {
        result = '一周前'
    } else if (compare >= 1000 * 3600 * 24 * 30 && compare < 1000 * 3600 * 24 * 30 * 3) {
        result = '一个月前';
    } else if (compare >= 1000 * 3600 * 24 * 30 * 3 && compare < 1000 * 3600 * 24 * 30 * 12) {
        result = '三个月前';
    } else {
        result = '一年前';
    }
    return result;
};
/**
 * yyyy-MM-dd HH:mm:ss => Date
 * @param str
 */
convertDate.strToDate = function (str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
export default convertDate;