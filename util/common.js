let common = {};
common.sleep = function (milliSeconds) {
    let startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
        // ...
    }
};
export default common;
