/*
 * File:   ui-distance-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  distance joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIDistanceJoint
 * @extends UITwoPoints
 * 把两个刚体链接在一起，保持它们的距离不变。
 *
 */
function UIDistanceJoint() {
	return;
}

UIDistanceJoint.prototype = new UITwoJoint();
UIDistanceJoint.prototype.isUIJoint = true;
UIDistanceJoint.prototype.isUIDistanceJoint = true;

UIDistanceJoint.prototype.saveProps = ["collideConnected", "frequencyHz", "dampingRatio", "disableBounce"];
UIDistanceJoint.prototype.initUIDistanceJoint = function(type, w, h) {
	this.initUITwoJoint(type, w, h);	
	
	this.frequencyHz = 4;
	this.dampingRatio = 0.5;
	this.disableBounce = false;
	this.collideConnected = true;

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

ShapeFactoryGet().addShapeCreator(new UIDistanceJointCreator());

