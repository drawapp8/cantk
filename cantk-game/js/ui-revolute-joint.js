/*
 * File:   ui-revolute-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIRevoluteJoint() {
	return;
}

UIRevoluteJoint.prototype = new UIOneJoint();
UIRevoluteJoint.prototype.isUIJoint = true;
UIRevoluteJoint.prototype.isUIRevoluteJoint = true;

UIRevoluteJoint.prototype.initUIRevoluteJoint = function(type, w, h, bg) {
	this.initUIOneJoint(type, w, h, bg);	
	
	return this;
}
function UIRevoluteJointCreator() {
	var args = ["ui-revolute-joint", "ui-revolute-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRevoluteJoint();
		return g.initUIRevoluteJoint(this.type, 20, 20, null);
	}
	
	return;
}
