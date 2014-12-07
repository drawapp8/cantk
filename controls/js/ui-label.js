/*
 * File:   ui-label.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Label
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILabel() {
	return;
}

UILabel.prototype = new UIElement();
UILabel.prototype.isUILabel = true;

UILabel.prototype.initUILabel = function(type, initText, bg) {
	this.initUIElement(type);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.addEventNames(["onChanged", "onUpdateTransform"]);


	return this;
}


UILabel.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UILabel.prototype.setText = function(text) {
	this.text = this.toText(text);
	this.textNeedRelayout = true;

	this.callOnChangedHandler(text);

	return this;
}

UILabel.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	
	this.defaultDrawText(canvas);

	return;
}

function UILabelCreator() {
	var args = ["ui-label", "ui-label", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILabel();
		return g.initUILabel(this.type, dappGetText("Text"), null);
	}
	
	return;
}

