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

UITips.prototype = new UILabel();
UITips.prototype.isUITips = true;

UITips.prototype.saveProps = ["clickable", "triangleSize", "hTextAlign", "vTextAlign"];
UITips.prototype.initUITips = function(type) {
	this.initUILabel(type);	

	this.roundRadius = 8;
	this.triangleSize = 16;
	this.setMargin(20, 20);
	this.setClickable(true);
	this.setDefSize(200, 200);
	this.setSizeLimit(40, 40);
	this.handle = {x:-20, y:-20};

	return this;
}

UITips.prototype.getMoreSelectMark = function(type, point) {
	if(type === Shape.HIT_TEST_HANDLE) {
		point.x = this.handle.x;
		point.y = this.handle.y;

		return true;
	}

	return false;
}

UITips.prototype.getPointer = function() {
	return this.handle;
}

UITips.prototype.moveHandle = function(dx, dy) {
	return this.setPointer(this.handle.x + dx, this.handle.y + dy);
}

UITips.prototype.setPointer = function(x, y) {
	this.handle.x = x;
	this.handle.y = y;

	return this;
}

UITips.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return this;
}

UITips.prototype.fitToTextContent = function() {
	UILabel.prototype.fitToTextContent.call(this);
	var r = this.roundRadius;
	var triangleSize = this.triangleSize;

	var minSize = r + r + triangleSize;
	this.w = Math.max(this.w, minSize);
	this.h = Math.max(this.h, minSize);

	return this;
}

UITips.prototype.drawPath = function(canvas) {
	var x = 0;
	var y = 0;
	var r = this.roundRadius;
	var triangleSize = this.triangleSize;
	var px = this.handle.x;
	var py = this.handle.y;
	var hMargin = this.hMargin;
	var vMargin = this.vMargin;
	var minSize = r + r + triangleSize;
	this.w = Math.max(this.w, minSize);
	this.h = Math.max(this.h, minSize);

	var w = this.w;
	var h = this.h;
	var delta =  triangleSize >> 1;
	
	canvas.beginPath();
	function drawToRight() {
		canvas.lineTo(w-r, 0);
		canvas.arc(w-r, r, r, 1.5 * Math.PI, 2*Math.PI, false);
	}
	
	function drawToBottom() {
		canvas.lineTo(w, h-r);	
		canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
	}

	function drawToLeft() {
		canvas.lineTo(r, h);	
		canvas.arc(r, h-r, r, 0.5*Math.PI, Math.PI, false);
	}

	function drawToTop() {
		canvas.lineTo(0, r);
		canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	}

	function drawTLArc() {
		canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	}

	function drawTRArc() {
		canvas.arc(w-r, r, r, 1.5 * Math.PI, 2*Math.PI, false);
	}

	function drawBLArc() {
		canvas.arc(r, h-r, r, 0.5*Math.PI, Math.PI, false);
	}

	function drawBRArc() {
		canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
	}

	canvas.moveTo(px, py);
	if(px < r) {
		if(py < (r + delta)) {
			canvas.lineTo(r, 0);
			drawToRight();
			drawToBottom();
			drawToLeft();
			canvas.lineTo(0, r);
		}else if(py > (h-r-delta)) {
			canvas.lineTo(0, h-r);
			drawToTop();
			drawToRight();
			drawToBottom();
			canvas.lineTo(r, h);	
		}else {
			canvas.lineTo(0, py-delta);
			drawToTop();
			drawToRight();
			drawToBottom();
			drawToLeft();
			canvas.lineTo(0, py+delta);	
		}
	} else if(px < (w - r)) {
		if(py < r) {
			canvas.lineTo(px+delta, 0);
			drawToRight();
			drawToBottom();
			drawToLeft();
			drawToTop();
			canvas.lineTo(px-delta, 0);
		}
		else {
			canvas.lineTo(px-delta, h);
			drawToLeft();
			drawToTop();
			drawToRight();
			drawToBottom();
			canvas.lineTo(px+delta, h);
		}
	}else{
		if(py < (r + delta)) {
			canvas.lineTo(w, r);
			drawToBottom();
			drawToLeft();
			drawToTop();
			canvas.lineTo(w-r, 0);
		}else if(py > (h-r-delta)) {
			canvas.lineTo(w-r, h);
			drawToLeft();
			drawToTop();
			drawToRight();
			canvas.lineTo(w, h-r);	
		}else {
			canvas.lineTo(w, py+delta);
			drawToBottom();
			drawToLeft();
			drawToTop();
			drawToRight();
			canvas.lineTo(w, py-delta);	
		}
	}
	canvas.closePath();

	return;
}

UITips.prototype.paintSelfOnlyByColor = function(canvas) {
	this.drawPath(canvas);

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(!this.isStrokeColorTransparent()) {
		canvas.strokeStyle = this.style.lineColor;
		canvas.lineWidth = (this.pointerDown && this.clickable) ? 4 : 2;
		canvas.stroke();
	}

	return;
}

UITips.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		this.paintSelfOnlyByColor(canvas);
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
		return g.initUITips(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITipsCreator());

