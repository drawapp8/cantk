/*
 * File:   ui-revolute-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIRevoluteJoint() {
	return;
}

UIRevoluteJoint.prototype = new UIOneJoint();
UIRevoluteJoint.prototype.isUIJoint = true;
UIRevoluteJoint.prototype.isUIRevoluteJoint = true;

UIRevoluteJoint.prototype.initUIRevoluteJoint = function(type) {
	this.initUIOneJoint(type);	
	
	return this;
}

UIRevoluteJoint.prototype.setValue = UIRevoluteJoint.prototype.setMotorSpeed = function(motorSpeed) {
	if(this.joint) {
		this.joint.SetMotorSpeed(motorSpeed);
	}

	return this;
}

UIRevoluteJoint.prototype.getValue = UIRevoluteJoint.prototype.getMotorSpeed = function() {
	if(this.joint) {
		return this.joint.GetMotorSpeed();
	}

	return 0;
}

UIRevoluteJoint.prototype.recreateJoint = function() {
	var world = this.getWindow().world;

	if(world) {
		Physics.destroyJointForElement(world, this);
		Physics.createJoint(world, this);
	}

	return;
}

function UIRevoluteJointCreator() {
	var args = ["ui-revolute-joint", "ui-revolute-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRevoluteJoint();
		return g.initUIRevoluteJoint(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIRevoluteJointCreator());

