/*
 * File:   ui-page.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPage() {
	return;
}

UIPage.prototype = new UIElement();
UIPage.prototype.isUIPage = true;

UIPage.prototype.initUIPage = function(type, bg) {
	this.initUIElement(type);	

	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;

	if(!bg) {
		this.style.setFillColor("Gold");
	}

	return this;
}

UIPage.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIPage.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIPage.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPage) {
		return false;
	}

	if(shape.isUIPageIndicator && !this.isUIPageExt) {
		return false;
	}

	return true;
}

UIPage.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIPageCreator(bg) {
	var args = ["ui-page", "ui-page", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPage();

		return g.initUIPage(this.type, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPageCreator(null));

