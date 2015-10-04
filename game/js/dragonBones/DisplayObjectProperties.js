/**
 * @private
 */
var DisplayObjectProperties = (function () {
    function DisplayObjectProperties() {
        this._name = null;
        this._explicitWidth = NaN;
        this._explicitHeight = NaN;
        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._anchorOffsetX = 0;
        this._anchorOffsetY = 0;
        this._anchorX = 0;
        this._anchorY = 0;
        this._rotation = 0;
        this._alpha = 1;
        this._skewX = 0;
        this._skewY = 0;
        this._blendMode = null;
        this._touchEnabled = DisplayObjectProperties.defaultTouchEnabled;
        this._visible = true;
        this._worldAlpha = 1;
        this._scrollRect = null;
        this._cacheAsBitmap = false;
        this._parent = null;
        this._stage = null;
        this._needDraw = false;
        /**
         * beta功能，请勿调用此方法
         */
        this._filters = null;
        this._hasWidthSet = false;
        this._hasHeightSet = false;
        this._normalDirty = true;
        //对宽高有影响
        this._sizeDirty = true;
        this._isContainer = false;
    }
    /**
     * 每个显示对象初始化时默认的 touchEnabled 属性值
     * @default false
     */
    DisplayObjectProperties.defaultTouchEnabled = false;
    return DisplayObjectProperties;
})();
