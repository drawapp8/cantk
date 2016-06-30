/*
 * File:   ui-two-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  two anchor joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITwoJoint() {
	return;
}

UITwoJoint.prototype = new UITwoPoints();
UITwoJoint.prototype.isUIJoint = true;
UITwoJoint.prototype.isUITwoJoint = true;

UITwoJoint.prototype.initUITwoJoint = function(type, w, h) {
	this.initUITwoPoints(type);	

	return this;
}

function UITwoJointCreator() {
	var args = ["ui-two-joint", "ui-two-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITwoJoint();
		return g.initUITwoJoint(this.type, 200, 200);
	}
	
	return;
}

