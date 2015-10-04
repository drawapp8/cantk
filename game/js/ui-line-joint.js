/*
 * File:   ui-line-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  line joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILineJoint() {
	return;
}

UILineJoint.prototype = new UITwoJoint();
UILineJoint.prototype.isUIJoint = true;
UILineJoint.prototype.isUILineJoint = true;

UILineJoint.prototype.initUILineJoint = function(type, w, h) {
	this.initUITwoJoint(type, w, h);	

	return this;
}

function UILineJointCreator() {
	var args = ["ui-line-joint", "ui-line-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILineJoint();
		return g.initUILineJoint(this.type, 200, 200);
	}
	
	return;
}

