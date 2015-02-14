/*
 * File:   ui-four-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  four anchor joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFourJoint() {
	return;
}

UIFourJoint.prototype = new UIElement();
UIFourJoint.prototype.isUIJoint = true;
UIFourJoint.prototype.isUIFourJoint = true;

UIFourJoint.prototype.initUIFourJoint = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.points = [{x:0, y:80}, {x:0, y:0}, {x:80, y:0},{x:80, y:80}];
	this.regSerializer(this.fourJointToJson, this.fourJointFromJson);

	return this;
}

UIFourJoint.prototype.fourJointToJson = function(o) {
	o.points = [{}, {},{},{}];
	o.points[0].x = this.points[0].x;
	o.points[0].y = this.points[0].y;
	o.points[1].x = this.points[1].x;
	o.points[1].y = this.points[1].y;
	o.points[2].x = this.points[2].x;
	o.points[2].y = this.points[2].y;
	o.points[3].x = this.points[3].x;
	o.points[3].y = this.points[3].y;

	return;
}

UIFourJoint.prototype.fourJointFromJson = function(js) {
	if(js.points) {
		this.points = js.points;
	}

	return;
}

UIFourJoint.prototype.asIcon = function() {
	if(!this.isIcon) {
		this.isIcon = true;
		this.points = [{x:0, y:80}, {x:20, y:0}, {x:60, y:0},{x:80, y:80}];
	}

	return;
}

UIFourJoint.prototype.relayout = function() {
	if(this.disableRelayout || this.mode === Shape.MODE_EDITING) {
		return;
	}

	var p = getParentShapeOfShape(this);
	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);

	if(this.xAttr === UIElement.X_SCALE) {
		this.points[0].x = wParent * this.x0Param;
		this.points[1].x = wParent * this.x1Param;
		this.points[2].x = wParent * this.x2Param;
		this.points[3].x = wParent * this.x3Param;
	}
	
	if(this.yAttr === UIElement.Y_SCALE) {
		this.points[0].y = hParent * this.y0Param;
		this.points[1].y = hParent * this.y1Param;
		this.points[2].y = hParent * this.y2Param;
		this.points[3].y = hParent * this.y3Param;
	}

	return;
}

UIFourJoint.prototype.updateLayoutParams = function() {
	this.xParam = 1;
	this.yParam = 1;

	var p = this.parentShape;
	if(!p) {
		return;
	}

	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);
	
	if(this.xAttr === UIElement.X_SCALE) {
		this.x0Param = this.points[0].x / wParent;
		this.x1Param = this.points[1].x / wParent;
		this.x2Param = this.points[2].x / wParent;
		this.x3Param = this.points[3].x / wParent;
	}

	if(this.yAttr === UIElement.Y_SCALE) {
		this.y0Param = this.points[0].y / hParent;
		this.y1Param = this.points[1].y / hParent;
		this.y2Param = this.points[2].y / hParent;
		this.y3Param = this.points[3].y / hParent;
	}

	return;
}

UIFourJoint.prototype.hitTest = function(point) {
	if(Math.distanceBetween(point, this.points[0]) < 20) {
		return 1;
	}

	if(Math.distanceBetween(point, this.points[1]) < 20) {
		return 2;
	}

	if(Math.distanceBetween(point, this.points[2]) < 20) {
		return 3;
	}
	
	if(Math.distanceBetween(point, this.points[3]) < 20) {
		return 4;
	}

	return Shape.HIT_TEST_NONE;
}

UIFourJoint.prototype.getSelectMark = function(type, point) {
	var n =  this.points.length;
	if(type <= n) {
		point.x = this.points[type-1].x;
		point.y = this.points[type-1].y;

		return true;
	}

	return false;
}

UIFourJoint.prototype.onAppendedInParent = function() {
	if(this.isCreatingElement()) {
		var parentShape = this.getParent();
		var p = parentShape.getPositionInView();

		this.points[0].x -= p.x;
		this.points[0].y -= p.y;
		
		this.points[1].x -= p.x;
		this.points[1].y -= p.y;
		
		this.points[2].x -= p.x;
		this.points[2].y -= p.y;
		
		this.points[3].x -= p.x;
		this.points[3].y -= p.y;
	}

	return;
}

UIFourJoint.prototype.drawSelectMarks = function(canvas) {
	return UITwoJoint.prototype.drawSelectMarks.call(this, canvas);
}

UIFourJoint.prototype.getMinMaxX = function() {
	var max = this.points[0].x;
	var min = max;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(p.x > max) {
			max = p.x;
		}
		if(p.x < min) {
			min = p.x;
		}
	}

	return {min:min, max:max};
}

UIFourJoint.prototype.getMinMaxY = function() {
	var max = this.points[0].y;
	var min = max;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(p.y > max) {
			max = p.y;
		}
		if(p.y < min) {
			min = p.y;
		}
	}

	return {min:min, max:max};
}

UIFourJoint.prototype.getX = function() {
	return this.getMinMaxX().min;
}

UIFourJoint.prototype.getY = function() {
	return this.getMinMaxY().min;
}

UIFourJoint.prototype.getWidth = function() {
	var range = this.getMinMaxX();

	return range.max - range.min;
}

UIFourJoint.prototype.getHeight = function() {
	var range = this.getMinMaxY();

	return range.max - range.min;
}

UIFourJoint.prototype.paintSelf = function(canvas) {
	canvas.save();
	if(this.isIcon) {
		this.translate(canvas);
	}

	var r = this.anchorSize ? this.anchorSize : 5;
	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;
	
	canvas.beginPath();
	canvas.moveTo(this.points[0].x, this.points[0].y);
	canvas.lineTo(this.points[1].x, this.points[1].y);
	canvas.lineTo(this.points[2].x, this.points[2].y);
	canvas.lineTo(this.points[3].x, this.points[3].y);
	canvas.stroke();
	
	canvas.beginPath();
	canvas.arc(this.points[0].x, this.points[0].y, r, 0, Math.PI * 2);
	canvas.fill();
	canvas.beginPath();
	canvas.arc(this.points[1].x, this.points[1].y, r, 0, Math.PI * 2);
	canvas.fill();
	canvas.beginPath();
	canvas.arc(this.points[2].x, this.points[2].y, r, 0, Math.PI * 2);
	canvas.fill();
	canvas.beginPath();
	canvas.arc(this.points[3].x, this.points[3].y, r, 0, Math.PI * 2);
	canvas.fill();

	canvas.beginPath();

	canvas.restore();
	
	this.drawSelectMarks(canvas);

	return;
}

UIFourJoint.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIFourJoint.prototype.onPointerDownNormal = function(point) {
	this.hitTestResult = this.hitTest(point);
	this.selected = this.hitTestResult != Shape.HIT_TEST_NONE;

	return this.hitTestResult;
}

UIFourJoint.prototype.onPointerMoveNormal = function(point) {
	 if(this.mode === Shape.MODE_EDITING && this.hitTestResult > 0) {
	 	var index = this.hitTestResult - 1;
	 	this.points[index].x = point.x;
	 	this.points[index].y = point.y;
	 }
}

UIFourJoint.prototype.onPointerUpNormal = function(point) {
	this.hitTestResult = Shape.HIT_TEST_NONE;

	return;
}

UIFourJoint.prototype.onPointerDownCreating = function(point) {
	switch(this.state) {
		case Shape.STAT_CREATING_0: {
			this.state = Shape.STAT_NORMAL;
		}
		default: {
			return false;
		}
	}
}

UIFourJoint.prototype.onPointerMoveCreating = function(point) {
	switch(this.state) {
		case Shape.STAT_CREATING_0: {
			this.points[0].x = point.x;
			this.points[0].y = point.y + 80;
			this.points[1].x = point.x + 20;
			this.points[1].y = point.y;
			this.points[2].x = point.x + 60;
			this.points[2].y = point.y;
			this.points[3].x = point.x + 80;
			this.points[3].y = point.y + 80;
			return true;
		}
		default: {
			return false;
		}
	}
}

function UIFourJointCreator() {
	var args = ["ui-four-joint", "ui-four-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFourJoint();
		return g.initUIFourJoint(this.type, 200, 200);
	}
	
	return;
}

