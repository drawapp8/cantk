/*
 * File:   ui-v-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollView() {
	return;
}

UIVScrollView.prototype = new UIScrollView();
UIVScrollView.prototype.isUIVScrollView = true;

UIVScrollView.prototype.initUIVScrollView = function(type, border, bg, scrollBarImg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(40, 100, 2000, 2000);
	this.setImage("scrollBarImg", scrollBarImg);
	this.rectSelectable = false;

	return this;
}


UIVScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dy > 50 && dy > dx) || (dy > 50 && this.mode != Shape.MODE_EDITING);
}

UIVScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaY()); 
}

UIVScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaY());
}

UIVScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().y;
}

UIVScrollView.prototype.getPageSize = function() {
	return this.h;
}

UIVScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x), y : (point.y - this.y + this.offset)};

	return p;
}

UIVScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.b;
	if(range < this.h) {
		 range = this.h;
	}

	var n = (this.mode === Shape.MODE_EDITING) ? this.h : 10;

	range = Math.ceil(range/n) * n;

	return range;
}

UIVScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.x = this.hMargin;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.y = this.offset + this.vMargin;
		child.heightAttr = UIElement.HEIGHT_SCALE;
	}
	
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIVScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var upClip = this.offset;
	var downClip = this.offset + this.h;

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(0, -this.offset);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.y + shape.h) < upClip || shape.y > downClip) {
			continue;
		}

		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIVScrollView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	return;
}

UIVScrollView.prototype.drawScrollBar = function(canvas) {
	var image = this.getHtmlImageByType("scrollBarImg");

	if(!this.scrollBarOpacity || !image) {
		return;
	}

	var range = this.getScrollRange();
	var x = this.w - image.width - 2;
	var w = image.width;
	var h = this.h * this.h/range;
	var y = (this.offset / range) * this.h;

	if((y + h) > this.h) {
		h = this.h - y;
		y = this.h - h;
	}
	
	if(y < 0) {
		h = h + y;
		y = 0;
	}

	canvas.save();
	canvas.globalAlpha = this.scrollBarOpacity;
	drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, x, y, w, h);
	canvas.restore();

	return;
}

function UIVScrollViewCreator(border, bg, scrollBarImg) {
	var args = ["ui-v-scroll-view", "ui-v-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollView();
		return g.initUIVScrollView(this.type, border, bg, scrollBarImg);
	}
	
	return;
}
