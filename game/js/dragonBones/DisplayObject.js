var DisplayObject = (function () {
    function DisplayObject() {
        this._texture_to_render = null;
        this._worldBounds = null;
        this.__hack_local_matrix = null;
        //尺寸发生改变的回调函数。若此对象被添加到UIAsset里，此函数将被赋值，在尺寸发生改变时通知UIAsset重新测量。
        this._sizeChangeCallBack = null;
        this._sizeChangeCallTarget = null;
        /**
         * 调用显示对象被指定的 mask 对象遮罩。
         * 要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。但不绘制 mask 对象本身。
         * 将 mask 设置为 null 可删除蒙版。
         */
        this.mask = null;
        /**
         * @private
         */
        this.renderTexture = null;
        this._DO_Props_ = new DisplayObjectProperties();
        this._DO_Privs_ = new DisplayObjectPrivateProperties();
        this._worldTransform = new Matrix();
        this._worldBounds = new Rectangle(0, 0, 0, 0);
        this._DO_Privs_._cacheBounds = new Rectangle(0, 0, 0, 0);
    }
    DisplayObject.prototype._setDirty = function () {
        this._DO_Props_._normalDirty = true;
    };
    /**
     * @private
     */
    DisplayObject.prototype.getDirty = function () {
        return this._DO_Props_._normalDirty || this._DO_Props_._sizeDirty;
    };
    DisplayObject.prototype._setParentSizeDirty = function () {
        var parent = this._DO_Props_._parent;
        if (parent) {
            if (!(parent._DO_Props_._hasWidthSet || parent._DO_Props_._hasHeightSet)) {
                parent._setSizeDirty();
            }
            else {
                parent._setCacheDirty();
            }
        }
    };
    DisplayObject.prototype._setSizeDirty = function () {
        var self = this;
        var do_props = self._DO_Props_;
        if (do_props._sizeDirty) {
            return;
        }
        do_props._sizeDirty = true;
        this._setDirty();
        this._setCacheDirty();
        this._setParentSizeDirty();
        if (self._sizeChangeCallBack != null) {
            if (self._sizeChangeCallTarget == do_props._parent) {
                self._sizeChangeCallBack.call(self._sizeChangeCallTarget);
            }
            else {
                self._sizeChangeCallBack = null;
                self._sizeChangeCallTarget = null;
            }
        }
    };
    DisplayObject.prototype._clearDirty = function () {
        //todo 这个除了文本的，其他都没有clear过
        this._DO_Props_._normalDirty = false;
    };
    DisplayObject.prototype._clearSizeDirty = function () {
        //todo 最好在enterFrame都重新算一遍
        this._DO_Props_._sizeDirty = false;
    };
    Object.defineProperty(DisplayObject.prototype, "name", {
        get: function () {
            return this._DO_Props_._name;
        },
        /**
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @member {string} egret.DisplayObject#name
         */
        set: function (value) {
            this._DO_Props_._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "parent", {
        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
         * @member {egret.DisplayObjectContainer} egret.DisplayObject#parent
         */
        get: function () {
            return this._DO_Props_._parent;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._parentChanged = function (parent) {
        this._DO_Props_._parent = parent;
    };
    Object.defineProperty(DisplayObject.prototype, "x", {
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#x
         */
        get: function () {
            return this._DO_Props_._x;
        },
        set: function (value) {
            this._setX(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setX = function (value) {
        if (typeof value === 'number'  && !isNaN(value) && this._DO_Props_._x != value) {
            this._DO_Props_._x = value;
            this._setDirty();
            this._setParentSizeDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "y", {
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#y
         */
        get: function () {
            return this._DO_Props_._y;
        },
        set: function (value) {
            this._setY(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setY = function (value) {
        if (typeof value === "number" && !isNaN(value) && this._DO_Props_._y != value) {
            this._DO_Props_._y = value;
            this._setDirty();
            this._setParentSizeDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "scaleX", {
        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleX
         * @default 1
         */
        get: function () {
            return this._DO_Props_._scaleX;
        },
        set: function (value) {
            if (typeof value === "number" && !isNaN(value) && this._DO_Props_._scaleX != value) {
                this._DO_Props_._scaleX = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scaleY", {
        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleY
         * @default 1
         */
        get: function () {
            return this._DO_Props_._scaleY;
        },
        set: function (value) {
            if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._scaleY != value) {
                this._DO_Props_._scaleY = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "anchorOffsetX", {
        /**
         * 表示从对象绝对锚点X。
         * @member {number} egret.DisplayObject#anchorOffsetX
         * @default 0
         */
        get: function () {
            return this._DO_Props_._anchorOffsetX;
        },
        set: function (value) {
            if (typeof value==='number' && !isNaN(value) && this._DO_Props_._anchorOffsetX != value) {
                this._DO_Props_._anchorOffsetX = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "anchorOffsetY", {
        /**
         * 表示从对象绝对锚点Y。
         * @member {number} egret.DisplayObject#anchorOffsetY
         * @default 0
         */
        get: function () {
            return this._DO_Props_._anchorOffsetY;
        },
        set: function (value) {
            if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._anchorOffsetY != value) {
                this._DO_Props_._anchorOffsetY = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "anchorX", {
        /**
         * 表示从对象相对锚点X。
         * @member {number} egret.DisplayObject#anchorX
         * @default 0
         * @deprecated
         */
        get: function () {
            return this._DO_Props_._anchorX;
        },
        set: function (value) {
            this._setAnchorX(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setAnchorX = function (value) {
        if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._anchorX != value) {
            this._DO_Props_._anchorX = value;
            this._setDirty();
            this._setParentSizeDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "anchorY", {
        /**
         * 表示从对象相对锚点Y。
         * @member {number} egret.DisplayObject#anchorY
         * @default 0
         * @deprecated
         */
        get: function () {
            return this._DO_Props_._anchorY;
        },
        set: function (value) {
            this._setAnchorY(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setAnchorY = function (value) {
        if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._anchorY != value) {
            this._DO_Props_._anchorY = value;
            this._setDirty();
            this._setParentSizeDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "visible", {
        /**
         * 显示对象是否可见。
         * 不可见的显示对象已被禁用。例如，如果实例的 visible=false，则无法单击该对象。
         * 默认值为 true 可见
         * @member {boolean} egret.DisplayObject#visible
         */
        get: function () {
            return this._DO_Props_._visible;
        },
        set: function (value) {
            this._setVisible(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setVisible = function (value) {
        if (this._DO_Props_._visible != value) {
            this._DO_Props_._visible = value;
            this._setSizeDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "rotation", {
        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。例如，my_video.rotation = 450语句与 my_video.rotation = 90 是相同的。
         * @member {number} egret.DisplayObject#rotation
         * @default 0 默认值为 0 不旋转。
         */
        get: function () {
            return this._DO_Props_._rotation;
        },
        set: function (value) {
            if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._rotation != value) {
                this._DO_Props_._rotation = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "alpha", {
        /**
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
         * @member {number} egret.DisplayObject#alpha
         * @default 1
         */
        get: function () {
            return this._DO_Props_._alpha;
        },
        set: function (value) {
            this._setAlpha(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setAlpha = function (value) {
        if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._alpha != value) {
            this._DO_Props_._alpha = value;
            this._setDirty();
            this._setCacheDirty();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "skewX", {
        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         */
        get: function () {
            return this._DO_Props_._skewX;
        },
        set: function (value) {
            if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._skewX != value) {
                this._DO_Props_._skewX = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "skewY", {
        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         */
        get: function () {
            return this._DO_Props_._skewY;
        },
        set: function (value) {
            if (typeof value === 'number' && !isNaN(value) && this._DO_Props_._skewY != value) {
                this._DO_Props_._skewY = value;
                this._setDirty();
                this._setParentSizeDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "touchEnabled", {
        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} egret.DisplayObject#touchEnabled
         * @default false 默认为 false 即不可以接收。
         */
        get: function () {
            return this._DO_Props_._touchEnabled;
        },
        set: function (value) {
            this._setTouchEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setTouchEnabled = function (value) {
        this._DO_Props_._touchEnabled = value;
    };
    Object.defineProperty(DisplayObject.prototype, "blendMode", {
        /**
         * BlendMode 类中的一个值，用于指定要使用的混合模式。
         * 内部绘制位图的方法有两种。 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @member {string} egret.DisplayObject#blendMode
         */
        get: function () {
            return this._DO_Props_._blendMode;
        },
        set: function (value) {
            this._DO_Props_._blendMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scrollRect", {
        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         *  @member {egret.Rectangle} egret.DisplayObject#scrollRect
         */
        get: function () {
            return this._DO_Props_._scrollRect;
        },
        set: function (value) {
            this._setScrollRect(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._setScrollRect = function (value) {
        this._DO_Props_._scrollRect = value;
        this._setSizeDirty();
    };
    Object.defineProperty(DisplayObject.prototype, "measuredWidth", {
        /**
         * 测量宽度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        get: function () {
            return this._measureBounds().width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "measuredHeight", {
        /**
         * 测量高度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        get: function () {
            return this._measureBounds().height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "explicitWidth", {
        /**
         * 显式设置宽度
         * @returns {number}
         */
        get: function () {
            return this._DO_Props_._explicitWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "explicitHeight", {
        /**
         * 显式设置高度
         * @returns {number}
         */
        get: function () {
            return this._DO_Props_._explicitHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "width", {
        /**
         * 表示显示对象的宽度，以像素为单位。
         * 宽度是根据显示对象内容的范围来计算的。优先顺序为 显式设置宽度 > 测量宽度。
         * @member {number} egret.DisplayObject#width
         * @returns {number}
         */
        get: function () {
            return this._getWidth();
        },
        set: function (value) {
            this._setWidth(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._getWidth = function () {
        return this._getSize(Rectangle.identity).width;
    };
    Object.defineProperty(DisplayObject.prototype, "height", {
        /**
         * 表示显示对象的高度，以像素为单位。
         * 高度是根据显示对象内容的范围来计算的。优先顺序为 显式设置高度 > 测量高度。
         * @member {number} egret.DisplayObject#height
         * @returns {number}
         */
        get: function () {
            return this._getHeight();
        },
        set: function (value) {
            this._setHeight(value);
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._getHeight = function () {
        return this._getSize(Rectangle.identity).height;
    };
    /**
     * @inheritDoc
     */
    DisplayObject.prototype._setWidth = function (value) {
        this._setSizeDirty();
        this._setCacheDirty();
        this._DO_Props_._explicitWidth = value;
        //this._DO_Props_._hasWidthSet = egret.NumberUtils.isNumber(value);
        this._DO_Props_._hasWidthSet = (typeof value === 'number' && !isNaN(value));
    };
    /**
     * @inheritDoc
     */
    DisplayObject.prototype._setHeight = function (value) {
        this._setSizeDirty();
        this._setCacheDirty();
        this._DO_Props_._explicitHeight = value;
        //this._DO_Props_._hasHeightSet = egret.NumberUtils.isNumber(value);
        this._DO_Props_._hasHeightSet = (typeof value === 'number' && !isNaN(value));
    };
    Object.defineProperty(DisplayObject.prototype, "worldAlpha", {
        get: function () {
            return this._DO_Props_._worldAlpha;
        },
        /**
         * @private
         */
        set: function (value) {
            this._DO_Props_._worldAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param renderContext
     */
    DisplayObject.prototype._draw = function (renderContext) {
        var o = this;
        if (!o._DO_Props_._visible) {
            o.destroyCacheBounds();
            return;
        }
        var hasDrawCache = o.drawCacheTexture(renderContext);
        if (hasDrawCache) {
            o.destroyCacheBounds();
            return;
        }
        var isCommandPush = MainContext.__use_new_draw && o._DO_Props_._isContainer;
        if (o._hasFilters() && !isCommandPush) {
            this._setGlobalFilters(renderContext);
        }
        renderContext.setAlpha(o.worldAlpha, o.blendMode);
        renderContext.setTransform(o._worldTransform);
        var mask = o.mask || o._DO_Props_._scrollRect;
        if (mask && !isCommandPush) {
            renderContext.pushMask(mask);
        }
        o._render(renderContext);
        if (mask && !isCommandPush) {
            renderContext.popMask();
        }
        if (o._hasFilters() && !isCommandPush) {
            this._removeGlobalFilters(renderContext);
        }
        o.destroyCacheBounds();
    };
    DisplayObject.prototype._setGlobalFilters = function (renderContext) {
        var o = this;
        var arr;
        if (o._DO_Props_._filters) {
            arr = o._DO_Props_._filters.concat();
        }
        else {
            arr = [];
        }
        if (this._transform) {
            var colorTransform = this._transform._colorTransform;
            var color = DisplayObject.color;
            color[0] = colorTransform._redMultiplier;
            color[4] = colorTransform._redOffset;
            color[6] = colorTransform._greenMultiplier;
            color[9] = colorTransform._greenOffset;
            color[12] = colorTransform._blueMultiplier;
            color[14] = colorTransform._blueOffset;
            color[18] = colorTransform._alphaMultiplier;
            color[19] = colorTransform._alphaOffset;
            DisplayObject.colorMatrixFilter._matrix = color;
            arr.push(DisplayObject.colorMatrixFilter);
        }
        renderContext.setGlobalFilters(arr);
    };
    DisplayObject.prototype._removeGlobalFilters = function (renderContext) {
        renderContext.setGlobalFilters(null);
    };
    DisplayObject.prototype._hasFilters = function () {
        var result = this._DO_Props_._filters && this._DO_Props_._filters.length > 0;
        if (this._transform) {
            var colorTransform = this._transform._colorTransform;
            if (colorTransform._redMultiplier != 1 || colorTransform._redOffset != 0 || colorTransform._greenMultiplier != 1 || colorTransform._greenOffset != 0 || colorTransform._blueMultiplier != 1 || colorTransform._blueOffset != 0 || colorTransform._alphaMultiplier != 1 || colorTransform._alphaOffset != 0) {
                result = true;
            }
        }
        return result;
    };
    DisplayObject.prototype._pushMask = function (renderContext) {
        var o = this;
        renderContext.setTransform(o._worldTransform);
        var mask = o.mask || o._DO_Props_._scrollRect;
        if (mask) {
            renderContext.pushMask(mask);
        }
    };
    DisplayObject.prototype._popMask = function (renderContext) {
        renderContext.popMask();
    };
    /**
     * @private
     */
    DisplayObject.prototype.drawCacheTexture = function (renderContext) {
        var display = this;
        if (display._DO_Props_._cacheAsBitmap == false) {
            return false;
        }
        var bounds = display.getBounds(Rectangle.identity);
        if (display._DO_Privs_._cacheDirty || display._texture_to_render == null || Math.round(bounds.width) - display._texture_to_render._textureWidth >= 1 || Math.round(bounds.height) - display._texture_to_render._textureHeight >= 1) {
            var cached = display._makeBitmapCache();
            display._DO_Privs_._cacheDirty = !cached;
        }
        //没有成功生成cache的情形
        if (display._texture_to_render == null)
            return false;
        var renderTexture = display._texture_to_render;
        var offsetX = renderTexture._offsetX;
        var offsetY = renderTexture._offsetY;
        var width = renderTexture._textureWidth;
        var height = renderTexture._textureHeight;
        display._updateTransform();
        renderContext.setAlpha(display.worldAlpha, display.blendMode);
        renderContext.setTransform(display._worldTransform);
        var renderFilter = egret.RenderFilter.getInstance();
        renderFilter.drawImage(renderContext, display, 0, 0, width, height, offsetX, offsetY, width, height);
        return true;
    };
    Object.defineProperty(DisplayObject.prototype, "needDraw", {
        get: function () {
            return this._DO_Props_._needDraw;
        },
        /**
         * 强制每帧执行_draw函数
         * @public
         * @member {string} egret.DisplayObject#blendMode
         */
        set: function (value) {
            this._DO_Props_._needDraw = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param renderContext
     */
    DisplayObject.prototype._updateTransform = function () {
        var o = this;
        var do_props = o._DO_Props_;
        if (!do_props._visible) {
            return;
        }
        o._calculateWorldTransform();
        if (MainContext._renderLoopPhase == MainContext.PHASE_TRANSFORM) {
            if (o.needDraw || o._texture_to_render || do_props._cacheAsBitmap) {
            	MainContext.instance.addDraw(o._draw, o);
            }
        }
    }
    /**
     * 计算全局数据
     * @private
     */
    DisplayObject.prototype._calculateWorldTransform = function () {
        var o = this;
        var do_props = o._DO_Props_;
        var worldTransform = o._worldTransform;
        var parent = do_props._parent;
        if(parent) {
        	worldTransform.identityMatrix(parent._worldTransform);
        }
        else {
        	worldTransform.identityMatrix(new Matrix);
        }
        this._getMatrix(worldTransform);
        var scrollRect = do_props._scrollRect;
        if (scrollRect) {
            worldTransform.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
        }
        if(parent) {
        	o.worldAlpha = parent.worldAlpha * do_props._alpha;
        }
        else {
        	o.worldAlpha = do_props._alpha;
        }
    }
    /**
     * @private
     * @param renderContext
     */
    DisplayObject.prototype._render = function (renderContext) {
    }
    /**
     * 获取显示对象的测量边界
     * @method egret.DisplayObject#getBounds
     * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
     * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
     * @returns {Rectangle}
     */
    DisplayObject.prototype.getBounds = function (resultRect, calculateAnchor) {
        if (calculateAnchor === void 0) { calculateAnchor = true; }
        var do_props = this._DO_Props_;
        var do_privs = this._DO_Privs_;
        //            if (do_props._cacheBounds.x == 0 && do_props._cacheBounds.y == 0 && do_props._cacheBounds.width == 0 && do_props._cacheBounds.height == 0) {
        var rect = this._measureBounds();
        var w = do_props._hasWidthSet ? do_props._explicitWidth : rect.width;
        var h = do_props._hasHeightSet ? do_props._explicitHeight : rect.height;
        //记录测量宽高
        do_privs._rectW = rect.width;
        do_privs._rectH = rect.height;
        this._clearSizeDirty();
        var x = rect.x;
        var y = rect.y;
        var anchorX = 0, anchorY = 0;
        if (calculateAnchor) {
            if (do_props._anchorX != 0 || do_props._anchorY != 0) {
                anchorX = w * do_props._anchorX;
                anchorY = h * do_props._anchorY;
            }
            else {
                anchorX = do_props._anchorOffsetX;
                anchorY = do_props._anchorOffsetY;
            }
        }
        do_privs._cacheBounds.initialize(x - anchorX, y - anchorY, w, h);
        //            }
        var result = do_privs._cacheBounds;
        if (!resultRect) {
            resultRect = new Rectangle();
        }
        return resultRect.initialize(result.x, result.y, result.width, result.height);
    };
    DisplayObject.prototype.destroyCacheBounds = function () {
        var do_privs = this._DO_Privs_;
        do_privs._cacheBounds.x = 0;
        do_privs._cacheBounds.y = 0;
        do_privs._cacheBounds.width = 0;
        do_privs._cacheBounds.height = 0;
    };
    DisplayObject.prototype._getConcatenatedMatrix = function () {
        //todo:采用local_matrix模式下这里的逻辑需要修改
        var matrix = DisplayObject.identityMatrixForGetConcatenated.identity();
        var o = this;
        while (o != null) {
            var do_props = o._DO_Props_;
            if (do_props._anchorX != 0 || do_props._anchorY != 0) {
                var bounds = o._getSize(Rectangle.identity);
                matrix.prependTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation, do_props._skewX, do_props._skewY, bounds.width * do_props._anchorX, bounds.height * do_props._anchorY);
            }
            else {
                matrix.prependTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation, do_props._skewX, do_props._skewY, do_props._anchorOffsetX, do_props._anchorOffsetY);
            }
            if (do_props._scrollRect) {
                matrix.prepend(1, 0, 0, 1, -do_props._scrollRect.x, -do_props._scrollRect.y);
            }
            o = do_props._parent;
        }
        return matrix;
    };
    /**
     * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
     * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
     * @method egret.DisplayObject#localToGlobal
     * @param x {number} 本地x坐标
     * @param y {number} 本地y坐标
     * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
     * @returns {egret.Point} 具有相对于舞台的坐标的 Point 对象。
     */
    DisplayObject.prototype.localToGlobal = function (x, y, resultPoint) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var mtx = this._getConcatenatedMatrix();
        mtx.append(1, 0, 0, 1, x, y);
        if (!resultPoint) {
            resultPoint = new egret.Point();
        }
        resultPoint.x = mtx.tx;
        resultPoint.y = mtx.ty;
        return resultPoint;
    };
    /**
     * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
     * @method egret.DisplayObject#globalToLocal
     * @param x {number} 全局x坐标
     * @param y {number} 全局y坐标
     * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
     * @returns {egret.Point} 具有相对于显示对象的坐标的 Point 对象。
     */
    DisplayObject.prototype.globalToLocal = function (x, y, resultPoint) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var mtx = this._getConcatenatedMatrix();
        mtx.invert();
        mtx.append(1, 0, 0, 1, x, y);
        if (!resultPoint) {
            resultPoint = new egret.Point();
        }
        resultPoint.x = mtx.tx;
        resultPoint.y = mtx.ty;
        return resultPoint;
    };
    DisplayObject.prototype._getMatrix = function (parentMatrix) {
        if (!parentMatrix) {
            parentMatrix = Matrix.identity.identity();
        }
        var self = this;
        var do_props = self._DO_Props_;
        var anchorX, anchorY;
        var resultPoint = this._getOffsetPoint();
        anchorX = resultPoint.x;
        anchorY = resultPoint.y;
        var matrix = self.__hack_local_matrix;
        if (matrix) {
            parentMatrix.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            parentMatrix.append(1, 0, 0, 1, -anchorX, -anchorY);
        }
        else {
            parentMatrix.appendTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation, do_props._skewX, do_props._skewY, anchorX, anchorY);
        }
        return parentMatrix;
    };
    DisplayObject.prototype._getSize = function (resultRect) {
        var self = this;
        var do_props = self._DO_Props_;
        if (do_props._hasHeightSet && do_props._hasWidthSet) {
            this._clearSizeDirty();
            return resultRect.initialize(0, 0, do_props._explicitWidth, do_props._explicitHeight);
        }
        this._measureSize(resultRect);
        if (do_props._hasWidthSet) {
            resultRect.width = do_props._explicitWidth;
        }
        if (do_props._hasHeightSet) {
            resultRect.height = do_props._explicitHeight;
        }
        return resultRect;
    };
    /**
     * 测量显示对象坐标与大小
     */
    DisplayObject.prototype._measureSize = function (resultRect) {
        var self = this;
        var do_props = self._DO_Props_;
        var do_privs = self._DO_Privs_;
        if (do_props._sizeDirty) {
            resultRect = this._measureBounds();
            do_privs._rectW = resultRect.width;
            do_privs._rectH = resultRect.height;
            this._clearSizeDirty();
        }
        else {
            resultRect.width = do_privs._rectW;
            resultRect.height = do_privs._rectH;
        }
        resultRect.x = 0;
        resultRect.y = 0;
        return resultRect;
    };
    /**
     * 测量显示对象坐标，这个方法需要子类重写
     * @returns {egret.Rectangle}
     * @private
     */
    DisplayObject.prototype._measureBounds = function () {
        return Rectangle.identity.initialize(0, 0, 0, 0);
    };
    DisplayObject.prototype._getOffsetPoint = function () {
        var o = this;
        var do_props = o._DO_Props_;
        var regX = do_props._anchorOffsetX;
        var regY = do_props._anchorOffsetY;
        if (do_props._anchorX != 0 || do_props._anchorY != 0) {
            var bounds = o._getSize(Rectangle.identity);
            regX = do_props._anchorX * bounds.width;
            regY = do_props._anchorY * bounds.height;
        }
        //var result = egret.Point.identity;
        var result = {}; 
        result.x = regX;
        result.y = regY;
        return result;
    };
    Object.defineProperty(DisplayObject.prototype, "cacheAsBitmap", {
        /**
         * 如果设置为 true，则 egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 具有已缓存位图的显示对象的所有矢量数据都将被绘制到位图而不是主显示。像素按一对一与父对象进行映射。如果位图的边界发生更改，则将重新创建位图而不会拉伸它。
         * 除非将 cacheAsBitmap 属性设置为 true，否则不会创建内部位图。
         * @member {number} egret.DisplayObject#cacheAsBitmap
         */
        get: function () {
            return this._DO_Props_._cacheAsBitmap;
        },
        set: function (bool) {
            this._DO_Props_._cacheAsBitmap = bool;
            if (bool) {
                egret.callLater(this._makeBitmapCache, this);
            }
            else {
                this._texture_to_render = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype._makeBitmapCache = function () {
        if (!this.renderTexture) {
            this.renderTexture = new egret.RenderTexture();
        }
        var result = this.renderTexture.drawToTexture(this);
        if (result) {
            this._texture_to_render = this.renderTexture;
        }
        else {
            this._texture_to_render = null;
        }
        return result;
    };
    DisplayObject.prototype._setCacheDirty = function (dirty) {
        if (dirty === void 0) { dirty = true; }
        this._DO_Privs_._cacheDirty = dirty;
    };
    /**
     * @private
     */
    DisplayObject.getTransformBounds = function (bounds, mtx) {
        var x = bounds.x, y = bounds.y;
        //            var x, y;
        var width = bounds.width, height = bounds.height;
        if (x || y) {
            mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
        }
        //        if (matrix) { mtx.prependMatrix(matrix); }
        var x_a = width * mtx.a, x_b = width * mtx.b;
        var y_c = height * mtx.c, y_d = height * mtx.d;
        var tx = mtx.tx, ty = mtx.ty;
        var minX = tx, maxX = tx, minY = ty, maxY = ty;
        if ((x = x_a + tx) < minX) {
            minX = x;
        }
        else if (x > maxX) {
            maxX = x;
        }
        if ((x = x_a + y_c + tx) < minX) {
            minX = x;
        }
        else if (x > maxX) {
            maxX = x;
        }
        if ((x = y_c + tx) < minX) {
            minX = x;
        }
        else if (x > maxX) {
            maxX = x;
        }
        if ((y = x_b + ty) < minY) {
            minY = y;
        }
        else if (y > maxY) {
            maxY = y;
        }
        if ((y = x_b + y_d + ty) < minY) {
            minY = y;
        }
        else if (y > maxY) {
            maxY = y;
        }
        if ((y = y_d + ty) < minY) {
            minY = y;
        }
        else if (y > maxY) {
            maxY = y;
        }
        return bounds.initialize(minX, minY, maxX - minX, maxY - minY);
    };
    Object.defineProperty(DisplayObject.prototype, "filters", {
        get: function () {
            return this._DO_Props_._filters;
        },
        /**
         * @private
         */
        set: function (value) {
            this._DO_Props_._filters = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "transform", {
        /**
         * @private
         */
        get: function () {
            if (!this._transform) {
                this._transform = new egret.Transform(this);
            }
            return this._transform;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.color = [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
    ];
    //DisplayObject.colorMatrixFilter = new egret.ColorMatrixFilter();
    /**
     * @private
     * @returns {Matrix}
     */
    DisplayObject.identityMatrixForGetConcatenated = new Matrix();
    DisplayObject._enterFrameCallBackList = [];
    DisplayObject._renderCallBackList = [];
    return DisplayObject;
})();
