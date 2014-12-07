/*
 * File:   ui-image-slide-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Slide View.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIImageSlideView() {
	return;
}

UIImageSlideView.prototype = new UIImageView();
UIImageSlideView.prototype.isUIImageSlideView = true;

UIImageSlideView.prototype.initUIImageSlideView = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.offset = 0;
	this.addEventNames(["onChanged"]);
	this.setTextType(Shape.TEXT_NONE);
	imageSlideViewInitCustomProp(this);

	return this;
}

UIImageSlideView.prototype.onInit = function() {
	var slideview = this;

	this.currFrame = 0;

	function nextFrame() {
		if(slideview.mode != Shape.MODE_EDITING && slideview.isVisible()) {
			var duration = slideview.getFrameDuration();
			
			slideview.postRedraw();
			setTimeout(nextFrame, duration);

			var newFrame = slideview.currFrame + 1;
			slideview.animScrollTo(-slideview.w, newFrame);
		}
	}

	var duration = this.getFrameDuration();
	setTimeout(nextFrame, duration);

	return;
}

UIImageSlideView.prototype.getFrameDuration = function() {
	return this.frameDuration ? this.frameDuration : 5000;
}

UIImageSlideView.prototype.setFrameDuration = function(frameDuration) {
	this.frameDuration = Math.max(1000, Math.min(frameDuration, 300000));

	return;
}

UIImageSlideView.prototype.setShowIndicator = function(value) {
	this.showIndicator = value;

	return;
}

UIImageSlideView.prototype.getFrameIndicatorParams = function() {
	var n = this.userImages.length;
	var itemSize = Math.min((0.5 * this.w)/n, 40);
	var indicatorWidth = itemSize * n;

	var dx = (this.w - indicatorWidth)/2;
	var dy = 0.8 * this.h;

	return {offsetX:dx, offsetY:dy, itemSize:itemSize, n:n};
}

UIImageSlideView.prototype.setCurrentFrame = function(currFrame) {
	this.offset = 0;
	this.currFrame = (currFrame + this.userImages.length)%this.userImages.length;
	this.postRedraw();

	this.callOnChangedHandler(this.currFrame);

	return;
}

UIImageSlideView.prototype.animScrollTo = function(range, newFrame) {
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
			slideview.setCurrentFrame(newFrame);
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

UIImageSlideView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();

	return true;
}

UIImageSlideView.prototype.onPointerMoveRunning = function(point, beforeChild) {
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
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	this.offset = dx;
	this.addMovementForVelocityTracker();

	return;
}

UIImageSlideView.prototype.onPointerUpRunning = function(point, beforeChild) {
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
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.currFrame;
	var velocity = this.velocityTracker.getVelocity().x;
	var distance = offsetX + velocity;

	//console.log("offsetX: " + offsetX + "velocity:" + velocity + " distance:" + distance );
	if(Math.abs(offsetX) < 10) {
		this.offset = 0;

		return;
	}

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = this.currFrame - 1;
		}
		else {
			range = -this.w - offsetX;
			newFrame = this.currFrame + 1;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIImageSlideView.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;
	var x = point.x;
	var y = point.y;

	if(y < dy || y > (dy + itemSize) || x < dx || x > (dx + n * itemSize)) {
		return;
	}

	for(var i = 0; i < n; i++) {
		if(x > dx && x < (dx + itemSize)) {
			this.setCurrentFrame(i);	
			break;
		}

		dx += itemSize;
	}

	return;
}

UIImageSlideView.prototype.drawFrameIndicator = function(canvas, currFrame) {
	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;

	dx += itemSize/2;
	dy += itemSize/2;

	for(var i = 0; i < n; i++) {
		canvas.beginPath();
		canvas.arc(dx, dy, 10, 0, Math.PI * 2);
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

UIImageSlideView.prototype.getPrevFrame = function() {
	var index = (this.currFrame - 1 + this.userImages.length)%this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.getFrames = function() {
	return this.userImages.length;
}

UIImageSlideView.prototype.getNextFrame = function() {
	var index = (this.currFrame + 1) % this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.drawOneImage = function(canvas, image) {
	var fillColor = this.style.fillColor;

	if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
		canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.w, this.h);
	}
	else if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO) {
		var rect = {x:0, y:0};
		rect.w = image.width;
		rect.h = image.height;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO, 0, 0, this.w, this.h, rect);
	}
	else {
		UIImageView.drawImageAtCenter(canvas, image, 0, 0, this.w, this.h, true, fillColor);
	}

	return;
}

UIImageSlideView.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		canvas.save();
		canvas.rect(0, 0, this.w, this.h);
		canvas.clip();
		canvas.beginPath();

		canvas.translate(this.offset, 0);

		this.drawOneImage(canvas, image);

		var offset = Math.abs(this.offset);
		if(this.offset < 0) {
			image = this.getNextFrame();
			if(image && image.width > 0) {
				canvas.translate(this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		else if(offset > 0) {
			image = this.getPrevFrame();
			if(image && image.width > 0) {
				canvas.translate(-this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		canvas.restore();

		if(this.showIndicator) {
			this.drawFrameIndicator(canvas, currFrame);
		}
	}

	return;
}


UIImageSlideView.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UIImageSlideViewCreator() {
	var args = [ "ui-image-slide-view", "ui-image-slide-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageSlideView();
		return g.initUIImageSlideView(this.type, 200, 200);
	}
	
	return;
}

