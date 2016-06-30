/*
 * File:   ui-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic box for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIBox
 * @extends UIBody
 * 方形刚体。
 */
function UIBox() {
	return;
}

UIBox.prototype = new UIBody();
UIBox.prototype.isUIBox = true;

UIBox.prototype.initUIBox = function(type, w, h) {
	this.initUIBody(type, w, h);	

	return this;
}

UIBox.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	return !shape.isUIPhysicsShape;
}

UIBox.prototype.resizeBody = function() {
	var x = this.left;
	var y = this.top;
	var hw = this.getWidth(true) >> 1;
	var hh = this.getHeight(true) >> 1;
	var shape = this.body.GetFixtureList().GetShape();

	shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));
	this.body.SynchronizeFixtures();
	this.setLeftTop(x, y);
}

UIBox.prototype.drawShape = function(canvas) {
	var x = this.getHMargin();
	var y = this.getVMargin();
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	
	canvas.rect(x, y, w, h);

	return;
}

function UIBoxCreator() {
	var args = ["ui-box", "ui-box", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBox();
		return g.initUIBox(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIBoxCreator());

