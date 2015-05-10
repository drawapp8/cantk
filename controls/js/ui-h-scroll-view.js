/*
 * File:   ui-h-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Horizonal ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHScrollView() {
	return;
}

UIHScrollView.prototype = new UIScrollView();
UIHScrollView.prototype.isUIHScrollView = true;

UIHScrollView.prototype.initUIHScrollView = function(type, border, bg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(100, 40, 2000, 2000);

	return this;
}

UIHScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dx > 20 && dx > dy)  || (dx > 20 && this.mode != Shape.MODE_EDITING);
}

UIHScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaX()); 
}

UIHScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaX()); 
}

UIHScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIHScrollView.prototype.getPageSize = function() {
	return this.w;
}

UIHScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	if(this.isEventHandledByChild()) {
		return;
	}
	this.setEventHandled();

	var pageOffset = 0;
	var velocity = this.getVelocity();
	var delta = this.getScrolledSize();
	var absDelta = Math.abs(delta);

	if(absDelta > this.w/4 || velocity > this.w) {
		if(delta < 0) {
			pageOffset = 1;
		}
		else {
			pageOffset = -1;
		}
	}
	
	this.scrollToPageDelta(pageOffset);

	return true;
}

UIHScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x + this.offset), y : (point.y - this.y)};

	return p;
}

UIHScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.r - r.l;
	if(range < this.w) {
		 range = this.w;
	}
	range = Math.ceil(range/this.w) * this.w;

	return range;
}

UIHScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.x = this.offset + this.hMargin;	
		child.widthAttr = UIElement.WIDTH_SCALE;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.y = this.vMargin;
	}

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIHScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var leftClip = this.offset;
	var rightClip = this.offset + this.w;

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(-this.offset, 0);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.x + shape.w) < leftClip || shape.y > rightClip) {
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

function UIHScrollViewCreator(border, bg) {
	var args = ["ui-h-scroll-view", "ui-h-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHScrollView();
		return g.initUIHScrollView(this.type, border, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHScrollViewCreator(0, null));

