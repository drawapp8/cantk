/*
 * File:   ui-v-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical ScrollView
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
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
	
	return (dy > 50 && dy > dx) || (dy > 50 && this.mode != C_MODE_EDITING);
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

	var n = (this.mode === C_MODE_EDITING) ? this.h : 10;

	range = Math.ceil(range/n) * n;

	return range;
}

UIVScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		child.x = this.hMargin;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.y = this.offset + this.vMargin;
		child.heightAttr = C_HEIGHT_SCALE;
	}
	
	if(child.widthAttr === C_WIDTH_FILL_PARENT && child.heightAttr === C_HEIGHT_FILL_PARENT) {
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

UIVScrollView.prototype.drawCache = function(canvas) {
	if(!this.cacheCanvas) {
		return false;
	}

	var y = Math.floor(this.offset - this.cacheOffset);
	canvas.drawImage(this.cacheCanvas, 0, y, this.w, this.h, 0, 0, this.w, this.h);
	this.drawScrollBar(canvas);

	console.log("y:" + y + " this.offset:" + this.offset + " this.cacheOffset:" + this.cacheOffset);
	return true;
}

UIVScrollView.prototype.prepareCache = function(offset, range) {
	var w = this.w;
	var h = this.h * 2;
	var tcanvas = cantkGetTempCanvas(w, h);
	var ctx = tcanvas.getContext("2d");

	ctx.clearRect(0, 0, w, h);
	var saveOffset = this.offset;
	var scrollBarOpacity = this.scrollBarOpacity;
	this.cacheCanvas = null;

	this.scrollBarOpacity = 0;

	if(range > 0) {
		this.offset = offset - range;
	}
	else {
		this.offset = offset;
	}
	this.cacheOffset = this.offset;
	console.log("this.cacheOffset:" + this.cacheOffset);
	
	ctx.save();
	ctx.translate(-this.x, -this.y);
	this.paintSelf(ctx);

	this.offset = this.offset + this.h;
	
	ctx.save();
	ctx.translate(0, this.h);
	this.paintSelf(ctx);
	ctx.restore();
	ctx.restore();

	this.offset = saveOffset;
	this.cacheCanvas = tcanvas;
	this.scrollBarOpacity = scrollBarOpacity;

	//window.open(tcanvas.toDataURL(), "_blank");

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
