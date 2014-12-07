/*
 * File:   ui-scroll-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scroll Text
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScrollText() {
	return;
}

UIScrollText.prototype = new UIElement();
UIScrollText.prototype.isUIScrollText = true;

UIScrollText.prototype.initUIScrollText = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onScrollDone"]);

	return this;
}

UIScrollText.prototype.onModeChanged = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	return;
}

UIScrollText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIScrollText.prototype.getAnimationDuration = function() {
	return this.animationDuration ? this.animationDuration : 1000;
}

UIScrollText.prototype.setAnimationDuration = function(animationDuration) {
	this.animationDuration = animationDuration;

	return;
}

UIScrollText.prototype.getPauseDuration = function() {
	return this.pauseDuration ? this.pauseDuration : 0;
}

UIScrollText.prototype.setPauseDuration = function(pauseDuration) {
	this.pauseDuration = pauseDuration;

	return;
}

UIScrollText.prototype.startVScroll = function() {
	var scrolltext = this;
	var textHeight = this.getTextHeight();
	var lineHeight = this.getLineHeight(true);

	if(textHeight <= this.h) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();
	this.h = Math.floor(this.h/lineHeight) * lineHeight;

	var range = -this.h;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;
		delete now;

		if(timePercent < 1) {
			scrolltext.offsetY = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetY = startOffset + range;

			if(Math.abs(scrolltext.offsetY) < (textHeight-scrolltext.h)) {
				firstTime = true;

				startOffset = scrolltext.offsetY;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete interpolator;
				scrolltext.callOnScrollDoneHandler();
			}

			delete startTime;
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startHScroll = function() {
	var scrolltext = this;
	var textWidth = this.textWidth;

	if(textWidth <= this.w) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();

	var range = -this.w;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;

		if(timePercent < 1) {
			scrolltext.offsetX = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetX = startOffset + range;

			if(Math.abs(scrolltext.offsetX) < (textWidth-scrolltext.w)) {
				firstTime = true;

				startOffset = scrolltext.offsetX;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete startTime;
				scrolltext.callOnScrollDoneHandler();
			}
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startScroll = function() {
	if(!this.isVisible()) {
		return;
	}

	if(this.type === "ui-vscroll-text") {
		this.startVScroll();
	}
	else {
		this.startHScroll();
	}

	return;
}

UIScrollText.prototype.onInit = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	var scrolltext = this;
	setTimeout(function() {
			scrolltext.startScroll();
		}, 1000);

	return;
}

UIScrollText.prototype.drawText = function(canvas) {
	var offsetX = this.offsetX ? this.offsetX : 0;
	var offsetY = this.offsetY ? this.offsetY : 0;

	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.translate(offsetX, offsetY);
    canvas.beginPath();
    canvas.font = this.style.getFont();
    canvas.fillStyle = this.style.textColor;
    canvas.strokeStyle = this.style.lineColor;
    canvas.lineWidth = 1;

	if(this.type === "ui-vscroll-text") {
		this.drawMLText(canvas, false, true);
	}
	else {
		this.textWidth = this.draw1LText(canvas, true);
	}
	canvas.restore();

	return;
}

function UIScrollTextCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScrollText();
		
		return g.initUIScrollText(this.type, w, h);
	}
	
	return;
}

