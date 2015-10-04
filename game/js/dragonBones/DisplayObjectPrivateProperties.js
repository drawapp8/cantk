/**
 * @private
 */
var DisplayObjectPrivateProperties = (function () {
    function DisplayObjectPrivateProperties() {
        this._hitTestPointTexture = null;
        this._rectW = 0;
        this._rectH = 0;
        this._cacheDirty = false;
    }
    return DisplayObjectPrivateProperties;
})();
