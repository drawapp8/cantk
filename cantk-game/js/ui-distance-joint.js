/*
 * File:   ui-distance-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  distance joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDistanceJoint() {
	return;
}

UIDistanceJoint.prototype = new UITwoJoint();
UIDistanceJoint.prototype.isUIJoint = true;
UIDistanceJoint.prototype.isUIDistanceJoint = true;

UIDistanceJoint.prototype.initUIDistanceJoint = function(type, w, h) {
	this.initUITwoJoint(type, w, h);	
	this.visibleAtRunTime = true;

	return this;
}

function UIDistanceJointCreator() {
	var args = ["ui-distance-joint", "ui-distance-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDistanceJoint();
		return g.initUIDistanceJoint(this.type, 200, 200);
	}
	
	return;
}

