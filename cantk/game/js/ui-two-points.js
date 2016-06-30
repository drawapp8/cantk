/*
 * File:   ui-two-points.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  two anchor points 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UITwoPoints
 * @extends UIElement
 * 两个点组成的控件。用来实现边(Edge)刚体和距离关节等。
 */
function UITwoPoints() {
	return;
}

UITwoPoints.prototype = new UIElement();
UITwoPoints.prototype.isUITwoPoints = true;

UITwoPoints.prototype.initUITwoPoints = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_POINT1, null);
	this.setImage(UIElement.IMAGE_POINT2, null);
	
	this.points = [{x:0, y:0}, {x:80, y:80}];
	this.savedPoints = [{x:0, y:0}, {x:80, y:80}];

	return this;
}

UITwoPoints.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.points = [{x:0, y:0}, {x:80, y:80}];
	o.points[0].x = this.points[0].x;
	o.points[0].y = this.points[0].y;
	o.points[1].x = this.points[1].x;
	o.points[1].y = this.points[1].y;

	o.x0Param = this.x0Param;
	o.x1Param = this.x1Param;
	o.y0Param = this.y0Param;
	o.y1Param = this.y1Param;

	return o;
}

UITwoPoints.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.points[0].x = js.points[0].x;
	this.points[0].y = js.points[0].y;
	this.points[1].x = js.points[1].x;
	this.points[1].y = js.points[1].y;
	this.x0Param = js.x0Param;
	this.x1Param = js.x1Param;
	this.y0Param = js.y0Param;
	this.y1Param = js.y1Param;


	return this;
}

UITwoPoints.prototype.relayout = function() {
	if(this.disableRelayout || this.isInDesignMode()) {
		return;
	}

	var p = getParentShapeOfShape(this);
	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);

	if(this.xAttr === UIElement.X_SCALE) {
		this.points[0].x = wParent * this.x0Param;
		this.points[1].x = wParent * this.x1Param;
	}
	
	if(this.yAttr === UIElement.Y_SCALE) {
		this.points[0].y = hParent * this.y0Param;
		this.points[1].y = hParent * this.y1Param;
	}

	return;
}

UITwoPoints.prototype.updateLayoutParams = function() {
	this.xParam = 1;
	this.yParam = 1;

	var p = this.parentShape;
	if(!p) {
		return;
	}

	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);
	
	if(this.xAttr === UIElement.X_SCALE) {
		this.x0Param = this.points[0].x / wParent;
		this.x1Param = this.points[1].x / wParent;
	}

	if(this.yAttr === UIElement.Y_SCALE) {
		this.y0Param = this.points[0].y / hParent;
		this.y1Param = this.points[1].y / hParent;
	}

    this.w = Math.abs(this.points[0].x - this.points[1].x);
    this.h = Math.abs(this.points[0].y - this.points[1].y);

	return;
}

UITwoPoints.prototype.drawSelectMarks = function(canvas) {
}

UITwoPoints.prototype.moveDelta = function(dx, dy) {
	this.points[0].x += dx;
	this.points[0].y += dy;
	this.points[1].x += dx;
	this.points[1].y += dy;

	return this;
}

UITwoPoints.prototype.setPositionByBody = function(x, y) {
    if(this.isUIEdge) {
        var dx = x - this.left;
        var dy = y - this.top;
        this.points[0].x += dx;
        this.points[0].y += dy;
        this.points[1].x += dx;
        this.points[1].y += dy;
    }
    UIElement.prototype.setPositionByBody.call(this, x, y);
}

UITwoPoints.prototype.paintSelf = function(canvas) {
	canvas.save();
	canvas.globalAlpha *=  this.opacity;
	var p1 = this.points[0];
	var p2 = this.points[1];
	if(this.isIcon) {
		this.translate(canvas);
		p1 = {x:p1.x+25, y:p1.y+25}
		p2 = {x:p2.x-25, y:p2.y-25}
	}

	var image = null;
	var srcRect = null;
	var bg = this.getImageByType(UIElement.IMAGE_DEFAULT);
	var p1Img = this.getImageByType(UIElement.IMAGE_POINT1);
	var p2Img = this.getImageByType(UIElement.IMAGE_POINT2);
	var r = this.anchorSize ? this.anchorSize : 5;

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	if(bg && bg.getImage()) {
		image = bg.getImage();
		srcRect = bg.getImageRect();
		UIElement.drawImageLine(canvas, image, this.images.display, p1, p2, srcRect);
	}
	else {
		canvas.beginPath();
		canvas.moveTo(p1.x, p1.y);
		canvas.lineTo(p2.x, p2.y);
		canvas.stroke();
	}

	if(p1Img && p1Img.getImage()) {
		image = p1Img.getImage();
		srcRect = p1Img.getImageRect();
		this.drawImageAt(canvas, image, WImage.DISPLAY_CENTER , p1.x-r, p1.y-r, r+r, r+r, srcRect);
	}
	else {
		canvas.beginPath();
		canvas.arc(p1.x, p1.y, r, 0, Math.PI * 2);
		canvas.fill();
	}

	if(p2Img && p2Img.getImage()) {
		image = p2Img.getImage();
		srcRect = p2Img.getImageRect();
		this.drawImageAt(canvas, image, WImage.DISPLAY_CENTER , p2.x-r, p2.y-r, r+r, r+r, srcRect);
	}
	else {
		canvas.beginPath();
		canvas.arc(p2.x, p2.y, r, 0, Math.PI * 2);
		canvas.fill();
	}

	canvas.restore();
	
	this.drawSelectMarks(canvas);

	return;
}

UITwoPoints.prototype.shapeCanBeChild = function(shape) {
	return false;
}

/**
 * @method getPoint
 * 获取点的坐标。 
 * @param {Number} index 索引。
 * @return {Point} 返回点的坐标。
 *
 */
UITwoPoints.prototype.getPoint = function(index) {
	return this.points[index ? 1 : 0];
}

UITwoPoints.prototype.getCenterX = function() {
	return (this.points[0].x + this.points[1].x)>>1;
}

UITwoPoints.prototype.getCenterY = function() {
	return (this.points[0].y + this.points[1].y)>>1;
}

/**
 * @method setPoint
 * 设置点的坐标。 
 * @param {Number} index 索引。
 * @param {Number} x
 * @param {Number} y
 * @return {UIElement} 返回控件本身。
 *
 */
UITwoPoints.prototype.setPoint = function(index, x, y) {
	var p = this.points[index ? 1 : 0];
	p.x = x;
	p.y = y;
	this.updateLayoutParams();

	return this;
}

/**
 * @method getDistance
 * 获取两点的距离。
 * @return {Number} 返回两点的距离。
 *
 */
UITwoPoints.prototype.getDistance = function() {
	return Math.round(Math.distanceBetween(this.points[0], this.points[1]));
}

/**
 * @method getAngle
 * 获取两点的的角度。
 * @return {Number} 返回两点的的角度。
 *
 */
UITwoPoints.prototype.getAngle = function() {
	return Math.lineAngle(this.points[0], this.points[1]);
}

