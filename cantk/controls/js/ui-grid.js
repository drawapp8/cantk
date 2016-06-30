/*
 * File:   ui-grid.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGrid
 * @extends UIElement
 * 网格容器，里面的子控件按行列排列，每个子控件大小相同。
 *
 */
function UIGrid() {
	return;
}

UIGrid.prototype = new UIElement();
UIGrid.prototype.isUIGrid = true;
UIGrid.prototype.isUILayout = true;

UIGrid.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.cols = this.cols;
	o.rows = this.rows;
	o.spacer = this.spacer;
	o.scrollDirection = this.scrollDirection;

	return o;
}

UIGrid.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.cols = js.cols;
	this.rows = js.rows;
	this.spacer = js.spacer;
	this.scrollDirection = js.scrollDirection;

	return js;
}

UIGrid.prototype.initUIGrid = function(type) {
	this.initUIElement(type);	

	this.spacer = 0;
	this.offset = 0;
	this.setMargin(0, 0);
	this.setDefSize(200, 200);

	this.rows = 3;
	this.cols = 3;
	this.checkable = false;
	this.rectSelectable = false;
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.setImage(UIElement.IMAGE_CHECKED_ITEM, null);
	this.addEventNames(["onChildDragged", "onChildDragging", "onInit"]);

	return this;
}

/**
 * @method setRows
 * 设置行数。
 * @param {Number} value 行数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setRows = function(value) {
	this.rows = value;

	return this;
}

/**
 * @method getRows
 * 获取行数。
 * @return {Number} 返回行数。
 *
 */
UIGrid.prototype.getRows = function() {
	return this.rows;
}

/**
 * @method setCols
 * 设置列数。
 * @param {Number} value 列数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setCols = function(value) {
	this.cols = value;

	return this;
}

/**
 * @method getCols
 * 获取列数。
 * @return {Number} 返回列数。
 *
 */
UIGrid.prototype.getCols = function() {
	return this.cols;
}

/**
 * @method isCheckable
 * 检查是否进入勾选模式。
 * @return {Boolean} 是否进入勾选模式。
 *
 */
UIGrid.prototype.isCheckable = function(value) {
	return this.checkable;
}

/**
 * @method setCheckable
 * 设置是否进入勾选模式。进入勾选模式后可以勾选子控件。
 * (记得在IDE中设置网格的勾选子项的图标)
 * @param {Boolean} value 是否进入勾选模式。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setCheckable = function(value) {
	this.checkable = value;

	return this;
}

/**
 * @method setChildChecked
 * 勾选指定的子控件。
 * @param {Number} index 子控件的索引。
 * @param {Boolean} checked 是否勾选。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setChildChecked = function(index, checked) {
	if(index >= 0 && index < this.children.length) {
		this.children[index].checked = checked; 
	}

	return this;
}

/**
 * @method isChildChecked
 * 检查指定的子控件是否勾选。
 * @param {Number} index 子控件的索引。
 * @return {Boolean} 返回子控件是否勾选。
 *
 */
UIGrid.prototype.isChildChecked = function(index) {
	if(index < this.children.length) {
		return this.children[index].checked; 
	}

	return false;
}

/**
 * @method getChildByRowCol
 * 通过行列数获取对应的子控件。
 * @param {Number} row 行数。
 * @param {Number} col 列数。
 * @return {UIElement} 返回子控件。
 *
 */
UIGrid.prototype.getChildByRowCol = function(row, col) {
	var cols = this.getCols();
	var index = row * cols + col;

	if(index < this.children.length) {
		return this.children[index];
	}
	else {
		return null;
	}
}

/**
 * @method getChildRow
 * 获取指定子控件所在的行数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回行数。
 *
 */
UIGrid.prototype.getChildRow = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	return Math.floor(index/cols);
}

/**
 * @method getChildCol
 * 获取指定子控件所在的列数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回列数。
 *
 */
UIGrid.prototype.getChildCol = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	return index%cols;
}

