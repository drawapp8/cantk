/*
 * File:   ui-color-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Bar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIColorBar
 * @extends UIElement
 * 颜色线条，一般用于装饰。
 *
 */
function UIColorBar() {
	return;
}

UIColorBar.prototype = new UIElement();
UIColorBar.prototype.isUIButton = false;
UIColorBar.prototype.isUIColorBar = true;

UIColorBar.prototype.saveProps = ["barPosition"];
UIColorBar.prototype.initUIColorBar = function(type, w, h) {
	this.initUIElement(type);	

	this.setBarPosition(0);
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);
	this.barDierction = 0;

	return this;
}

UIColorBar.prototype.setBarDirection = function(direction) {
	this.barDirection = direction;

	return this;
}

UIColorBar.prototype.getBarDirection = function() {
	return this.barDirection;
}

UIColorBar.prototype.setBarPosition = function(position) {
	this.barPosition = position;

	return this;
}

UIColorBar.prototype.getBarPosition = function() {
	return this.barPosition;
}

UIColorBar.prototype.shapeCanBeChild = function(shape) {

	return shape.isUIImage || shape.isUIColorTile || shape.isUILabel;
}

UIColorBar.prototype.paintSelfOnly =function(canvas) {
	var ox = 0;
	var oy = 0;
	var v = this.barDirection;
	var n = this.style.lineWidth;
	
	canvas.beginPath();
	switch(this.barPosition) {
		case -1:	{
			break;
		}
		case 1:	{
			if(v) {
				ox = this.w - n;
			}
			else {
				oy = this.h - n;
			}
			break;
		}
		default: {
			if(v) {
				ox = Math.floor((this.w - n)>>1);
			}
			else {
				oy = Math.floor((this.h - n)>>1);
			}
		}
	}

	if(v) {
		canvas.moveTo(ox, 0);
		canvas.lineTo(ox, this.h);
	}
	else {
		canvas.moveTo(0, oy);
		canvas.lineTo(this.w, oy);
	}
	
	canvas.lineWidth = this.style.lineWidth;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

function UIColorBarCreator(w, h) {
	var args = ["ui-color-bar", "ui-color-bar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorBar();

		return g.initUIColorBar(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIColorBarCreator(100, 10));

