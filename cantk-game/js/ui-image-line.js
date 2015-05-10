/*
 * File:   ui-image-line.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: image line 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageLine() {
	return;
}

UIImageLine.prototype = new UITwoPoints();
UIImageLine.prototype.isUIImageLine = true;

UIImageLine.prototype.initUIImageLine = function(type, w, h) {
	this.initUITwoPoints(type);	
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

UIImageLine.prototype.paintSelf = function(canvas) {
	var image = this.getBgImage();
	if(image && image.getImage()){
		canvas.save();
		if(this.isIcon) {
			this.translate(canvas);
		}

		var p0 = this.points[0];
		var p1 = this.points[1];
		var srcRect = image.getImageRect();
		UIElement.drawImageLine(canvas, image.getImage(), this.images.display, p0, p1, srcRect);
		this.drawSelectMarks(canvas);
		canvas.restore();
	}
	else {
		UITwoPoints.prototype.paintSelf.call(this, canvas);
	}

	return;
}

function UIImageLineCreator() {
	var args = ["ui-image-line", "ui-image-line", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageLine();
		return g.initUIImageLine(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageLineCreator());

