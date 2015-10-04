/**
 * @extends egret.DisplayObject
 * @class egret.DisplayObjectContainer
 * @classdesc
 * DisplayObjectContainer 类是可用作显示列表中显示对象容器的所有对象的基类。
 * 该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。每个 DisplayObjectContainer 对象都有自己的子级列表，用于组织对象的 Z 轴顺序。Z 轴顺序是由前至后的顺序，可确定哪个对象绘制在前，哪个对象绘制在后等。
 * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=108&terms1_id=25&terms2_id=28 显示容器的概念与实现
 * @includeExample egret/display/DisplayObjectContainer.ts
 */
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    /**
     * 创建一个 egret.DisplayObjectContainer 对象
     */
    function DisplayObjectContainer() {
        _super.call(this);
        this._touchChildren = true;
        this._children = [];
        this._DO_Props_._isContainer = true;
    }

    Object.defineProperty(DisplayObjectContainer.prototype, "touchChildren", {
        /**
         * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
         * 默认值为 true 即可以接收。
         * @member {boolean} egret.DisplayObjectContainer#touchChildren
         */
        get: function () {
            return this._touchChildren;
        },
        set: function (value) {
            this._touchChildren = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
        /**
         * 返回此对象的子项数目。
         * @member {number} egret.DisplayObjectContainer#numChildren
         */
        get: function () {
            return this._children.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
     * @method egret.DisplayObjectContainer#setChildIndex
     * @param child {egret.DisplayObject} 要为其更改索引编号的 DisplayObject 子实例。
     * @param index {number} 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
     */
    DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
        this.doSetChildIndex(child, index);
    };
    DisplayObjectContainer.prototype.doSetChildIndex = function (child, index) {
        var lastIdx = this._children.indexOf(child);
        if (lastIdx < 0) {
            egret.$error(1006);
        }
        //从原来的位置删除
        this._children.splice(lastIdx, 1);
        //放到新的位置
        if (index < 0 || this._children.length <= index) {
            this._children.push(child);
        }
        else {
            this._children.splice(index, 0, child);
        }
    };
    /**
     * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。子项将被添加到该 DisplayObjectContainer 实例中其他所有子项的前（上）面。（要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
     * @method egret.DisplayObjectContainer#addChild
     * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
     * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
     */
    DisplayObjectContainer.prototype.addChild = function (child) {
        var index = this._children.length;
        if (child.parent == this)
            index--;
        return this._doAddChild(child, index);
    };
    /**
     * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。该子项将被添加到指定的索引位置。索引为 0 表示该 DisplayObjectContainer 对象的显示列表的后（底）部。如果索引值为-1，则表示该DisplayObjectContainer 对象的显示列表的前（上）部。
     * @method egret.DisplayObjectContainer#addChildAt
     * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
     * @param index {number} 添加该子项的索引位置。 如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
     * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
     */
    DisplayObjectContainer.prototype.addChildAt = function (child, index) {
        return this._doAddChild(child, index);
    };
    DisplayObjectContainer.prototype._doAddChild = function (child, index, notifyListeners) {
        if (notifyListeners === void 0) { notifyListeners = true; }
        if (child == this)
            return child;
        if (index < 0 || index > this._children.length) {
            egret.$error(1007);
            return child;
        }
        var host = child.parent;
        if (host == this) {
            this.doSetChildIndex(child, index);
            return child;
        }
        if (host) {
            var hostIndex = host._children.indexOf(child);
            if (hostIndex >= 0) {
                host._doRemoveChild(hostIndex);
            }
        }
        this._children.splice(index, 0, child);
        child._parentChanged(this);
        if (notifyListeners)
        	var i =0;
            //child.dispatchEventWith(egret.Event.ADDED, true);
        if (this._DO_Props_._stage) {
            child._onAddToStage();
            var list = DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST;
            while (list.length > 0) {
                var childAddToStage = list.shift();
                if (notifyListeners) {
                    //childAddToStage.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                    var j = 0;
                }
            }
        }
        child._setDirty();
        this._setSizeDirty();
        return child;
    };
    /**
     * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
     * @method egret.DisplayObjectContainer#removeChild
     * @param child {egret.DisplayObject} 要删除的 DisplayObject 实例。
     * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
     */
    DisplayObjectContainer.prototype.removeChild = function (child) {
        var index = this._children.indexOf(child);
        if (index >= 0) {
            return this._doRemoveChild(index);
        }
        else {
            egret.$error(1008);
            return null;
        }
    };
    /**
     * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。
     * @method egret.DisplayObjectContainer#removeChildAt
     * @param index {number} 要删除的 DisplayObject 的子索引。
     * @returns {egret.DisplayObject} 已删除的 DisplayObject 实例。
     */
    DisplayObjectContainer.prototype.removeChildAt = function (index) {
        if (index >= 0 && index < this._children.length) {
            return this._doRemoveChild(index);
        }
        else {
            egret.$error(1007);
            return null;
        }
    };
    DisplayObjectContainer.prototype._doRemoveChild = function (index, notifyListeners) {
        if (notifyListeners === void 0) { notifyListeners = true; }
        var locChildren = this._children;
        var child = locChildren[index];
        if (notifyListeners) {
            //child.dispatchEventWith(egret.Event.REMOVED, true);
            var i = 0;
        }
        if (this._DO_Props_._stage) {
            child._onRemoveFromStage();
            var list = DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST;
            while (list.length > 0) {
                var childAddToStage = list.shift();
                if (notifyListeners) {
                    //childAddToStage.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                    var j = 0;
                }
                childAddToStage._DO_Props_._stage = null;
            }
        }
        child._parentChanged(null);
        locChildren.splice(index, 1);
        this._setSizeDirty();
        return child;
    };
    /**
     * 返回位于指定索引处的子显示对象实例。
     * @method egret.DisplayObjectContainer#getChildAt
     * @param index {number} 子对象的索引位置。
     * @returns {egret.DisplayObject} 位于指定索引位置处的子显示对象。
     */
    DisplayObjectContainer.prototype.getChildAt = function (index) {
        if (index >= 0 && index < this._children.length) {
            return this._children[index];
        }
        else {
            egret.$error(1007);
            return null;
        }
    };
    /**
     * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
     * @method egret.DisplayObjectContainer#contains
     * @param child {egret.DisplayObject} 要测试的子对象。
     * @returns {boolean} 如果指定的显示对象为DisplayObjectContainer该实例本身，则返回true，如果指定的显示对象为当前实例子项，则返回false。
     */
    DisplayObjectContainer.prototype.contains = function (child) {
        while (child) {
            if (child == this) {
                return true;
            }
            child = child.parent;
        }
        return false;
    };
    /**
     * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
     * @method egret.DisplayObjectContainer#swapChildrenAt
     * @param index1 {number} 第一个子对象的索引位置。
     * @param index2 {number} 第二个子对象的索引位置。
     */
    DisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
        if (index1 >= 0 && index1 < this._children.length && index2 >= 0 && index2 < this._children.length) {
            this._swapChildrenAt(index1, index2);
        }
        else {
            egret.$error(1007);
        }
    };
    /**
     * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
     * @method egret.DisplayObjectContainer#swapChildren
     * @param child1 {egret.DisplayObject} 第一个子对象。
     * @param child2 {egret.DisplayObject} 第二个子对象。
     */
    DisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
        var index1 = this._children.indexOf(child1);
        var index2 = this._children.indexOf(child2);
        if (index1 == -1 || index2 == -1) {
            egret.$error(1008);
        }
        else {
            this._swapChildrenAt(index1, index2);
        }
    };
    DisplayObjectContainer.prototype._swapChildrenAt = function (index1, index2) {
        if (index1 == index2) {
            return;
        }
        var list = this._children;
        var child = list[index1];
        list[index1] = list[index2];
        list[index2] = child;
    };
    /**
     * 返回 DisplayObject 的 child 实例的索引位置。
     * @method egret.DisplayObjectContainer#getChildIndex
     * @param child {egret.DisplayObject} 要标识的 DisplayObject 实例。
     * @returns {number} 要标识的子显示对象的索引位置。
     */
    DisplayObjectContainer.prototype.getChildIndex = function (child) {
        return this._children.indexOf(child);
    };
    /**
     * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
     * @method egret.DisplayObjectContainer#removeChildren
     */
    DisplayObjectContainer.prototype.removeChildren = function () {
        var locChildren = this._children;
        for (var i = locChildren.length - 1; i >= 0; i--) {
            this._doRemoveChild(i);
        }
    };
    DisplayObjectContainer.prototype._updateTransform = function () {
        var o = this;
        if (!o._DO_Props_._visible) {
            return;
        }
        if (o._hasFilters()) {
            egret.RenderCommand.push(o._setGlobalFilters, o);
        }
        var mask = o.mask || o._DO_Props_._scrollRect;
        if (mask) {
            egret.RenderCommand.push(o._pushMask, o);
        }
        _super.prototype._updateTransform.call(this);
        if (!o._DO_Props_._cacheAsBitmap || !o._texture_to_render) {
            for (var i = 0, children = o._children, length = children.length; i < length; i++) {
                var child = children[i];
                child._updateTransform();
            }
        }
        if (mask) {
            egret.RenderCommand.push(o._popMask, o);
        }
        if (o._hasFilters()) {
            egret.RenderCommand.push(o._removeGlobalFilters, o);
        }
    };
    DisplayObjectContainer.prototype._render = function (renderContext) {
        if (!egret.MainContext.__use_new_draw) {
            var o = this;
            for (var i = 0, children = o._children, length = children.length; i < length; i++) {
                var child = children[i];
                child._draw(renderContext);
            }
        }
    };
    /**
     * @see egret.DisplayObject._measureBounds
     * @returns {null}
     * @private
     */
    DisplayObjectContainer.prototype._measureBounds = function () {
        var o = this;
        var minX = 0, maxX = 0, minY = 0, maxY = 0;
        var children = o._children;
        var l = children.length;
        for (var i = 0; i < l; i++) {
            var child = children[i];
            if (!child.visible) {
                continue;
            }
            var childBounds = child.getBounds(Rectangle.identity, false);
            var childBoundsX = childBounds.x;
            var childBoundsY = childBounds.y;
            var childBoundsW = childBounds.width;
            var childBoundsH = childBounds.height;
            var childMatrix = child._getMatrix();
            var bounds = DisplayObject.getTransformBounds(Rectangle.identity.initialize(childBoundsX, childBoundsY, childBoundsW, childBoundsH), childMatrix);
            var x1 = bounds.x, y1 = bounds.y, x2 = bounds.width + bounds.x, y2 = bounds.height + bounds.y;
            if (x1 < minX || i == 0) {
                minX = x1;
            }
            if (x2 > maxX || i == 0) {
                maxX = x2;
            }
            if (y1 < minY || i == 0) {
                minY = y1;
            }
            if (y2 > maxY || i == 0) {
                maxY = y2;
            }
        }
        return Rectangle.identity.initialize(minX, minY, maxX - minX, maxY - minY);
    };
    /**
     * 检测指定坐标是否在显示对象内
     * @method egret.DisplayObjectContainer#hitTest
     * @see egret.DisplayObject.hitTest
     * @param x {number} 检测坐标的x轴
     * @param y {number} 检测坐标的y轴
     * @param ignoreTouchEnabled {boolean} 是否忽略TouchEnabled
     * @returns {egret.DisplayObject} 返回所发生碰撞的DisplayObject对象
     */
    DisplayObjectContainer.prototype.hitTest = function (x, y, ignoreTouchEnabled) {
        if (ignoreTouchEnabled === void 0) { ignoreTouchEnabled = false; }
        var o = this;
        var result;
        if (!o._DO_Props_._visible) {
            return null;
        }
        if (o._DO_Props_._scrollRect) {
            if (x < o._DO_Props_._scrollRect.x || y < o._DO_Props_._scrollRect.y || x > o._DO_Props_._scrollRect.x + o._DO_Props_._scrollRect.width || y > o._DO_Props_._scrollRect.y + o._DO_Props_._scrollRect.height) {
                return null;
            }
        }
        else if (o.mask) {
            if (o.mask.x > x || x > o.mask.x + o.mask.width || o.mask.y > y || y > o.mask.y + o.mask.height) {
                return null;
            }
        }
        var children = o._children;
        var l = children.length;
        var touchChildren = o._touchChildren; //这里不用考虑父级的touchChildren，从父级调用下来过程中已经判断过了。
        for (var i = l - 1; i >= 0; i--) {
            var child = children[i];
            var mtx = child._getMatrix();
            //todo
            var scrollRect = child.scrollRect;
            if (scrollRect) {
                mtx.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
            }
            mtx.invert();
            var point = egret.Matrix.transformCoords(mtx, x, y);
            var childHitTestResult = child.hitTest(point.x, point.y, true);
            if (childHitTestResult) {
                if (!touchChildren) {
                    return o;
                }
                if (childHitTestResult._DO_Props_._touchEnabled && touchChildren) {
                    return childHitTestResult;
                }
                result = o;
            }
        }
        if (result) {
            return result;
        }
        else if (o._texture_to_render) {
            return _super.prototype.hitTest.call(this, x, y, ignoreTouchEnabled);
        }
        return null;
    };
    DisplayObjectContainer.prototype._onAddToStage = function () {
        var o = this;
        _super.prototype._onAddToStage.call(this);
        var children = o._children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var child = this._children[i];
            child._onAddToStage();
        }
    };
    DisplayObjectContainer.prototype._onRemoveFromStage = function () {
        var o = this;
        _super.prototype._onRemoveFromStage.call(this);
        var children = o._children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var child = children[i];
            child._onRemoveFromStage();
        }
    };
    /**
     * 返回具有指定名称的子显示对象。
     * @method egret.DisplayObjectContainer#getChildByName
     * @param name {string} 要返回的子项的名称。
     * @returns {egret.DisplayObject} 具有指定名称的子显示对象。
     */
    DisplayObjectContainer.prototype.getChildByName = function (name) {
        var locChildren = this._children;
        var length = locChildren.length;
        var displayObject;
        for (var i = 0; i < length; i++) {
            displayObject = locChildren[i];
            if (displayObject.name == name) {
                return displayObject;
            }
        }
        return null;
    };
    DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST = [];
    DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST = [];
    return DisplayObjectContainer;
})(DisplayObject);
