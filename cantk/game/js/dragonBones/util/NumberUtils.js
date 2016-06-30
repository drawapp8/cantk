var NumberUtils = (function () {
    function NumberUtils() {
    }
    var __egretProto__ = NumberUtils.prototype;
    /**
     * @private
     */
    NumberUtils.isNumber = function (value) {
        return typeof (value) === "number" && !isNaN(value);
    };
    /**
     * 得到对应角度值的sin近似值
     * @param value {number} 角度值
     * @returns {number} sin值
     */
    NumberUtils.sin = function (value) {
        var valueFloor = Math.floor(value);
        var valueCeil = valueFloor + 1;
        var resultFloor = NumberUtils.sinInt(valueFloor);
        var resultCeil = NumberUtils.sinInt(valueCeil);
        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    };
    NumberUtils.sinInt = function (value) {
        value = value % 360;
        if (value < 0) {
            value += 360;
        }
        if (value < 90) {
            return egret_sin_map[value];
        }
        if (value < 180) {
            return egret_cos_map[value - 90];
        }
        if (value < 270) {
            return -egret_sin_map[value - 180];
        }
        return -egret_cos_map[value - 270];
    };
    /**
     * 得到对应角度值的cos近似值
     * @param value {number} 角度值
     * @returns {number} cos值
     */
    NumberUtils.cos = function (value) {
        var valueFloor = Math.floor(value);
        var valueCeil = valueFloor + 1;
        var resultFloor = NumberUtils.cosInt(valueFloor);
        var resultCeil = NumberUtils.cosInt(valueCeil);
        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    };
    NumberUtils.cosInt = function (value) {
        value = value % 360;
        if (value < 0) {
            value += 360;
        }
        if (value < 90) {
            return egret_cos_map[value];
        }
        if (value < 180) {
            return -egret_sin_map[value - 90];
        }
        if (value < 270) {
            return -egret_cos_map[value - 180];
        }
        return egret_sin_map[value - 270];
    };
    return NumberUtils;
})();
var egret_sin_map = {};
var egret_cos_map = {};
for (var NumberUtils_i = 0; NumberUtils_i <= 90; NumberUtils_i++) {
    egret_sin_map[NumberUtils_i] = Math.sin(NumberUtils_i * Matrix.DEG_TO_RAD);
    egret_cos_map[NumberUtils_i] = Math.cos(NumberUtils_i * Matrix.DEG_TO_RAD);
}
