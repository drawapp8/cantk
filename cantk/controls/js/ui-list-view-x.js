/*
 * File:   ui-list-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ListView
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIListViewX
 * @extends UIScrollViewX
 * 列表视图，可以水平滚动，也可以垂直滚动。
 *
 * 垂直的列表视图和只有一列垂直的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的高度。
 * 水平的列表视图和只有一行水平的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的宽度。
 * 
 * 设计时按住Alt可以拖动可视区，调节子控件的zIndex可以设置子控件的顺序。
 *
 */
function UIListViewX() {
	return;
}

UIListViewX.prototype = new UIScrollViewX();
UIListViewX.prototype.isUILayout = true;
UIListViewX.prototype.isUIListViewX = true;
UIListViewX.prototype.saveProps = UIScrollViewX.prototype.saveProps.concat(["cols","rows","isVertical", "itemSize"]);

UIListViewX.prototype.initUIListViewX = function(type) {
	this.initUIScrollViewX(type);	

	this.itemSize = 100;
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
UIListViewX.prototype.setVertical = function(value) {
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
UIListViewX.prototype.getVertical = function() {
	return this.isVertical;
}

/**
 * @method setItemSize
 * 设置子控件的大小。
 *
 * 列表视图为垂直方向时，指单项的高度，0表示使用子控件原来的高度，否则使用指定的高度。
 *
 * 列表视图为水平方向时，指单项的宽度，0表示使用子控件原来的宽度，否则使用指定的宽度。
 *
 * @param {Number} value 设置子控件的大小。
 * @return {UIElement} 返回控件本身。
 *
 */
UIListViewX.prototype.setItemSize = function(value) {
	this.itemSize = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getItemSize
 * 
 * @return {UIElement} 返回单项的高度(垂直)或宽度(水平)。
 *
 */
UIListViewX.prototype.getItemSize = function() {
	return this.itemSize;
}

UIListViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;
UIListViewX.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var arr = this.children;
	var n = arr.length;
	var spacer = this.spacer || 0;
	var itemSize = this.itemSize;
	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;

	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(!iter.visible) {
			continue;
		}

		if(this.isVertical) {
			iter.left = 0;
			iter.w = w;
			iter.h = itemSize || iter.h;
			iter.y = y;
			y += iter.h + spacer;
		}
		else {
			iter.top = 0;
			iter.h = h;
			iter.w = itemSize || iter.w;
			iter.x = x;
			x += iter.w + spacer;
		}
		iter.setUserMovable(false);
		iter.setUserResizable(false);
	}

	if(this.isVertical) {
		this.vw = this.w;
		this.vh = y;
		if(this.isInDesignMode()) {
			this.vh += itemSize || 80;
		}
	}
	else {
		this.vh = this.h;
		this.vw = x;
		if(this.isInDesignMode()) {
			this.vw += itemSize || 80;
		}
	}

	this.xOffset = 0;
	this.yOffset = 0;

	return;
}

UIListViewX.prototype.isChildVisibleRecursive = function(child) {
	return false;
}

UIListViewX.prototype.isDraggable = function() {
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

function UIListViewXCreator(border) {
	var args = ["ui-list-view-x", "ui-list-view-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListViewX();
		return g.initUIListViewX(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListViewXCreator());

