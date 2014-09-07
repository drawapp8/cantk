/*
 * File:   ui-wait-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Wait Bar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWaitBar() {
	return;
}

UIWaitBar.TILES = 8;
UIWaitBar.prototype = new UIElement();
UIWaitBar.prototype.isUIWaitBar = true;

UIWaitBar.prototype.initUIWaitBar = function(type, w, h, image, imageDisplay) {
	this.initUIElement(type);	

	this.offset = 0;
	this.running = false;
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = imageDisplay;
	this.setImage(CANTK_IMAGE_DEFAULT, image);

	return this;
}

UIWaitBar.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIWaitBar.prototype.isRunning = function() {
	return this.running;
}

UIWaitBar.prototype.start = function() {
	this.running = true;

	return;
}

UIWaitBar.prototype.stop = function() {
	this.running = false;

	return;
}

UIWaitBar.prototype.drawBgImage =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	
	if(!image) {
		return;
	}

	var imageWidth = image.width;
	var imageHeight = image.height;
	var tileHeight = imageHeight/UIWaitBar.TILES;
	var yOffset = this.offset * tileHeight;

	var sx = 0;
	var sy = yOffset;
	var w = imageWidth;
	var h = imageHeight;
	var dw = this.w;
	var dh = this.h;
	var dx = (dw - imageWidth)/2;
	var dy = (dh - tileHeight)/2;
		
	if(imageWidth < 100 && imageHeight < 100) {
		sy = 0;
		dy = (dh - imageHeight)/2;
		canvas.save();
		canvas.translate(this.w/2, this.h/2);
		canvas.rotate(0.1*Math.PI*this.offset);
		canvas.translate(-this.w/2, -this.h/2);
		canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, imageWidth, imageHeight);
		canvas.restore();
	}
	else {
		switch(this.images.display) {
			case CANTK_IMAGE_DISPLAY_CENTER: {
				canvas.drawImage(image, sx, sy, w, tileHeight, dx, dy, w, tileHeight);
				break;
			}
			default: {
				canvas.drawImage(image, sx, sy, w, tileHeight, 0, dy, dw, tileHeight);
				break;
			}
		}	
	}

	return;
}

UIWaitBar.prototype.needRedraw = function() {
	if(!this.isVisible() || !this.running) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	return true;
}

function UIWaitBarCreator(type, w, h, image, imageDisplay) {
	var args = [type, "ui-wait-bar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		if(type !== C_CREATE_FOR_ICON) {
			setInterval(function() {
				if(g.needRedraw()) {
					g.offset = (g.offset + 1);
					if(g.type === "ui-wait-bar") {
						g.offset = g.offset%UIWaitBar.TILES;
					}
					g.postRedraw();
				}
			}, 100);
		}
		return g.initUIWaitBar(this.type, w, h, image, imageDisplay);
	}
	
	return;
}
