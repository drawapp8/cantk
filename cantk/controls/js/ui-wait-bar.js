/*
 * File:   ui-wait-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Wait Bar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWaitBar
 * @extends UIElement
 * 等待动画。
 */

/**
 * @class UIWaitBox
 * @extends UIElement
 * 等待动画。
 */

function UIWaitBar() {
	return;
}

UIWaitBar.TILES = 8;
UIWaitBar.prototype = new UIElement();

UIWaitBar.prototype.initUIWaitBar = function(type, w, h) {
	this.initUIElement(type);	

	this.offset = 0;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

UIWaitBar.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIWaitBar.prototype.step = function() {
	if(this.isVisible() && this.getParent()) {
		this.offset++;
	
		if(this.isUIWaitBar) {
			this.offset = (this.offset)%UIWaitBar.TILES;
		}

		this.postRedraw();
	}

	return this;
}

UIWaitBar.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	
	if(!image) {
		return;
	}

	if(this.isUIWaitBar) {
		this.drawBgImageBar(canvas, image);
	}
	else {
		this.drawBgImageBox(canvas, image);
	}

	return;
}

UIWaitBar.prototype.drawBgImageBox =function(canvas, image) {
	var angle = 0.05*Math.PI*this.offset;
	this.setRotation(angle);

	UIElement.prototype.drawBgImage.call(this, canvas);

	return;
}

UIWaitBar.prototype.onInit = function() {
	UIElement.prototype.onInit.call(this);

	var me = this;
	function stepIt() {
		me.step();
		if(me.getParent()) {
			setTimeout(stepIt, 50);
		}
	}

	stepIt();

	return;
}

UIWaitBar.prototype.drawBgImageBar = function(canvas, image) {
	var imageWidth = image.width;
	var imageHeight = image.height;
	var tileHeight = Math.round(imageHeight/UIWaitBar.TILES);
	var yOffset = this.offset * tileHeight;

	var rect = {x:0, y:yOffset, w:imageWidth, h:tileHeight};

	UIElement.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, rect);

	return;
}

function UIWaitBarCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		g.isUIWaitBar = true;

		return g.initUIWaitBar(this.type, w, h);
	}
	
	return;
}

function UIWaitBoxCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		g.isUIWaitBox = true;

		return g.initUIWaitBar(this.type, w, h);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIWaitBarCreator("ui-wait-bar", 200, 24));
ShapeFactoryGet().addShapeCreator(new UIWaitBoxCreator("ui-wait-box", 60, 60));

