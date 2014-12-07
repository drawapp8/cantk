/*
 * File:   ui-color-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIColorButton() {
	return;
}

UIColorButton.prototype = new UIElement();
UIColorButton.prototype.isUIButton = true;
UIColorButton.prototype.isUIColorButton = true;

UIColorButton.prototype.initUIColorTile = function(type, w, h) {
	this.initUIColorButton(type, w, h);
	this.isUIButton = false;
	this.isUIColorButton = false;
	this.isUIColorTile = true;
	this.setAutoScaleFontSize(true);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.initUIColorButton = function(type, w, h) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.setCanRectSelectable(false, false);
	this.setMargin(8, 8);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIColorButton.prototype.setBgRotation =function(angle) {
	this.bgRotation = angle;

	return;
}

UIColorButton.prototype.paintSelfOnly =function(canvas) {
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	canvas.save();
	if(this.bgRotation) {
		canvas.translate(hw, hh);
		canvas.rotate(this.bgRotation);
		canvas.translate(-hw, -hh);
	}

	canvas.beginPath();

	if(this.isUIColorButton && this.pointerDown) {
		canvas.lineWidth = this.style.lineWidth * 2;
	}
	else {
		canvas.lineWidth = this.style.lineWidth;
	}

	canvas.translate(this.hMargin, this.vMargin);
	drawRoundRect(canvas, this.w-2*this.hMargin, this.h-2*this.vMargin, this.roundRadius);

	if(this.pointerDown) {
		canvas.fillStyle = this.style.activeFillColor ? this.style.activeFillColor : this.style.fillColor;
	}
	else {
		canvas.fillStyle = this.style.fillColor;
	}
	canvas.strokeStyle = this.style.lineColor;
	canvas.fill();
	canvas.stroke();	

	canvas.restore();

	return;
}

function UIColorTileCreator(w, h) {
	var args = ["ui-color-tile", "ui-color-tile", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorTile(this.type, w, h);
	}
	
	return;
}

function UIColorButtonCreator(w, h) {
	var args = ["ui-color-button", "ui-color-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorButton(this.type, w, h);
	}
	
	return;
}

