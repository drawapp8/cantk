/*
 * File:   ui-two-points.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  two anchor points 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITwoPoints() {
	return;
}

UITwoPoints.prototype = new UIElement();

UITwoPoints.prototype.initUITwoPoints = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.points = [{x:0, y:0}, {x:80, y:80}];
	this.regSerializer(this.twoPointsToJson, this.twoPointsFromJson);

	return this;
}

UITwoPoints.prototype.twoPointsToJson = function(o) {
	o.points = [{x:0, y:0}, {x:80, y:80}];
	o.points[0].x = this.points[0].x;
	o.points[0].y = this.points[0].y;
	o.points[1].x = this.points[1].x;
	o.points[1].y = this.points[1].y;

	return;
}

UITwoPoints.prototype.twoPointsFromJson = function(js) {
	if(js.points) {
		this.points[0].x = js.points[0].x;
		this.points[0].y = js.points[0].y;
		this.points[1].x = js.points[1].x;
		this.points[1].y = js.points[1].y;
	}

	return;
}

UITwoPoints.prototype.asIcon = function() {
	if(!this.isIcon) {
		this.isIcon = true;
		this.points = [{x:0, y:0}, {x:80, y:80}];
	}

	return;
}

UITwoPoints.prototype.relayout = function() {
	if(this.disableRelayout || this.mode === Shape.MODE_EDITING) {
		return;
	}

	var p = getParentShapeOfShape(this);
	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);

	if(this.xAttr === UIElement.X_SCALE) {
		this.points[0].x = wParent * this.x0Param;
		this.points[1].x = wParent * this.x1Param;
	}
	
	if(this.yAttr === UIElement.Y_SCALE) {
		this.points[0].y = hParent * this.y0Param;
		this.points[1].y = hParent * this.y1Param;
	}

	return;
}

UITwoPoints.prototype.updateLayoutParams = function() {
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
	}

	if(this.yAttr === UIElement.Y_SCALE) {
		this.y0Param = this.points[0].y / hParent;
		this.y1Param = this.points[1].y / hParent;
	}

	return;
}

UITwoPoints.prototype.hitTest = function(point) {
	if(Math.distanceBetween(point, this.points[0]) < 20) {
		return 1;
	}

	if(Math.distanceBetween(point, this.points[1]) < 20) {
		return 2;
	}

	var cp = {};
	cp.x = (this.points[0].x + this.points[1].x)>>1;
	cp.y = (this.points[0].y + this.points[1].y)>>1;

	if(Math.distanceBetween(point, cp) < 30) {
		return Shape.HIT_TEST_MM;
	}

	return Shape.HIT_TEST_NONE;
}

UITwoPoints.prototype.getSelectMark = function(type, point) {
	var n =  this.points.length;
	if(type <= n) {
		point.x = this.points[type-1].x;
		point.y = this.points[type-1].y;

		return true;
	}

	return false;
}

UITwoPoints.prototype.onAppendedInParent = function() {
	if(this.isCreatingElement()) {
		var parentShape = this.getParent();
		var p = parentShape.getPositionInView();

		this.points[0].x -= p.x;
		this.points[0].y -= p.y;
		
		this.points[1].x -= p.x;
		this.points[1].y -= p.y;
	}

	return;
}

UITwoPoints.prototype.drawSelectMarks = function(canvas) {
	if(this.mode !== Shape.MODE_EDITING) {
		return;
	}

	canvas.save();
	canvas.beginPath();
	
	if(this.selected && !this.hideSelectMark) {
		var lineWidth = Math.floor(2/this.getRealScale());

		canvas.lineWidth = lineWidth;			
		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = RShape.selectMarkColor;
		canvas.stroke();	
		
		canvas.beginPath();
		canvas.lineWidth = lineWidth;
		
		for(var type = Shape.HIT_TEST_NONE + 1; 
			type < Shape.HIT_TEST_MAX; type++) {
			if(this.getSelectMark(type, this.selectMarkPoint)) {
				this.createSelectedMark(canvas, this.selectMarkPoint.x, this.selectMarkPoint.y, type == this.hitTestResult);
			}
		}
		canvas.closePath();
		canvas.stroke();
	}

	canvas.restore();
	
	return;
}

UITwoPoints.prototype.getX = function() {
	return Math.min(this.points[0].x, this.points[1].x);
}

UITwoPoints.prototype.getY = function() {
	return Math.min(this.points[0].y, this.points[1].y);
}

UITwoPoints.prototype.getWidth = function() {
	return Math.abs(this.points[0].x - this.points[1].x);
}

UITwoPoints.prototype.getHeight = function() {
	return Math.abs(this.points[0].y - this.points[1].y);
}

UITwoPoints.prototype.paintSelf = function(canvas) {
	canvas.save();
	if(this.isIcon) {
		this.translate(canvas);
	}

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	canvas.moveTo(this.points[0].x, this.points[0].y);
	canvas.lineTo(this.points[1].x, this.points[1].y);
	canvas.stroke();

	var r = this.anchorSize ? this.anchorSize : 5;
	canvas.beginPath();
	canvas.arc(this.points[0].x, this.points[0].y, r, 0, Math.PI * 2);
	canvas.arc(this.points[1].x, this.points[1].y, r, 0, Math.PI * 2);
	canvas.fill();

	canvas.restore();
	
	this.drawSelectMarks(canvas);

	return;
}

UITwoPoints.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UITwoPoints.prototype.getPoint = function(index) {
	return this.points[index ? 1 : 0];
}

UITwoPoints.prototype.setPoint = function(index, x, y) {
	var p = this.points[index ? 1 : 0];
	p.x = x;
	p.y = y;

	return;
}

UITwoPoints.prototype.getDistance = function() {
	return Math.round(Math.distanceBetween(this.points[0], this.points[1]));
}

UITwoPoints.prototype.getAngle = function() {
	return Math.lineAngle(this.points[0], this.points[1]);
}

UITwoPoints.prototype.onPointerDownCreating = function(point) {
	switch(this.state) {
		case Shape.STAT_CREATING_0: {
			this.points[0].x = point.x;
			this.points[0].y = point.y;
			this.state = Shape.STAT_CREATING_1;

			return true;
		}
		case Shape.STAT_CREATING_1: {
			return true;
		}
		default: {
			return false;
		}
	}
}

UITwoPoints.prototype.onPointerMoveCreating = function(point) {
	switch(this.state) {
		case Shape.STAT_CREATING_0: {
			this.points[0].x = point.x;
			this.points[0].y = point.y;
			this.points[1].x = point.x + 50;
			this.points[1].y = point.y + 50;
			return true;
		}
		case Shape.STAT_CREATING_1: {
			this.points[1].x = point.x;
			this.points[1].y = point.y;
			return true;
		}
		default: {
			return false;
		}
	}
}

UITwoPoints.prototype.onPointerUpCreating = function(point) {
	switch(this.state) {
		case Shape.STAT_CREATING_0: {
			return true;
		}
		case Shape.STAT_CREATING_1: {
			this.state = Shape.STAT_NORMAL;
			return true;
		}
		default: {
			return false;
		}
	}
}

UITwoPoints.prototype.onPointerDownNormal = function(point) {
	this.hitTestResult = this.hitTest(point);
	this.selected = this.hitTestResult != Shape.HIT_TEST_NONE;

	return this.hitTestResult;
}

UITwoPoints.prototype.onPointerMoveNormal = function(point) {
	 if(this.hitTestResult > 0) {
	 	var index = this.hitTestResult - 1;
	 	this.points[index].x = point.x;
	 	this.points[index].y = point.y;
	 }
}

UITwoPoints.prototype.onPointerUpNormal = function(point) {
	this.hitTestResult = Shape.HIT_TEST_NONE;

	return;
}

