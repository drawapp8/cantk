/*
 * File:   ui-list.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIList() {
	return;
}

UIList.prototype = new UIElement();
UIList.prototype.isUIList = true;
UIList.prototype.isUILayout = true;

UIList.prototype.initUIList = function(type, border, itemHeight, bg) {
	this.initUIElement(type);	

	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 1000, 1000);
	this.setDefSize(400, itemHeight * 3 + 2 * border);

	this.itemHeight = itemHeight;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.rectSelectable = false;
	this.itemHeightVariable = false;
	this.addEventNames(["onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIList.prototype.getItemHeight = function() {
	return this.itemHeight;
}

UIList.prototype.setItemHeight = function(itemHeight) {
	this.itemHeight = itemHeight;

	return;
}

UIList.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIListItem) {
		return false;
	}

	return true;
}

UIList.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-list-item-update-status" 
		|| child.name === "ui-list-item-update-tips"
		|| child.name === "ui-last"
		|| child.name.indexOf("prebuild") >= 0
		|| child.name.indexOf("builtin") >= 0;
}

UIList.FIRST_ITEM = -1;
UIList.LAST_ITEM =   1;
UIList.MIDDLE_ITEM = 0;
UIList.SINGLE_ITEM = 2;

UIList.prototype.fixListItemImage = function(item, position) {
	var images = item.images;
	for(var key in images) {
		var value = images[key];
		if(key != "display") {
			var src = value.getImageSrc();
			if(!src) {
				continue;
			}

			switch(position) {
				case UIList.FIRST_ITEM: {
					src = src.replace(/\.single\./, ".first.");
					src = src.replace(/\.middle\./, ".first.");
					src = src.replace(/\.last\./, ".first.");
					break;
				}
				case UIList.MIDDLE_ITEM: {
					src = src.replace(/\.single\./, ".middle.");
					src = src.replace(/\.first\./, ".middle.");
					src = src.replace(/\.last\./, ".middle.");
					break;
				}
				case UIList.LAST_ITEM: {
					src = src.replace(/\.single\./, ".last.");
					src = src.replace(/\.first\./, ".last.");
					src = src.replace(/\.middle\./, ".last.");
					break;
				}
				case UIList.SINGLE_ITEM: {
					src = src.replace(/\.first\./, ".single.");
					src = src.replace(/\.middle\./, ".single.");
					src = src.replace(/\.last\./, ".single.");
					break;
				}
			}

			value.setImageSrc(src);
		}
	}

	return;
}

UIList.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var itemHeight = this.getItemHeight();
	var h = itemHeight;
	var n = this.children.length;
	var itemHeightVariable = this.itemHeightVariable;

	for(var i = 0; i < n; i++) {
		var config = {};
		var animatable = false;
		var child = this.children[i];

		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(itemHeight);
		}
		else {
			h = itemHeight;
		}

		if(n === 1) {
			this.fixListItemImage(child, UIList.SINGLE_ITEM);
		}
		else if(i === 0) {
			this.fixListItemImage(child, UIList.FIRST_ITEM);	
		}
		else if(i === (n - 1)) {
			this.fixListItemImage(child, UIList.LAST_ITEM);	
		}
		else {
			this.fixListItemImage(child, UIList.MIDDLE_ITEM);	
		}

		if(this.h <= (y + vMargin + h)) {
			this.h = y + vMargin + h;
		}

		
		animatable =  (y < this.h) && (animHint || this.mode === Shape.MODE_EDITING);
		if(animatable) {
			child.setSize(w, h);
			config.xStart = child.x;
			config.yStart = child.y;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (el) {
				el.relayoutChildren();
			}
			
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.setUserMovable(true);
	
		child.widthAttr = UIElement.WIDTH_FILL_PARENT;
		if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
			child.heightAttr = UIElement.HEIGHT_FIX;
		}
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}

		y += h;
	}

	return;
}

UIList.prototype.beforePaintChildren = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	return;
}

UIList.prototype.afterPaintChildren = function(canvas) {
	return;
}

UIList.prototype.afterChildAppended = function(shape) {
	if(shape.view && this.mode === Shape.MODE_EDITING && shape.isCreatingElement()) {
		this.sortChildren();
	}
	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.autoAdjustHeight = this.itemHeightVariable;
	shape.setDraggable(this.itemDraggable);

	return true;
}

UIList.prototype.sortChildren = function() {
	this.children.sort(function(a, b) {
		var bb = b.y;
		var aa = (b.pointerDown && b.hitTestResult === Shape.HIT_TEST_MM) ? (a.y + a.h*0.8) : a.y;

		return aa - bb;
	});

	return;
}

UIList.prototype.onKeyUpRunning = function(code) {
	var targetShapeIndex = 0;

	if(!this.children.length) {
		return;
	}

	switch(code) {
		case KeyEvent.DOM_VK_UP: {
			targetShapeIndex = this.children.indexOf(this.targetShape) - 1;
			break;
		}
		case KeyEvent.DOM_VK_DOWN: {
			targetShapeIndex = this.children.indexOf(this.targetShape) + 1;
			break;
		}
		default: {
			return;
		}
	}

	var n = this.children.length;
	targetShapeIndex = (targetShapeIndex + this.children.length)%n;
	var targetShape = this.children[targetShapeIndex];

	this.setTarget(targetShape);
	this.postRedraw();

	if(this.isUIListView) {
		if(this.offset > targetShape.y) {
			this.offset = targetShape.y;
		}

		if((this.offset + this.h) < (targetShape.y + targetShape.h)) {
			this.offset = targetShape.y - (this.h - targetShape.h);
		}
	}

	return;
}

UIList.prototype.onKeyDownRunning = function(code) {
}

UIList.prototype.getValue = function() {
	var ret = null;
	var n = this.children.length;
	if(n < 1) return ret;
	
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(!iter.isUIListCheckableItem || !iter.value) continue;

		if(iter.isRadio) {
			return i;	
		}
		else {
			if(!ret) ret = [];
			ret.push(i);
		}
	}

	return ret;
}

UIList.prototype.setValue = function(value) {
	var arr = null;
	if(typeof value === "array") {
		arr = value;
	}
	else if(typeof value === "number") {
		arr = [value];
	}
	else {
		arr = [];
	}

	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var item = this.children[i];
		if(item.isUIListCheckableItem) {
			item.setValue(false);
		}
	}

	for(var i = 0; i < arr.length; i++) {
		var index = arr[i];
		if(index >= 0 && index < n) {
			var item = this.children[index];
			if(item.isUIListCheckableItem) {
				item.setChecked(true);
			}
		}
	}

	return this;
}

function UIListCreator(border, itemHeight, bg) {
	var args = ["ui-list", "ui-list", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIList();
		return g.initUIList(this.type, border, itemHeight, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListCreator(5, 114, null));

