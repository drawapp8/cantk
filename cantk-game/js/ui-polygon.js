/*
 * File:   ui-polygon.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic polygon for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPolygon() {
	return;
}

UIPolygon.prototype = new UIBody();
UIPolygon.prototype.isUIPolygon = true;

UIPolygon.prototype.initUIPolygon = function(type, w, h) {
	this.initUIBody(type, w, h);	

	return this;
}

UIPolygon.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	if(shape.isUIPoint) {
		return true;
	}

	return !shape.isUIPhysicsShape;
}

UIPolygon.prototype.paintChildren = function(canvas) {
	if(!this.isIcon) {
		this.defaultPaintChildren(canvas);
	}

	if(this.isStrokeColorTransparent()) {
		return;
	}

	var x0 = 0;
	var y0 = 0;

	canvas.beginPath();
	canvas.strokeStyle = this.style.lineColor;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.isUIPoint) {
			continue;
		}

		var x = iter.x + (iter.w >> 1);
		var y = iter.y + (iter.h >> 1);

		if(i%5 === 0) {
			x0 = x;
			y0 = y;
			if(i > 0) {
				canvas.closePath();
			}
			canvas.moveTo(x, y);
		}
		else {
			canvas.lineTo(x, y);
		}
	}
	canvas.lineTo(x0, y0);
	canvas.lineWidth = 1;
	canvas.stroke();

	return;
}

UIPolygon.prototype.paintSelfOnly = function(canvas) {
	if(this.mode === Shape.MODE_EDITING || this.isIcon) {
		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = this.style.lineColor;
		canvas.rect(0, 0, this.w, this.h);
		canvas.fill();
		canvas.stroke();
	}

	return;
}

function UIPolygonCreator() {
	var args = ["ui-polygon", "ui-polygon", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPolygon();
		return g.initUIPolygon(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPolygonCreator());

