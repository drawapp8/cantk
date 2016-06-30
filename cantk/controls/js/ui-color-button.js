/*
 * File:   ui-color-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIColorButton
 * @extends UIElement
 * 颜色按钮。不同状态下可以设置不同的颜色，可以是矩形，圆角矩形或圆形。
 *
 */

/**
 * @property {Number} roundRadius
 * 控件的圆角半径。0表示不圆角。
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
	this.style.roundStyle = 'a';

	return this;
}

UIColorButton.prototype.initUIColorButton = function(type, w, h) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.setCanRectSelectable(false, false);
	this.setMargin(0, 0);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

/**
 * @method setRoundStyle
 * 设置控件的圆角风格。
 * @param {String} roundStyle 圆角风格。'l'表示左边圆角, 'r'表示右边圆角, 't'表示顶部圆角, 'b'表示底部圆角, 'a'表示全部圆角。
 * @return {UIElement} 返回控件本身。
 *
 */
UIColorButton.prototype.setRoundStyle = function(roundStyle) {
	this.style.roundStyle = roundStyle;

	return this;
}

/**
 * @method getRoundStyle
 * 获取控件的圆角风格。
 * @return {UIElement} 返回圆角风格。
 *
 */
UIColorButton.prototype.getRoundStyle = function() {
	return this.style.roundStyle;
}

/**
 * @method setActiveFillColor
 * 设置控件按下时的填充颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */
UIColorButton.prototype.setActiveFillColor = function(color) {
	this.style.activeFillColor = color;
	
	return this;
}

UIColorButton.prototype.getRoundStyleValue =function() {
	var roundStyle = this.style.roundStyle;

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
	var roundStyle = this.getRoundStyleValue();
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

/**
 * @class UIColorTile
 * @extends UIColorButton
 * 颜色块，可以是矩形，圆角矩形或圆形。
 *
 */
ShapeFactoryGet().addShapeCreator(new UIColorTileCreator(80, 80));
ShapeFactoryGet().addShapeCreator(new UIColorButtonCreator(80, 80));

