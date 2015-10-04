/*
 * File:   ui-grid.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIGrid() {
	return;
}

UIGrid.prototype = new UIElement();
UIGrid.prototype.isUIGrid = true;
UIGrid.prototype.isUILayout = true;

UIGrid.prototype.gridToJson = function(o) {
	o.spacer = this.spacer;
	o.itemWidth = this.itemWidth;
	o.itemHeight = this.itemHeight;
	o.scrollDirection = this.scrollDirection;

	return;
}

UIGrid.prototype.gridFromJson = function(js) {
	if(js.itemWidth) {
		this.itemWidth = js.itemWidth;
	}
	
	if(js.itemHeight) {
		this.itemHeight = js.itemHeight;
	}

	if(js.spacer) {
		this.spacer = js.spacer;
	}

	if(js.scrollDirection) {
		this.scrollDirection = js.scrollDirection;
	}

	return;
}

UIGrid.prototype.initUIGrid = function(type) {
	this.initUIElement(type);	

	this.spacer = 0;
	this.offset = 0;
	this.setMargin(5, 5);
	this.setDefSize(200, 200);

	this.checkable = false;
	this.itemSize = 150;
	this.itemWidth = 150;
	this.itemHeight = 150;
	this.rectSelectable = false;
	this.setTextType(Shape.TEXT_NONE);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.setImage(UIElement.IMAGE_CHECKED_ITEM, null);
	this.regSerializer(this.gridToJson, this.gridFromJson);
	this.addEventNames(["onChildDragged", "onChildDragging", "onInit"]);

	return this;
}

UIGrid.prototype.setCheckable = function(value) {
	this.checkable = value;

	return this;
}

UIGrid.prototype.setChildChecked = function(index, checked) {
	if(index < this.children.length) {
		this.children[index].checked = checked; 
	}

	return this;
}

UIGrid.prototype.isChildChecked = function(index) {
	if(index < this.children.length) {
		return this.children[index].checked; 
	}

	return false;
}

UIGrid.prototype.setRows = function(value) {
	this.itemHeight = value;
	this.calcItemSize();

	return;
}

UIGrid.prototype.getRows = function() {
	return this.calcItemSize().rows;
}

UIGrid.prototype.setCols = function(value) {
	this.itemWidth = value;
	this.calcItemSize();

	return;
}

UIGrid.prototype.getCols = function() {
	return this.calcItemSize().cols;
}

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

UIGrid.prototype.getChildRow = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	if(index < 0) return;

	return Math.floor(index/cols);
}

UIGrid.prototype.getChildCol = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	if(index < 0) return;

	return index%cols;
}

UIGrid.prototype.exchangeTwoChildren = function(child1Index, child2Index, enableAnimation) {
	var n = this.children.length;
	if(child1Index < 0 || child1Index >= n || child2Index < 0 || child2Index >= n) {
		return;
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
	var iw = 0;
	var ih = 0;
	var cols = 0;
	var rows = 0;
	var w = this.getWidth(true);
	var h = this.getHeight(true);

	if(this.itemWidth < 20) {
		iw = w/this.itemWidth - this.spacer;
		cols = Math.floor(w/iw);	
	}
	else {
		cols = Math.floor(w/this.itemWidth);
		iw = Math.floor(w/cols);
	}

	if(this.itemHeight < 1) {
		ih = iw * this.itemHeight;
	}
	else if(this.itemHeight < 20) {
		ih = Math.floor(h/this.itemHeight - this.spacer);
	}
	else {
		rows = Math.floor(h/this.itemHeight);
		ih = Math.floor(h/rows);
	}
	rows = Math.floor(h/ih);

	return {w:Math.floor(iw), h:Math.floor(ih), cols:cols, rows:rows};
}

UIGrid.prototype.sortChildren = function() {
	var itemSize = this.calcItemSize();
	var itemH = itemSize.h;
	var iterW = itemSize.w;

	this.children.sort(function(a, b) {
		var aa = 0;
		var bb = 0;
		var ar = Math.floor((a.y + 5)/itemH);
		var br = Math.floor((b.y + 5)/itemH);
		
		if(ar === br) {
			bb = b.x;
			aa = (b.pointerDown && b.hitTestResult === Shape.HIT_TEST_MM) ? (a.x + a.w) : a.x;
		}
		else {
			aa = ar;
			bb = br;
		}

		return aa - bb;
	});

	return;
}

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

	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var spacer = this.spacer;
	var itemSize = this.calcItemSize();
	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	var vMargin = (this.h - rows * itemH) >> 1;
	var hMargin = (this.w - cols * itemW) >> 1;

	this.cols = cols;
	this.rows = rows;

	var i = 0;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];

		if(child.removed || !child.visible) continue;

		r = Math.floor(i/cols);
		c = Math.floor(i%cols);
	
		x = hMargin + c * itemW;
		y = vMargin + r * itemH;

		if(animHint || this.mode === Shape.MODE_EDITING) {
			child.animMove(x, y, animHint);
		}
		else {
			child.move(x, y);
		}

		child.xAttr = UIElement.X_FIX_LEFT;
		child.yAttr = UIElement.Y_FIX_TOP;
		child.widthAttr = UIElement.WIDTH_FIX;
		child.heightAttr = UIElement.HEIGHT_FIX;
		child.setSize(itemSize.w, itemSize.h);
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
	if(shape.view && this.mode === Shape.MODE_EDITING && shape.isCreatingElement()) {
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

	return true;
}

UIGrid.prototype.triggerDeleteMode = function() {
	if(this.mode === Shape.MODE_EDITING) {
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
	return this.deleteMode && this.mode != Shape.MODE_EDITING;
}

UIGrid.prototype.beforePaintChild = function(child, canvas) {
	if(this.isInDeleteMode()) {
		canvas.save();
		var cx = child.x + child.w/2;
		var cy = child.y + child.h/2;
		var t = (new Date()).getTime()/1000;
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
			var y = child.y + child.vMargin;
			var x = child.x + child.w - srcRect.w - child.hMargin;

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
				WImage.draw(canvas, image, WImage.DISPLAY_AUTO, child.x, child.y, child.w, child.h, srcRect);
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

