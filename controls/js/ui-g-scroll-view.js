/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollViewGeneral() {
	return;
}

UIVScrollViewGeneral.prototype = new UIVScrollView();
UIVScrollViewGeneral.prototype.isUIList = true;
UIVScrollViewGeneral.prototype.isUILayout = true;
UIVScrollViewGeneral.prototype.isUIVScrollViewGeneral = true;
UIVScrollViewGeneral.prototype.sortChildren = UIList.prototype.sortChildren;

UIVScrollViewGeneral.prototype.initUIVScrollViewGeneral = function(type) {
	this.initUIVScrollView(type, 0, null, null);	
	this.setTextType(Shape.TEXT_NONE);

	return this;
}

UIVScrollViewGeneral.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}
	var border = this.getVMargin();
	var n = this.children.length;
	
	var y = border;
	for(var i = 0; i < n; i++) {
		var child = this.children[i];
		if(!child.visible) {
			continue;
		}
		
		child.yAttr = UIElement.Y_FIX_TOP;
		child.heightAttr = UIElement.HEIGHT_FIX;
		child.relayout();
		child.y = y;
		
		y += child.h;
	}

	return;
}

UIVScrollViewGeneral.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.mode === Shape.MODE_EDITING) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIVScrollViewGeneralCreator() {
	var args = ["ui-g-scroll-view", "ui-g-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollViewGeneral();
		return g.initUIVScrollViewGeneral(this.type);
	}
	
	return;
}

