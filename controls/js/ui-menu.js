/*
 * File:   ui-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIMenu() {
	return;
}

UIMenu.ARROW_AT_TL = 1;
UIMenu.ARROW_AT_TM = 2;
UIMenu.ARROW_AT_TR = 3;
UIMenu.ARROW_AT_BL = 4;
UIMenu.ARROW_AT_BM = 5;
UIMenu.ARROW_AT_BR = 6;

UIMenu.prototype = new UIList();
UIMenu.prototype.isUIMenu = true;

UIMenu.prototype.initUIMenu = function(type) {
	this.initUIList(type, 5, 114, null);
	this.setAlwaysOnTop(true);

	return this;
}

UIMenu.prototype.onModeChanged = function() {
	if(this.mode === Shape.MODE_EDITING) {
		this.setVisible(true);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIMenu.prototype.show = function(callerElement) {
	this.showDown = true;
	this.fromLeft =  true;

	this.callerElement = callerElement;
	if(callerElement) {
		var y = this.y;
		var x = callerElement.x;
		var winH = this.getWindow().h;
		var winW = this.getWindow().w;
		var pos = callerElement.getPositionInWindow();

		if((pos.y + callerElement.h + this.h) < winH || pos.y < winH * 0.3) {
			y = pos.y + callerElement.h;
		}
		else {
			y = pos.y - this.h;
			this.showDown = false;
		}

		if(pos.x > 0.6 * winW) {
			this.fromLeft = false;
			x = (pos.x + callerElement.w - this.w);
		}

		if((x + this.w) > winW) {
			x = winW - this.w;
			this.fromLeft = false;
		}

		this.x = x;
		this.y = y;
	}

	var animHint = "";
	if(this.showDown) {
		animHint = this.fromLeft ? "anim-scale1-show-origin-topleft" : "anim-scale1-show-origin-topright";
	}
	else {
		animHint = this.fromLeft ? "anim-scale1-show-origin-bottomleft" : "anim-scale1-show-origin-bottomright";
	}
	
	this.animShow(animHint);
	this.getWindow().grab(this);

	return;
}

UIMenu.prototype.hide = function(animHint) {
	if(!this.visible) {
		return;
	}

	if(animHint) {
		if(this.showDown) {
			animHint = this.fromLeft ? "anim-scale1-hide-origin-topleft" : "anim-scale1-hide-origin-topright";
		}
		else {
			animHint = this.fromLeft ? "anim-scale1-hide-origin-bottomleft" : "anim-scale1-hide-origin-bottomright";
		}

		this.animHide(animHint);
	}
	else {
		this.setVisible(false);
	}

	this.getWindow().ungrab(this);
	delete this.showDown;
	delete this.fromLeft;
	delete this.callerElement;

	return;
}

UIMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!beforeChild) {
		this.hide("default");
	}

	return;
}

UIMenu.prototype.fixListItemImage = function(item, position) {
	return;
}

UIMenu.prototype.getItemHeight = function() {
	var n = this.children.length;
	if(n) {
		var itemHeight = this.getHeight(true) / n;

		return Math.min(itemHeight, 160);
	}

	return this.itemHeight;
}

UIMenu.prototype.setArrowPosition = function(arrowPosition) {
	this.arrowPosition = arrowPosition;

	return;
}

UIMenu.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();
	var roundRadius = this.roundRadius ? this.roundRadius : 0;

	if(image) {
		return;
	}
	
	canvas.beginPath();
	canvas.lineWidth = 2;
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;
	drawRoundRect(canvas, this.w, this.h, roundRadius);
	canvas.fill();
	canvas.stroke();

	var size = Math.floor(this.scaleForCurrentDensity(10));
	var arrowPosition = this.arrowPosition ? this.arrowPosition : 0;

	var h = this.h;
	var halfSize = size >> 1;
	function drawUpArrow(offset) {
		var y = 0;
		canvas.beginPath();
		canvas.moveTo(offset, y+2);
		canvas.lineTo(offset + halfSize, y-halfSize);
		canvas.lineTo(offset + size, y+2);
		canvas.lineTo(offset, y+2);
		canvas.fill();

		canvas.beginPath();
		canvas.moveTo(offset, y);
		canvas.lineTo(offset + halfSize, y-halfSize);
		canvas.lineTo(offset + size, y);
		canvas.stroke();

		return;
	}
	
	function drawDownArrow(offset) {
		var y = h;
		canvas.beginPath();
		canvas.moveTo(offset, y-2);
		canvas.lineTo(offset + halfSize, y+halfSize);
		canvas.lineTo(offset + size, y-2);
		canvas.lineTo(offset, y-2);
		canvas.fill();

		canvas.beginPath();
		canvas.moveTo(offset, y);
		canvas.lineTo(offset + halfSize, y+halfSize);
		canvas.lineTo(offset + size, y);
		canvas.stroke();

		return;
	}

	switch(arrowPosition) {
		case UIMenu.ARROW_AT_TL: {
			var offset = Math.max(roundRadius, this.w >> 3);
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_TM: {
			var offset = Math.max(roundRadius, (this.w - size)>> 1);
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_TR: {
			var offset = this.w - Math.max(roundRadius, this.w >> 3) - size;
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BL: {
			var offset = Math.max(roundRadius, this.w >> 3);
			drawDownArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BM: {
			var offset = Math.max(roundRadius, (this.w - size)>> 1);
			drawDownArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BR: {
			var offset = this.w - Math.max(roundRadius, this.w >> 3) - size;
			drawDownArrow(offset);
			break;
		}
		default:break;
	}

	return;
}

function UIMenuCreator() {
	var args = ["ui-menu", "ui-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMenu();
		return g.initUIMenu(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIMenuCreator());

