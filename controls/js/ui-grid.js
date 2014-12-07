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

UIGrid.ITEM_FIXED_HEIGHT = 0;
UIGrid.ITEM_FIXED_ROWS   = 1;
UIGrid.ITEM_FIXED_WIDTH = 0;
UIGrid.ITEM_FIXED_COLS  = 1;

UIGrid.prototype = new UIElement();
UIGrid.prototype.isUIGrid = true;
UIGrid.prototype.isUILayout = true;

UIGrid.prototype.gridToJson = function(o) {
	o.spacer = this.spacer;
	o.itemWidth = this.itemWidth;
	o.itemHeight = this.itemHeight;
	o.itemWidthType = this.itemWidthType;
	o.itemHeightType = this.itemHeightType;
	o.scrollDirection = this.scrollDirection;

	return;
}

UIGrid.prototype.gridFromJson = function(js) {
	if(js.itemWidth) {
		this.itemWidth = js.itemWidth;
		this.itemWidthType = js.itemWidthType;
	}
	
	if(js.itemHeight) {
		this.itemHeight = js.itemHeight;
		this.itemHeightType = js.itemHeightType;
	}

	if(js.spacer) {
		this.spacer = js.spacer;
	}

	if(js.scrollDirection) {
		this.scrollDirection = js.scrollDirection;
	}

	return;
}

UIGrid.prototype.initUIGrid = function(type, border, itemSize, bg) {
	var size = itemSize * 3 + 2 * border;
	var minSize = itemSize + 2 * border;

	this.initUIElement(type);	

	this.spacer = 0;
	this.offset = 0;
	this.setDefSize(size, size);
	this.setMargin(border, border);
	this.setSizeLimit(minSize, minSize, 2000, 2000);

	this.itemSize = itemSize;
	this.itemWidth = itemSize;
	this.itemHeight = itemSize;
	this.itemWidthType = UIGrid.ITEM_FIXED_WIDTH;
	this.itemHeightType = UIGrid.ITEM_FIXED_HEIGHT;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.regSerializer(this.gridToJson, this.gridFromJson);
	this.rectSelectable = false;
	this.addEventNames(["onChildDragged", "onChildDragging", "onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIGrid.prototype.setRows = function(value) {
	if(value < 20) {
		this.itemHeightType = UIGrid.ITEM_FIXED_ROWS;
	}
	else {
		this.itemHeightType = UIGrid.ITEM_FIXED_HEIGHT;
	}
	this.itemHeight = value;

	return;
}

UIGrid.prototype.getRows = function() {
	if(this.itemHeightType === UIGrid.ITEM_FIXED_ROWS) {
		return this.itemHeight;
	}
	else {
		return Math.floor(this.getHeight(true)/(this.itemHeight+this.spacer));
	}

	return;
}

UIGrid.prototype.setCols = function(value) {
	if(value < 20) {
		this.itemWidthType = UIGrid.ITEM_FIXED_COLS;
	}
	else {
		this.itemWidthType = UIGrid.ITEM_FIXED_WIDTH;
	}

	this.itemWidth = value;

	return;
}

UIGrid.prototype.getCols = function() {
	if(this.itemWidthType === UIGrid.ITEM_FIXED_COLS) {
		return this.itemWidth;
	}
	else {
		return Math.floor(this.getWidth(true)/(this.itemWidth+this.spacer));
	}
}

UIGrid.prototype.getChildAt = function(row, col) {
	var cols = this.getCols();
	var index = row * cols + col;

	if(index < this.children.length) {
		return this.children[index];
	}
	else {
		return null;
	}
}

UIGrid.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGrid.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-last";
}

UIGrid.prototype.afterPaintChildren =function(canvas) {
	if(this.mode !== Shape.MODE_EDITING) {
		return;
	}
	
	var rows = 0;
	var cols = 0;
	var offset = 0;
	var x = this.vMargin;
	var y = this.hMargin;
	var w = this.w;
	var h = this.h;

	rows = this.rows ? this.rows : 3;
	cols = this.cols ? this.cols : 3;

	drawDashedRect(canvas, x, y, w, h);
	for(var i = 1; i < rows; i++) {
		offset = (h * i)/rows;
		drawDashedLine(canvas, {x:x, y:offset}, {x:w, y:offset}, 8, 4);
	}
	
	for(var i = 1; i < cols; i++) {
		offset = (w * i)/cols;
		drawDashedLine(canvas, {x:offset, y:y}, {x:offset, y:h}, 8, 4);
	}

	canvas.lineWidth = this.style.lineWidth;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

UIGrid.prototype.calcItemSize = function() {
	var iw = 0;
	var ih = 0;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	
	if(this.itemWidthType === UIGrid.ITEM_FIXED_COLS) {
		iw = w/this.itemWidth - this.spacer;
	}
	else {
		var cols = Math.floor(w/this.itemWidth);
		iw = Math.floor(w/cols);
	}

	if(this.itemHeightType === UIGrid.ITEM_FIXED_ROWS) {
		ih = h/this.itemHeight - this.spacer;
	}
	else {
		var rows = Math.floor(h/this.itemHeight);
		ih = Math.floor(h/rows);
	}

	return {w:Math.floor(iw), h:Math.floor(ih)};
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

UIGrid.prototype.getChildIndexByPosition = function(point) {
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
	var targetChildIndex = this.getChildIndexByPosition(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggingHandler(sourceChildIndex, targetChildIndex);

	return;
}

UIGrid.prototype.onChildDragged = function(child, point) {
	var targetChildIndex = this.getChildIndexByPosition(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggedHandler(sourceChildIndex, targetChildIndex);
	
	this.relayoutChildren("default");

	return;
}

UIGrid.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var spacer = this.spacer;
	var border = this.getHMargin();
	var itemSize = this.calcItemSize();

	var r = 0;
	var c = 0;
	var vborder = 0;
	var hborder = 0;
	var x = border;
	var y = border;
	var pageIndex = 0;
	var w = this.getWidth(true);
	var h = this.getHeight(true);

	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	vborder = border;
	hborder = (this.w - cols * itemW)/2;

	this.cols = cols;
	this.rows = rows;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
	
		r = Math.floor(i/cols);
		c = Math.floor(i%cols);
	
		x = hborder + c * itemW;
		y = vborder + r * itemH;

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

UIGrid.prototype.triggerUserEditingMode = function() {
	if(this.mode === Shape.MODE_EDITING) {
		return;
	}

	this.userEditingMode = !this.userEditingMode;

	var grid = this;
	function redrawGrid() {
		grid.postRedraw();

		if(grid.userEditingMode) {
			setTimeout(redrawGrid, 20);
		}
	}

	redrawGrid();

	return;
}

UIGrid.prototype.isInUserEditingMode = function() {
	return this.userEditingMode && this.mode != Shape.MODE_EDITING;
}

UIGrid.prototype.beforePaintChild = function(child, canvas) {
	if(this.isInUserEditingMode()) {
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
	if(this.isInUserEditingMode()) {
		var image = this.getHtmlImageByType(UIElement.IMAGE_DELETE_ITEM);

		if(image && image.width > 0) {
			var y = child.y + child.vMargin;
			var x = child.x + child.w - image.width - child.hMargin;
			canvas.drawImage(image, x, y);
		}

		canvas.restore();
	}

	return;
}

function UIGridCreator(border, itemSize, bg) {
	var args = ["ui-grid", "ui-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();
		return g.initUIGrid(this.type, border, itemSize, bg);
	}
	
	return;
}


