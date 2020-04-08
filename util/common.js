let common = {};
common.getCover = function (url) {
    let result = '';
    if (url) {
        result = url;
    } else {
        let param = (Math.random() + '').slice(2, 3);
        result = 'https://ossweb-img.qq.com/images/lol/web201310/skin/big1000' + param + '.jpg';
    }
    return result;
};
common.getIntroduction = function (introduction) {
    let result = '';
    if (introduction) {
        result = introduction;
    } else {
        result = '暂无简介...';
    }
    return result;
};
common.sleep = function (milliSeconds) {
    let startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
        // ...
    }
};
export default common;