/**
 * @method exchangeTwoChildren
 * 交换两个子控件的位置。
 * @param {Number} child1Index 子控件1的索引。
 * @param {Number} child2Index 子控件2的索引。
 * @param {Boolean} enableAnimation 是否启用动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.exchangeTwoChildren = function(child1Index, child2Index, enableAnimation) {
	var n = this.children.length;
	if(child1Index < 0 || child1Index >= n || child2Index < 0 || child2Index >= n) {
		return this;
	}

	var child = this.children[child1Index];
	this.children[child1Index] = this.children[child2Index];
	this.children[child2Index] = child;

	this.relayoutChildren(enableAnimation);

	return this;
}

UIGrid.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGrid.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-last";
}

UIGrid.prototype.calcItemSize = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);

	var iw = Math.floor(w/this.cols);
	var ih = Math.floor(h/this.rows);

	return {w:iw, h:ih, cols:this.cols, rows:this.rows};
}

UIGrid.prototype.sortChildren = function() {}

UIGrid.prototype.getChildIndexByPoint = function(point) {
	var border = this.getHMargin();
	var itemSize = this.calcItemSize();
	
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	var r = Math.floor((point.y - border)/itemSize.h);
	var c = Math.floor((point.x - border)/itemSize.w);

	var index = r * cols + c;

	return index;
}

UIGrid.prototype.onChildDragging = function(child, point) {
	var targetChildIndex = this.getChildIndexByPoint(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggingHandler(sourceChildIndex, targetChildIndex);

	return;
}

UIGrid.prototype.onChildDragged = function(child, point) {
	var targetChildIndex = this.getChildIndexByPoint(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggedHandler(sourceChildIndex, targetChildIndex);
	
	this.relayoutChildren("default");

	return;
}

UIGrid.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var r = 0;
	var c = 0;
	var x = 0;
	var y = 0;
	var cols = this.cols;
	var rows = this.rows;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var iw = Math.floor((w - (cols-1)*spacer)/cols);
	var ih = Math.floor((h - (rows-1)*spacer)/rows);
	var itemW = iw + spacer;
	var itemH = ih + spacer;

	var vMargin = (this.h - rows * itemH) >> 1;
	var hMargin = (this.w - cols * itemW) >> 1;

	var i = 0;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];
		child.z = k;
		if(child.removed || !child.visible) continue;

		r = Math.floor(i/cols);
		c = Math.floor(i%cols);
	
		x = hMargin + c * itemW;
		y = vMargin + r * itemH;

		child.setSize(iw, ih);
		if(animHint || this.isInDesignMode()) {
			child.animMove(x, y, animHint);
		}
		else {
			child.move(x, y);
		}

		child.xAttr = UIElement.X_FIX_LEFT;
		child.yAttr = UIElement.Y_FIX_TOP;
		child.widthAttr = UIElement.WIDTH_FIX;
		child.heightAttr = UIElement.HEIGHT_FIX;
		child.setUserMovable(true);
		child.setUserResizable(false);
		child.relayoutChildren();
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}

		i++;
	}

	return;
}

UIGrid.prototype.afterChildAppended = function(shape) {
	if(this.isInDesignMode() && !this.disableRelayout) {
		this.sortChildren();
	}

	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.setDraggable(this.itemDraggable);

	shape.xAttr = UIElement.X_FIX_LEFT;
	shape.yAttr = UIElement.Y_FIX_TOP;
	shape.widthAttr = UIElement.WIDTH_FIX;
	shape.heightAttr = UIElement.HEIGHT_FIX;

	if(this.isInDesignMode() && !this.disableRelayout) {
		this.relayoutChildren();
	}

	return true;
}

UIGrid.prototype.triggerDeleteMode = function() {
	if(this.isInDesignMode()) {
		return;
	}

	this.deleteMode = !this.deleteMode;

	var grid = this;
	function redrawGrid() {
		grid.postRedraw();

		if(grid.deleteMode) {
			setTimeout(redrawGrid, 20);
		}
	}

	redrawGrid();

	return;
}

UIGrid.prototype.isInDeleteMode = function() {
	return this.deleteMode && !this.isInDesignMode();
}

UIGrid.prototype.beforePaintChild = function(child, canvas) {
	if(this.isInDeleteMode()) {
		canvas.save();
		var cx = child.left + child.w/2;
		var cy = child.top + child.h/2;
		var t = canvas.now/1000;
		var angle = 0.03 * Math.cos(20*t);

		canvas.translate(cx, cy);
		canvas.rotate(angle);
		canvas.translate(-cx, -cy);
	}

	return;
}

UIGrid.prototype.afterPaintChild = function(child, canvas) {
	if(this.isInDeleteMode()) {
		var wImage = this.getImageByType(UIElement.IMAGE_DELETE_ITEM);
		if(WImage.isValid(wImage)) {
			var image = wImage.getImage();
			var srcRect = wImage.getImageRect();
			var y = child.top + child.vMargin;
			var x = child.left + child.w - srcRect.w - child.hMargin;

			canvas.drawImage(image, x, y);
			WImage.draw(canvas, image, WImage.DISPLAY_CENTER, x, y, srcRect.w, srcRect.h, srcRect);
		}

		canvas.restore();

		return;
	}

	if(this.checkable) {
		if(child.checked) {
			var wImage = this.getImageByType(UIElement.IMAGE_CHECKED_ITEM);
			if(WImage.isValid(wImage)) {
				var image = wImage.getImage();
				var srcRect = wImage.getImageRect();
				WImage.draw(canvas, image, WImage.DISPLAY_AUTO_SIZE_DOWN, child.left, child.top, child.w, child.h, srcRect);
			}
		}
	}

	return;
}

function UIGridCreator(border) {
	var args = ["ui-grid", "ui-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();
		return g.initUIGrid(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridCreator());

