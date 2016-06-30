/*
 * File:   ui-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Layout
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UILayout() {
	return;
}

UILayout.prototype = new UIElement();
UILayout.prototype.isUILayout = true;

UILayout.prototype.initUILayout = function(type, w, h) {
	this.initUIElement(type);	

	this.spacer = 10;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);
	this.vLayout = (this.type === "ui-v-layout");
	this.addEventNames(["onInit"]);

	return this;
}

UILayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var w = this.w;
	var h = this.h;
	var x = this.hMargin;
	var y = this.vMargin;
	var vLayout = this.vLayout;
	var spacer = this.spacer ? this.spacer : 0;

	var n = this.children.length;
	var children = this.children;
	for(var i = 0; i < n; i++) {
		var iter = children[i];

		if(!iter.isVisible()) {
			continue;
		}

		if(vLayout) {
			iter.top = y;
			iter.left = (w - iter.w) >> 1;

			if(iter.heightAttr === UIElement.HEIGHT_SCALE) {
				iter.h = iter.heightParam * h; 
			}
			y += iter.h + spacer;
		}
		else {
			iter.left = x;
			iter.top = (h - iter.h) >> 1;
			if(iter.widthAttr === UIElement.WIDTH_SCALE) {
				iter.w = iter.widthParam * w;
			}

			x += iter.w + spacer;
		}
		
		iter.relayoutChildren();
	}
	
	return;
}

function UILayoutCreator(type) {
	var args = [type, type, null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, 100, 100);
	}
	
	return;
}

UILayout.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

ShapeFactoryGet().addShapeCreator(new UILayoutCreator("ui-v-layout"));
ShapeFactoryGet().addShapeCreator(new UILayoutCreator("ui-h-layout"));

