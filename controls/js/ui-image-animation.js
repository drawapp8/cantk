/*
 * File:   ui-image-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Animation.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageAnimation() {
	return;
}

UIImageAnimation.prototype = new UIImageView();
UIImageAnimation.prototype.isUIImageAnimation = true;

UIImageAnimation.prototype.initUIImageAnimation = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.addEventNames(["onChanged"]);
	this.setTextType(Shape.TEXT_NONE);
	imageAnimationInitCustomProp(this);

	return this;
}

UIImageAnimation.prototype.setCurrent = function(current) {
	if(this.userImages.length) {
		current = current%this.userImages.length;
	}

	if(this.currFrame != current) {
		this.callOnChangedHandler(current);
	}

	this.currFrame = current;

	return;
}

UIImageAnimation.prototype.onInit = function() {
	var imageAnim = this;

	this.currFrame = 0;

	function nextFrame() {
		if(imageAnim.isVisible()) {
			var duration = 1000/imageAnim.getFrameRate();
			
			imageAnim.postRedraw();
			setTimeout(nextFrame, duration);
			imageAnim.setCurrent(imageAnim.currFrame + 1);
		}
	}

	var duration = 1000/this.getFrameRate();
	setTimeout(nextFrame, duration);

	return;
}

UIImageAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIImageAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return;
}

UIImageAnimation.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
	}

	return;
}


UIImageAnimation.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIImageAnimationCreator() {
	var args = [ "ui-image-animation", "ui-image-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageAnimation();
		return g.initUIImageAnimation(this.type, 200, 200);
	}
	
	return;
}

