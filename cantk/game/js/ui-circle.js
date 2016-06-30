/*
 * File:   ui-circle.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic circle for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UICircle
 * @extends UIBody
 * 圆形刚体。
 */
function UICircle() {
	return;
}

UICircle.prototype = new UIBody();
UICircle.prototype.isUICircle = true;

UICircle.prototype.initUICircle = function(type, w, h) {
	this.initUIBody(type, w, h);	

	return this;
}

UICircle.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	return !shape.isUIPhysicsShape;
}

UICircle.prototype.resizeBody = function() {
	var x = this.left;
	var y = this.top;
	var r = Physics.toMeter(Math.min(this.getWidth(true)>>1, this.getHeight(true)>>1));
	var shape = this.body.GetFixtureList().GetShape();

	shape.SetRadius(r);
	this.body.SynchronizeFixtures();
	this.setLeftTop(x, y);
}

UICircle.prototype.drawShape = function(canvas) {
	var x = this.w >> 1;
	var y = this.h >> 1;
	var r = Math.min(this.getWidth(true)>>1, this.getHeight(true)>>1);

	canvas.arc(x, y, r, 0, Math.PI * 2);

	return;
}

function UICircleCreator() {
	var args = ["ui-circle", "ui-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICircle();
		return g.initUICircle(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UICircleCreator());

