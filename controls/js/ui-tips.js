/*
 * File:   ui-tips.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Tips
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITips() {
	return;
}

UITips.prototype = new UIElement();
UITips.prototype.isUITips = true;

UITips.prototype.initUITips = function(type, bg) {
	this.initUIElement(type);	

	this.roundRadius = 8;
	this.setDefSize(200, 200);
	this.setClickable(true);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.pointerDirection = UITips.BOTTOM;
	this.pointerOffset = 1;
	this.pointer = {x:0, y:0};
	this.setMargin(20, 20);
	this.setSizeLimit(80, 80);
	this.autoAdjustHeight = true;

	this.style.setShadow(true, {x:0, y:0, shadowBlur:10, color: "white"});

	return this;
}

UITips.TOP = 0;
UITips.LEFT = 1;
UITips.RIGHT = 2;
UITips.BOTTOM = 3;

UITips.prototype.getPointer = function() {
	var x = 0;
	var y = 0;
	var minX = this.roundRadius+this.hMargin*2;
	var minY = this.roundRadius+this.vMargin*2;

	switch(this.pointerDirection) {
		case UITips.TOP: 
		case UITips.BOTTOM: {
			x = this.pointerOffset * this.w;
			x = Math.max(x, minX);
			x = Math.min(x, this.w-minX);

			y = this.pointerDirection === UITips.TOP ? 0 : this.h;
			break
		}
		case UITips.LEFT: 
		case UITips.RIGHT: { 
			y = this.pointerOffset * this.h;
			y = Math.max(y, minY);
			y = Math.min(y, this.h-minY);

			x = this.pointerDirection === UITips.LEFT ? 0 : this.w;
			break
		}
	}

	return {x:x, y:y};
}

UITips.prototype.getMoreSelectMark = function(type, point) {
	if(type === Shape.HIT_TEST_HANDLE) {
		point.x = this.pointer.x;
		point.y = this.pointer.y;

		return true;
	}

	return false;
}

UITips.prototype.moveHandle = function(dx, dy) {
	var hw = 0.5 * this.w;
	var hh = 0.5 * this.h;
	var delta = this.roundRadius + this.hMargin;
	var pointer = this.pointer;

	pointer.x += dx;
	pointer.y += dy;

	var x = pointer.x >= 0 ? pointer.x : 0;
	x = x < this.w ? x : this.w;

	var y = pointer.y >= 0 ? pointer.y : 0;
	y = y < this.h ? y : this.h;

	if(pointer.y < delta) {
		this.pointerOffset = (x/this.w);
		this.pointerDirection = UITips.TOP;	
	}
	else if(pointer.y < (this.h-delta)){
		this.pointerOffset = (y/this.h);
		this.pointerDirection = pointer.x < hw ? UITips.LEFT : UITips.RIGHT;	
	}
	else {
		this.pointerOffset = (x/this.w);
		this.pointerDirection = UITips.BOTTOM;	
	}

	this.pointer = pointer;

	return;
}


UITips.prototype.setAutoAdjustHeight = function(autoAdjustHeight) {
	this.autoAdjustHeight = autoAdjustHeight;

	return true;
}

UITips.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return;
}

UITips.prototype.drawPath = function(canvas) {
	var x = this.hMargin/2;
	var y = this.vMargin/2;
	var w = this.getWidth(true) + this.hMargin;
	var h = this.getHeight(true) + this.vMargin;
	var pointer = this.getPointer();
	var px = pointer.x;
	var py = pointer.y;
	var delta = this.hMargin * 0.75;
	var r = this.roundRadius;
	
	var rx = x + w - r;
	var ry = y + h - r;
	var rw = x + w;
	var rh = y + h;

	/*top*/
	if(py <= y && (px > x && px < rw)) {
		py = 0;

		if(px < (x + r + delta)) {
			px = x + r + delta;
		}
		canvas.moveTo(px-delta, y);
		canvas.lineTo(px, py);
		canvas.lineTo(px+delta, y);
		canvas.lineTo(rx, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);
		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
		canvas.lineTo(px-delta, y);
	}
	else if(py > y && (px > x && px < rw)) {
		/*bottom*/
		py = this.h;
		if(px < (x + r + delta)) {
			px = x + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);

		canvas.lineTo(px + delta, rh);
		canvas.lineTo(px, py);
		canvas.lineTo(px - delta, rh);

		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);
		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}
	else if(px <= x && (py > y && py < rh)) {
	/*left*/
		px = 0;

		if(py < (y + r + delta)) {
			py = y + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);

		canvas.lineTo(x, py+delta);
		canvas.lineTo(px, py);
		canvas.lineTo(x, py-delta);

		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}
	else if(px > x && (py > y && py < rh)) {
		/*right*/
		px = this.w;

		if(py < (y + r + delta)) {
			py = y + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);

		canvas.lineTo(rw, py-delta);
		canvas.lineTo(px, py);
		canvas.lineTo(rw, py+delta);

		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);

		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}

	return;
}

UITips.prototype.paintSelfOnlyAndroid =function(canvas) {
	canvas.beginPath();
	this.drawPath(canvas);
	canvas.fill();
	
	canvas.lineWidth = (this.pointerDown && this.clickable) ? 6 : 3;
	canvas.strokeStyle = "Gray";
	canvas.stroke();
	
	canvas.lineWidth = 1;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

UITips.prototype.paintSelfOnly =function(canvas) {
	if(this.autoAdjustHeight && (!this.children || !this.children.length)) {
		var textHeight = this.getTextHeight();
		this.h = textHeight + this.vMargin * 2 + this.style.fontSize;
	}

	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		if(isAndroid()) {
			/*Avoid Shadow Bugs on android.*/
			return this.paintSelfOnlyAndroid(canvas);
		}

		var style = this.style;
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y;
		canvas.shadowBlur    = style.shadow.blur;
		canvas.beginPath();
		this.drawPath(canvas);
		canvas.fill();

		if(this.pointerDown && this.clickable) {
			canvas.lineWidth = 3;
			canvas.shadowBlur = 2 * canvas.shadowBlur;
		}
		else {
			canvas.lineWidth = 2;
			canvas.shadowBlur = 0;
		}
		canvas.stroke();
		
		canvas.shadowBlur = 0;
	}

	return;
}

UITips.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UITipsCreator() {
	var args = ["ui-tips", "ui-tips", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITips();
		return g.initUITips(this.type, null);
	}
	
	return;
}
