/*
 * File:   ui-grid-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  GridView
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGridViewX
 * @extends UIScrollViewX
 * 网格视图，里面的子控件按行列排列，每个子控件大小相同。可以水平滚动，也可以垂直滚动。
 * 
 * 设计时按住Alt可以拖动可视区，调节子控件的zIndex可以设置子控件的顺序。
 *
 */
function UIGridViewX() {
	return;
}

UIGridViewX.prototype = new UIScrollViewX();
UIGridViewX.prototype.isUILayout = true;
UIGridViewX.prototype.isUIGridViewX = true;
UIGridViewX.prototype.saveProps = UIScrollViewX.prototype.saveProps.concat(["cols","rows","isVertical"]);

UIGridViewX.prototype.initUIGridViewX = function(type) {
	this.initUIScrollViewX(type);	

	this.rows = 3;
	this.cols = 3;
	this.setMargin(0, 0);
	this.setDefSize(200, 200);

	return this;
}

/**
 * @method setVertical
 * 设置网格视图的滚动方向。
 * @param {Boolean} value true表示垂直滚动，false表示水平滚动。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setVertical = function(value) {
	this.isVertical = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getVertical
 * 获取网格视图的滚动方向。
 * @return {Boolean} 滚动方向。true表示垂直滚动，false表示水平滚动。
 *
 */
UIGridViewX.prototype.getVertical = function() {
	return this.isVertical;
}

/**
 * @method setRows
 * 设置可视区行数，主要用于控制行高。对于水平滚动的网格视图，这个行数与实际行数一致，对于垂直滚动的网格视图，这个行数与实际行数无关。
 * @param {Number} value 行数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setRows = function(value) {
	this.rows = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getRows
 * 获取行数。
 * @return {Number} 返回行数。
 *
 */
UIGridViewX.prototype.getRows = function() {
	return this.rows;
}

/**
 * @method setCols
 * 设置可视区列数，主要用于控制列宽。对于垂直滚动的网格视图，这个列数与实际列数一致，对于水平滚动的网格视图，这个列数与实际列数无关。
 * @param {Number} value 列数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setCols = function(value) {
	this.cols = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getCols
 * 获取列数。
 * @return {Number} 返回列数。
 *
 */
UIGridViewX.prototype.getCols = function() {
	return this.cols;
}

UIGridViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGridViewX.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var cols = this.cols;
	var rows = this.rows;
	var iw = this.w/cols;
	var ih = this.h/rows;

	var r = 0;
	var c = 0;
	var arr = this.children;
	var n = arr.length;
	var spacer = this.spacer;
	var iws = iw + spacer;
	var ihs = ih + spacer;

	var vi = 0;
	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(!iter.visible) {
			continue;
		}

		if(this.isVertical) {
			c = vi%cols;
			r = Math.floor(vi/cols);
		}
		else {
			r = vi%rows;
			c = Math.floor(vi/rows);
		}
		iter.left = c * iws;
		iter.top = r * ihs;
		iter.w = iw;
		iter.h = ih;
		iter.setUserMovable(false);
		iter.setUserResizable(false);

		vi++;
	}

	if(this.isVertical) {
		this.vw = this.w;
		this.vh = Math.ceil(n/this.cols) * ihs;
		if(this.isInDesignMode()) {
			this.vh += ihs;
		}
	}
	else {
		this.vh = this.h;
		this.vw = Math.ceil(n/this.rows) * iws;
		if(this.isInDesignMode()) {
			this.vw += iws;
		}
	}
    if(this.xOffset + this.w > this.vw) {
        this.xOffset = this.vw - this.w;
    }
    if(this.yOffset + this.h > this.vh) {
        this.yOffset = this.vh - this.h;
    }
	
    return;
}

UIGridViewX.prototype.isChildVisibleRecursive = function(child) {
	return false;
}

UIGridViewX.prototype.isDraggable = function() {
	if(this.isInDesignMode()) {
		if(this.hitTestResult !== Shape.HIT_TEST_MM) {
			return false;
		}

		var target = this.getTarget();
		return !target || !target.getTarget() || this.view.isAltDown();
	}
	else {
		return true;
	}
}

function UIGridViewXCreator(border) {
	var args = ["ui-grid-view-x", "ui-grid-view-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridViewX();
		return g.initUIGridViewX(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridViewXCreator());

