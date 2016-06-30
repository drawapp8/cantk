/*
 * File:   ui-view-pager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  View Page (AKA Tab Control)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIViewPager
 * @extends UIFrames
 * 标签控件。
 *
 */
function UIViewPager() {
	return;
}

UIViewPager.prototype = new UIPageManager();
UIViewPager.prototype.isUIViewPager = true;

UIViewPager.prototype.saveProps = ["slideToChange"];
UIViewPager.prototype.initUIViewPager = function(type) {
	this.initUIPageManager(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(UIElement.TEXT_NONE);
	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);
    this.animateQueue = [];

	return this;
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
	var startTime = Date.now();
	var interpolator = this.interpolator;

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = Date.now();
		var timePercent = (now - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1 && !slideview.halt) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 16);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrent(newFrame);
			slideview.setAnimatingFrames(null, null);

			delete startTime;
			delete interpolator;
			delete slideview.animating;
            delete slideview.halt;
            
            slideview.queueAnimation();
		}

		slideview.postRedraw();
	}

	animStep();

	return;
}

UIViewPager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating || !this.slideToChange) {
		return;
	}
	
	if(this.isEventHandledByChild()) {
		return;
	}
	this.setEventHandled();

	this.velocityTracker.clear();

	return true;
}

UIViewPager.prototype.isEventHandledByChild = function() {
	if(UIElement.hScrollHandledBy && UIElement.hScrollHandledBy !== this) {
		return true;
	}else{
		return false;
	}
}

UIViewPager.prototype.setEventHandled = function() {
	UIElement.hScrollHandledBy = this;

	return this;
}

UIViewPager.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!this.slideToChange || beforeChild || !this.pointerDown) {
		return;
	}

	if(this.animating) {
		this.setEventHandled();
		return;
	}

	if(this.isEventHandledByChild()) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
	}
	else {
		return;
	}

	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	if(dx > dy && dx > 10) {
		this.offset = this.getMoveAbsDeltaX();
		this.setAnimatingFrames(this.getPrevFrame(), this.getNextFrame());
	}
	else {
		this.offset = 0;
		this.setAnimatingFrames(null, null);
	}

	this.addMovementForVelocityTracker();

	return;
}
	
UIViewPager.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!this.slideToChange || beforeChild || !this.pointerDown) {
		return;
	}

	if(this.animating) {
		this.setEventHandled();
		return;
	}
	if(this.isEventHandledByChild()) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
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

UIViewPager.prototype.setAnimatingFrames = function(leftFrame, rightFrame) {
	this.leftFrame = leftFrame;
	this.rightFrame = rightFrame;

	return this;
}

/**
 * @method switchTo 
 * 设置当前显示的子控件。
 * @param {Number} index 子控件的索引，与setCurrent不同是，switchTo有切换动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIViewPager.prototype.switchTo = function(index) {
	var arr = this.children;
	var n = arr.length;
	
	this.offset = 0;
    if(index < 0 || index > n - 1) {
        return;
    }
    
    if(this.animateQueue === undefined) {
        this.animateQueue = [];
    } 
    this.animateQueue.push(index);
    
    if(this.animating) {
        console.log("busy...");
        this.halt = true;
        return;
    }
   
    this.queueAnimation();

	return this;
}

UIViewPager.prototype.queueAnimation = function() {
    if(this.animateQueue.length < 1) {
        return;
    }
	var arr = this.children;
    var index = this.animateQueue.pop();
    this.animateQueue = [];
    var newFrame = arr[index];
    if(index < this.current) {
        this.animScrollTo(this.w, index);
        this.setAnimatingFrames(newFrame, null);
    }else{
        this.animScrollTo(-this.w, index);
        this.setAnimatingFrames(null, newFrame);
    }
}

UIViewPager.prototype.paintChildrenAnimating = function(canvas) {
	var currFrame = this.getCurrentFrame();
	var prevFrame = this.leftFrame;
	var nextFrame = this.rightFrame;

	canvas.save();
	canvas.clipRect(0, 0, this.w, this.h);

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
	if(currFrame) {
		currFrame.x = 0;
	}
	if(nextFrame) {
		nextFrame.x = 0;
	}
	if(prevFrame) {
		prevFrame.x = 0;
	}

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
	if(this.offset && this.children.length > 1 && (this.leftFrame || this.rightFrame)) {
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

function UIViewPagerCreator() {
	var args = ["ui-view-pager", "ui-view-pager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIViewPager();

		return g.initUIViewPager(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIViewPagerCreator());

