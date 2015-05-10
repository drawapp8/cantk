/*
 * File:   ui-image-normal-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Normal Image View 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageNormalView() {
	return;
}

UIImageNormalView.prototype = new UIImageView();
UIImageNormalView.prototype.isUIImageNormalView = true;

UIImageNormalView.prototype.initUIImageNormalView = function(type, w, h) {
	this.userImages = [];
	this.cachedImages = [];

	this.initUIElement(type);
	this.initUIImageView(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.current = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.imageScale = 1;

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator();
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	
	return this;
}

UIImageNormalView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.velocityTracker.clear();

	return;
}

UIImageNormalView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.offsetX = this.offsetX + this.getMoveDeltaX();
	this.offsetY = this.offsetY + this.getMoveDeltaY();

	this.addMovementForVelocityTracker();

	return ;
}

UIImageNormalView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIImageNormalView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var velocity = this.velocityTracker.getVelocity();
	var xa = this.w;
	var ya = this.h;
	var xt = velocity.x/xa;
	var yt = velocity.y/ya;
	var t = Math.max(xt, yt);

	var xd = 0.5 * xa * xt * xt;
	var yd = 0.5 * ya * yt * yt;

	xd = velocity.x > 0 ? xd : -xd;
	yd = velocity.y > 0 ? yd : -yd;
	this.scrollTo(xd, yd, t * 1000);

	return true;
}

UIImageNormalView.prototype.scrollTo = function(xd, yd, t) {
	var imageview = this;
	var duration = Math.max(500, Math.min(t, 1000));
	
	var startTime = (new Date()).getTime();
	var offsetXStart = this.offsetX;
	var offsetYStart = this.offsetY;
	var currentImage = this.cachedImages[this.current];

	var dx = Math.min(currentImage.width/2, xd);
	var dy = Math.min(currentImage.height/2, yd);

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
		
		if(percent < 1) {
			imageview.offsetX = offsetXStart + percent * dx;
			imageview.offsetY = offsetYStart + percent * dy;

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			imageview.offsetX = offsetXStart + dx;
			imageview.offsetY = offsetYStart + dy;
		}

		delete now;
		imageview.postRedraw();
	}

	animStep();

	return;
}

UIImageNormalView.prototype.switchTo = function(offset) {
	var current = this.current;
	var n = this.userImages.length;
	if(offset > 0) {
		if((this.current+offset) < n) {
			current = this.current + offset;	
		}
	}
	else {
		if((this.current+offset) > 0) {
			current = this.current + offset;
		}
	}
}

UIImageNormalView.prototype.calcImageDefaultOffset = function() {
	var index = this.current;
	if(index < 0 || index >= this.cachedImages.length) {
		return;
	}

	var image = this.cachedImages[index];
	if(!image || !image.width) {
		return;
	}

	this.imageScale = Math.min(this.w/image.width, this.h/image.height);
	
	var w = this.imageScale * image.width;
	var h = this.imageScale * image.height;

	this.offsetX = (this.w-w)/2;
	this.offsetY = (this.h-h)/2;

	return;
}

UIImageNormalView.prototype.setCurrentImage = function(index) {
	if(index < 0 || index >= this.userImages.length) {
		return;
	}

	this.current = index;
	this.calcImageDefaultOffset();

	return;
}

UIImageNormalView.prototype.onDoubleClick = function(point, beforeChild) {
	this.calcImageDefaultOffset();
	return this.callOnDoubleClickHandler(point);
}

UIImageNormalView.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currentImage = this.cachedImages[this.current];
	if(!currentImage || !currentImage.width) {
		return;
	}

	this.imageScale = 1;
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();

	canvas.translate(this.offsetX, this.offsetY);
	canvas.scale(this.imageScale, this.imageScale);
	canvas.drawImage(currentImage, 0, 0);
	canvas.restore();

	return;
}

function UIUIImageNormalViewCreator() {
	var args = ["ui-image-normal-view", "ui-image-normal-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageNormalView();

		return g.initUIImageNormalView(this.type, 300, 300);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIUIImageNormalViewCreator());

