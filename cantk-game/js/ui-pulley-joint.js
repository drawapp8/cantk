/*
 * File:   ui-pulley-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  pulley joint 
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPulleyJoint() {
	return;
}

UIPulleyJoint.prototype = new UIFourJoint();
UIPulleyJoint.prototype.isUIJoint = true;
UIPulleyJoint.prototype.isUIPulleyJoint = true;

UIPulleyJoint.prototype.initUIPulleyJoint = function(type, w, h) {
	this.initUIFourJoint(type, w, h);	
	this.visibleAtRunTime = true;

	return this;
}

function UIPulleyJointCreator() {
	var args = ["ui-pulley-joint", "ui-pulley-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPulleyJoint();
		return g.initUIPulleyJoint(this.type, 200, 200);
	}
	
	return;
}

