/*
 * File:   ui-switch.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Switch
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISwitch() {
	return;
}

UISwitch.prototype = new UICheckBox();
UISwitch.prototype.isUISwitch = true;

UISwitch.prototype.initUISwitch = function(type, w, h, maskWidth, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	
	this.value = true;
	this.imageWidth = 412;
	this.maskWidth = maskWidth;
	this.offsetImage = maskWidth;
	this.addEventNames(["onChanged"]);
	this.interpolator =  new DecelerateInterpolator(2);

	return this;
}

UISwitch.prototype.updateImageSize = function(imageWidth) {
	this.imageWidth = imageWidth;
	this.maskWidth = Math.floor(imageWidth * 0.373786);

	if(!this.animating) {
		this.offsetImage = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	}

	return;
}

UISwitch.prototype.animateChange = function() {
	var switcher = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offsetImage;
	var endOffset = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	var range = endOffset - startOffset;
	this.animating = true;
	var duration = 500;
	function offsetIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = switcher.interpolator.get(timePercent);
		var offset = startOffset + range * percent;	

		if(timePercent < 1) {
			switcher.offsetImage = offset;
			setTimeout(offsetIt, 10);
		}
		else {
			switcher.offsetImage = endOffset;
			delete this.animating;
		}
		switcher.postRedraw();
		delete now;

		return;
	}
	
	setTimeout(offsetIt, 30);

	return;
}

UISwitch.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.mode !== Shape.MODE_EDITING) {
		return;
	}
	this.setValue(!this.value);

	return;
}

UISwitch.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.pointerDownPosition = point;

	return;
}

UISwitch.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	var dx = point.x - this.pointerDownPosition.x;
	if(Math.abs(dx) < 5) {
		this.setValue(!this.value);
	}
	else {
		this.setValue(dx > 0);
	}

	return;
}

UISwitch.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChangedHandler(this.value);
		this.animateChange();
	}

	return this;
}

UISwitch.prototype.drawBgImage =function(canvas) {
	return;
}

UISwitch.prototype.drawFgImage =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(image) {
		this.updateImageSize(image.width);
		var h = image.height;
		var w = this.maskWidth;
		var dx = (this.w - w)/2;
		var dy = (this.h - h)/2;

		this.imageWidth = image.width;
		canvas.drawImage(image, this.offsetImage, 0, w, h, dx, dy, w, h);

		/*draw mask Image*/
		canvas.drawImage(image, 0, 0, w, h, dx, dy, w, h);
	}

	return;
}

function UISwitchCreator(w, h, maskWidth, img) {
	var args = ["ui-switch", "ui-switch", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISwitch();
		return g.initUISwitch(this.type, w, h, maskWidth, img);
	}
	
	return;
}
