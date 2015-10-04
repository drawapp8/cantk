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
	this.roundStyle = 'a';

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

UIColorButton.prototype.getRoundStyle =function() {
	var roundStyle = this.roundStyle;

	if(roundStyle === 't') {
		return RoundRect.TL | RoundRect.TR;
	}
	else if(roundStyle === 'l') {
		return RoundRect.TL | RoundRect.BL;
	}
	else if(roundStyle === 'r') {
		return RoundRect.TR | RoundRect.BR;
	}
	else if(roundStyle === 'b') {
		return RoundRect.BL | RoundRect.BR;
	}
	else {
		return RoundRect.TL | RoundRect.TR | RoundRect.BL | RoundRect.BR; 
	}
}

UIColorButton.prototype.paintSelfOnly =function(canvas) {
	var roundStyle = this.getRoundStyle();
	var fillColor = this.style.fillColor;
	var lineColor = this.style.lineColor;

	if(this.pointerDown && this.style.activeFillColor) {
		fillColor = this.style.activeFillColor;
	}

	var fillIt = !Shape.isTransparentColor(fillColor);
	var strokeIt = !Shape.isTransparentColor(lineColor);
		
	if(!fillIt && !strokeIt) {
		return;
	}

	canvas.save();
	canvas.beginPath();

	canvas.translate(this.hMargin, this.vMargin);
	drawRoundRect(canvas, this.w-2*this.hMargin, this.h-2*this.vMargin, this.roundRadius, roundStyle);

	if(fillIt) {
		canvas.fillStyle = fillColor;
		canvas.fill();
	}

	if(strokeIt) {
		if(this.isUIColorButton && this.pointerDown) {
			canvas.lineWidth = this.style.lineWidth + 1;
		}
		else {
			canvas.lineWidth = this.style.lineWidth;
		}

		canvas.strokeStyle = lineColor;
		canvas.stroke();
	}

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

ShapeFactoryGet().addShapeCreator(new UIColorTileCreator(80, 80));
ShapeFactoryGet().addShapeCreator(new UIColorButtonCreator(80, 80));

