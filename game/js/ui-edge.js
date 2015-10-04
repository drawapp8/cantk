/*
 * File:   ui-edge.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  edge shape
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIEdge() {
	return;
}

UIEdge.prototype = new UITwoPoints();
UIEdge.prototype.isUIEdge = true;
UIEdge.prototype.isUIPhysicsShape = true;

UIEdge.prototype.initUIEdge = function(type, w, h) {
	this.initUITwoPoints(type);	

	return this;
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

