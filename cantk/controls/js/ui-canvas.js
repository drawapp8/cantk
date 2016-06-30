/*
 * File:   ui-canvas.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Canvas
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UICanvas
 * @extends UIElement
 * 画布控件。
 *
 * 注意：UICanvas其实与其它控件共享一个画布，只是把画布的接口暴露出来，所以每次窗口重绘时，里面的内容都被清除，需要重新绘制。
 *
 */

/**
 * @event onPaint(canvas2dCtx) 
 * 绘图事件。
 * @param {Object} canvas2dCtx 画布的2d Context。
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 *     @example small frame
 *     var image = this.getImageByType(0);
 *     var img = image.getImage();
 *     var rect = image.getImageRect();
 *
 *     canvas2dCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, this.w, this.h);
 *
 *     canvas2dCtx.moveTo(0, 0);
 *     canvas2dCtx.lineTo(this.w, this.h);
 *     canvas2dCtx.lineWidth = 2;
 *     canvas2dCtx.strokeStyle = "red";
 *     canvas2dCtx.stroke();
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
		"onKeyUp"]);

	this.setImage(UIElement.IMAGE_DEFAULT, null);
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

UICanvas.prototype.paintSelfOnly = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	
	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	canvas.beginPath();
	this.callOnPaintHandler(canvas);

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

