/*
 * File:   ui-weld-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWeldJoint() {
	return;
}

UIWeldJoint.prototype = new UIOneJoint();
UIWeldJoint.prototype.isUIJoint = true;
UIWeldJoint.prototype.isUIWeldJoint = true;

UIWeldJoint.prototype.initUIWeldJoint = function(type) {
	this.initUIOneJoint(type);	
	
	return this;
}

function UIWeldJointCreator() {
	var args = ["ui-weld-joint", "ui-weld-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWeldJoint();
		return g.initUIWeldJoint(this.type);
	}
	
	return;
}
