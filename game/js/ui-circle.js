/*
 * File:   ui-circle.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic circle for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
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

UICircle.prototype.setSize = function(w, h) {
	this.w = Math.max(Math.floor(w), 2);
	this.h = Math.max(Math.floor(h), 2);

	this.onSized();

	return this;
}

UICircle.prototype.onSized = function() {
	var win = this.getWindow();
	this.updateLayoutParams();
	if(this.body && win && win.isUIScene) {
		var x = this.x;
		var y = this.y;
		var r = win.toMeter(Math.min(this.getWidth(true)>>1, this.getHeight(true)>>1));
		var shape = this.body.GetFixtureList().GetShape();
		shape.SetRadius(r);
		this.body.SynchronizeFixtures();
		this.setPosition(x, y);
	}
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

