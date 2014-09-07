/*
 * File:   ui-view-pager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  View Page (AKA Tab Control)
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIViewPager() {
	return;
}

UIViewPager.prototype = new UIPageManager();
UIViewPager.prototype.isUIViewPager = true;

UIViewPager.prototype.initUIViewPager = function(type) {
	this.initUIPageManager(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.heightAttr = C_HEIGHT_FILL_PARENT;

	return this;
}

UIViewPager.prototype.getFrameIndicatorParams = function() {
	var n = this.children.length;
	var itemSize = Math.min((0.5 * this.w)/n, 40);
	var indicatorWidth = itemSize * n;

	var dx = (this.w - indicatorWidth)/2;
	var dy = 0.8 * this.h;

	return {offsetX:dx, offsetY:dy, itemSize:itemSize, n:n};
}

UIViewPager.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.needShowIndicator()) {
		return;
	}

	var params = this.getFrameIndicatorParams();

	var x = point.x;
	var y = point.y;
	var n = params.n;
	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;

	if(y < dy || y > (dy + itemSize) || x < dx || x > (dx + n * itemSize)) {
		return;
	}

	for(var i = 0; i < n; i++) {
		if(x > dx && x < (dx + itemSize)) {
			this.setCurrent(i);	
			break;
		}

		dx += itemSize;
	}

	return;
}

UIViewPager.prototype.drawFrameIndicator = function(canvas, currFrame) {
	var params = this.getFrameIndicatorParams();

	var n = params.n;
	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;

	dx += itemSize/2;
	dy += itemSize/2;

	var r = 15;
	canvas.fillStyle = this.style.fillColor;
	for(var i = 0; i < n; i++) {
		canvas.beginPath();
		canvas.arc(dx, dy, r, 0, Math.PI * 2);
		dx += itemSize;
	
		if(i === currFrame) {
			canvas.save();
			canvas.shadowColor = this.style.lineColor;
			canvas.shadowBlur = 5;
			canvas.shadowOffsetX = 0;
			canvas.shadowOffsetY = 0;

			canvas.fill();
			canvas.stroke();
			canvas.restore();
		}
		else {
			canvas.fill();
		}
	}

	return;
}

UIViewPager.prototype.needShowIndicator = function() {
	if(this.pageIndicator) {
		return false;
	}

	if(this.mode === C_MODE_EDITING || this.showIndicator) {
		return true;
	}

	return false;
}

UIViewPager.prototype.afterPaintChildren = function(canvas) {
	if(this.needShowIndicator()) {
		this.drawFrameIndicator(canvas, this.current);
	}

	return;
}

UIViewPager.prototype.getPrevFrame = function() {
	var n = this.children.length;
	var index = (this.current - 1 + n)%n;

	return this.children[index];
}

UIViewPager.prototype.getNextFrame = function() {
	var n = this.children.length;
	var index = (this.current + 1)%n;

	return this.children[index];
}

UIViewPager.prototype.animScrollTo = function(range, newFrame) {

	var duration = 1000;
	var slideview = this;
	var startOffset = this.offset;
	var startTime = (new Date()).getTime();
	var interpolator = new DecelerateInterpolator(2);

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrent(newFrame);
			delete startTime;
			delete interpolator;
			delete slideview.animating;
		}

		delete now;
		slideview.postRedraw();
	}

	animStep();

	return;
}

UIViewPager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating || !this.slideToChange) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();

	return true;
}

UIViewPager.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!this.slideToChange) {
		return;
	}
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	if(dx > dy && dx > 10) {
		this.offset = this.getMoveAbsDeltaX();
	}
	else {
		this.offset = 0;
	}

	this.addMovementForVelocityTracker();

	return;
}
	
UIViewPager.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!this.slideToChange) {
		return;
	}
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.current;
	var dy = Math.abs(this.getMoveAbsDeltaY());
	var velocity = this.velocityTracker.getVelocity().x;

	if(Math.abs(offsetX) < 5 || dy > 60) {
		this.offset = 0;

		return;
	}

	var n = this.children.length;
	var distance = offsetX + velocity;

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = (this.current - 1 + n)%n;
		}
		else {
			range = -this.w - offsetX;
			newFrame = (this.current + 1)%n;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIViewPager.prototype.paintChildrenAnimating = function(canvas) {
	var currFrame = this.getCurrentFrame();
	var prevFrame = this.getPrevFrame();
	var nextFrame = this.getNextFrame();

	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();

	if(this.offset > 0) {
		var offsetX = this.w-this.offset;
		prevFrame.x = -offsetX;
		prevFrame.paintSelf(canvas);
		offsetX = this.offset;
		currFrame.x = offsetX;
		currFrame.paintSelf(canvas);
	}
	else {
		currFrame.x = this.offset;
		currFrame.paintSelf(canvas);
		nextFrame.x = this.w + this.offset;
		nextFrame.paintSelf(canvas);
	}
	currFrame.x = 0;
	nextFrame.x = 0;
	prevFrame.x = 0;
	canvas.restore();

	return;
}

UIViewPager.prototype.paintChildrenNormal = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIViewPager.prototype.paintChildren = function(canvas) {
	if(this.offset && this.children.length > 1) {
		this.paintChildrenAnimating(canvas);
	}
	else {
		this.paintChildrenNormal(canvas);
	}

	return;
}

UIViewPager.prototype.setSlideToChange = function(value) {
	this.slideToChange = value;

	return;
}

UIViewPager.prototype.setShowIndicator = function(value) {
	this.showIndicator = value;

	return;
}

UIViewPager.prototype.onModeChanged = function() {
	this.setCurrent(0);

	return;
}

function UIViewPagerCreator() {
	var args = ["ui-view-pager", "ui-view-pager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIViewPager();

		return g.initUIViewPager(this.type);
	}
	
	return;
}
