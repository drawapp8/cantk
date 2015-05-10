/*
 * File:   ui-canvas.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Canvas
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICanvas() {
	return;
}

UICanvas.prototype = new UIElement();
UICanvas.prototype.isUICanvas = true;

UICanvas.prototype.initUICanvas = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.addEventNames(["onPaint", "onPointerDown", "onPointerMove", "onPointerUp", "onKeyDown", 
		"onKeyUp", "onLongPress", "onDoubleClick"]);

	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	
	return this;
}

UICanvas.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUILabel;
}

UICanvas.prototype.paintSelfOnly =function(canvas) {
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();
	if(this.mode === Shape.MODE_EDITING) {
		canvas.fillRect(0, 0, this.w, this.h);
	}
	this.callOnPaintHandler(canvas);
	canvas.restore();

	return;
}

function UICanvasCreator(w, h) {
	var args = ["ui-canvas", "ui-canvas", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICanvas();
		return g.initUICanvas(this.type, w, h);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UICanvasCreator(200, 200));

