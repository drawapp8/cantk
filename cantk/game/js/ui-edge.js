/*
 * File:   ui-edge.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  edge shape
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIEdge
 * @extends UITwoPoints
 * 边刚体。可以用一些线段来模拟复杂的地形。边刚体是静态刚体，只能设置摩擦力和弹力系数。
 */
function UIEdge() {
	return;
}

UIEdge.prototype = new UITwoPoints();
UIEdge.prototype.isUIEdge = true;
UIEdge.prototype.isUIPhysicsShape = true;
UIEdge.prototype.saveProps = ["friction", "restitution", "density", "groupIndex"];

UIEdge.prototype.initUIEdge = function(type, w, h) {
	this.initUITwoPoints(type);	

	return this;
}

UIEdge.prototype.setEnable = function(enable) {
	this.enable = enable;
	if(this.body) {
		this.body.SetActive(enable);
	}

	return this;
}


UIEdge.prototype.onPositionChanged = function() {
	var win = this.win;
	if(this.body) {
		var parent = this.getParent();
		var p0 = parent.localToGlobal(this.points[0]);
		var p1 = parent.localToGlobal(this.points[1]);
		var x = (p0.x + p1.x) >> 1;
		var y = (p0.y + p1.y) >> 1;
		var p = {};
		p.x = win.toMeter(x); 
		p.y = win.toMeter(y); 
		
		this.body.SetPosition(p);
	}

	return; 
}

UIEdge.prototype.onBodyCreated = function() {
}

function UIEdgeCreator() {
	var args = ["ui-edge", "ui-edge", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIEdge();
		return g.initUIEdge(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIEdgeCreator());

