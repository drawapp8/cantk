/*
 * File:  l_shape.js
 * Brief: Base class of all line shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function LShape() {
	return;
}

LShape.prototype = new Shape();

/*overwritable*/
/*******************************************************************/
LShape.prototype.initDefault = function() {
	return;
}

LShape.prototype.isLine = true;

LShape.prototype.resizeDelta =function(dw, dh) {
	return;
}

LShape.prototype.setOptions = function(firstArrowUnchangable, secondArrowUnchangable, lineStyleUnchangable, arrowSizeUnchangable) {
	this.firstArrowUnchangable = firstArrowUnchangable;
	this.secondArrowUnchangable = secondArrowUnchangable;
	this.lineStyleUnchangable = lineStyleUnchangable;
	this.arrowSizeUnchangable = arrowSizeUnchangable;

	return;
}

LShape.prototype.setStyle = function(style) {
	var firstArrowType = this.style.firstArrowType;
	var secondArrowType = this.style.secondArrowType;
	var lineStyle = this.style.lineStyle;
	var arrowSize = this.style.arrowSize;

	this.style.copy(style);
	this.needRelayout = true;

	if(this.firstArrowUnchangable) {
		this.style.setFirstArrowType(firstArrowType);
	}

	if(this.secondArrowUnchangable) {
		this.style.setSecondArrowType(secondArrowType);
	}

	if(this.lineStyleUnchangable) {
		this.style.setLineStyle(lineStyle);
	}

	if(this.arrowSizeUnchangable) {
		this.style.setArrowSize(arrowSize);
	}

	return;
}

LShape.prototype.getWidth = function() {
	var min = this.points[0].x;
	var max = this.points[0].x;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(min > p.x) {
			min = p.x;
		}

		if(max < p.x) {
			max = p.x;
		}
	}

	return max - min;
}

LShape.prototype.getHeight = function() {
	var min = this.points[0].y;
	var max = this.points[0].y;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(min > p.y) {
			min = p.y;
		}

		if(max < p.y) {
			max = p.y;
		}
	}

	return max - min;
}

LShape.prototype.getX = function() {
	var x = this.points[0].x;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(x > p.x) {
			x = p.x;
		}
	}

	return x;
}

LShape.prototype.getY = function() {
	var y = this.points[0].y;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(y > p.y) {
			y = p.y;
		}
	}

	return y;
}

LShape.prototype.updatePoint = function(index, point) {
	return false;
}

LShape.prototype.isPointIn = function(canvas, point) {
	return false;
}

LShape.prototype.getPoint = function(index) {
	return index < this.points.length ? this.points[index] : null;
}

/*******************************************************************/

LShape.prototype.saveState = function() {
	if(!this.savePoints) {
		this.savePoints = new Array();
	}

	this.savePoints.copy(this.points);

	return;
}

LShape.prototype.findNear = function(point) {
	this.near = null;
	if(this.view) {
		var range = this.getNearRange();
		var range2 = range + range;
		var rect = {x:point.x-range, y:point.y-range, w:range2, h:range2};
		this.near = this.view.findNear(this, rect);
	}

	return this.near;
}

LShape.prototype.getNearPoint = function(i) {
	if(i < this.points.length) {
		return this.points[i];
	}

	return null;
}

LShape.prototype.initLShape = function(points, type) {
	this.points = new Array();
	this.savePoints = new Array();
	this.initDefault();
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();

	this.initShape(x, y, w, h, type);

	if(points) {
		this.points.copy(points);
		this.state = Shape.STAT_NORMAL;
	}
	else {
		this.state = Shape.STAT_CREATING_0;
	}

	this.style.setLineWidth(2);

	return;
}
		
LShape.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.lastPosition.copy(point);

	if(this.state === Shape.STAT_NORMAL) {
		this.hitTestResult = this.hitTest(point);
	}
		
	this.setSelected(this.hitTestResult);
	this.handlePointerEvent(point, C_EVT_POINTER_DOWN);	
	this.postRedraw();
	this.saveState();
	
	return this.hitTestResult;
}

LShape.prototype.move = function(x, y) {
	var dx = x - this.getX();
	var dy = y - this.getY();
	this.moveDelta(dx, dy);

	return;
}

LShape.prototype.moveDelta=function(dx, dy) {
	for(var i in this.points) {
		this.points[i].x += dx;
		this.points[i].y += dy;
	}
	
	return;
}

LShape.prototype.isPointInSegment = function(canvas, first, second, point) {
	if(!first || !second) {
		return;
	}

	var ret = false;
	var margin = 10;
	var dx = second.x - first.x;
	var dy = second.y - first.y;
	var length = Math.sqrt(dx*dx + dy*dy);	
	var angle = Math.atan(dy/dx);
	
	canvas.save();
	canvas.translate((first.x + second.x)/2, (first.y + second.y)/2);
	canvas.rotate(angle);
	canvas.beginPath();
	canvas.rect(-length/2, -margin, length, 2 * margin);
	canvas.restore();

	ret = canvas.isPointInPath(point.x, point.y);
	canvas.beginPath();

	return ret;
}

LShape.prototype.onPointerMove = function(point) {
	var ret = true;

	if(this.state === Shape.STAT_NORMAL) {
		if(this.hitTestResult) {
			if(this.hitTestResult === Shape.HIT_TEST_MM) {
				var dx = point.x - this.lastPosition.x;
				var dy = point.y - this.lastPosition.y;

				this.moveDelta(dx, dy);
			}
			else {
				this.findNear(point);
				this.updatePoint(this.hitTestResult - 1, point);
			}
			this.postRedraw();
		}
	}
	else {
		this.findNear(point);
	}
	this.handlePointerEvent(point, C_EVT_POINTER_MOVE);
	this.lastPosition.copy(point);
	
	this.onMoved();

	return this.hitTestResult;
}

LShape.prototype.clearAttachedNearPoints = function() {
	this.observers = [];

	return;
}

LShape.prototype.updateNearPoints = function() {

	for(var i = 0; i < this.points.length; i++) {
		var near = this.findNear(this.points[i]);
		this.attachToNearPoint(near, i);
		this.near = null;
	}

	return;
}

LShape.prototype.attachToNearPoint = function(near, pointIndex) {
	if(!this.observers) {
		this.observers = [];
	}

	for(var i = this.observers.length; i < (pointIndex+1); i++) {
		this.observers.push(null);
	}

	if(!near) {
		this.observers[pointIndex] = null;

		return;
	}

	var line = this;
	var observer = {};
	var nearShape = near.shape;

	observer.line = this;
	observer.object = near.shape;
	observer.pointIndex = pointIndex;
	observer.observerPointIndex = near.nearPointIndex;

	this.points[pointIndex].copy(near.point);

	observer.update = function(shape) {
		if(this.object != shape) {
			return false;
		}
		
		if(!this.line.view) {
			return false;
		}

		if(this.line.selected && this.line.view.isPointerDown()) {
			return true;
		}

		var observers = this.line.observers;
		for(var i = 0; i < observers.length; i++) {
			var iter = observers[i];
			if(!iter) {
				continue;
			}

			if(iter.object === shape) {
				var point = shape.getNearPoint(this.observerPointIndex);
				this.line.updatePoint(this.pointIndex, point); 
			
				return true;
			}
		}

		return false;
	}

	this.observers[pointIndex] = null;

	this.observers[pointIndex] = observer;
	nearShape.registerChangedListener(observer);

	return;
}

LShape.prototype.onPointerUp = function(point) {
	var state = this.state;

	this.handlePointerEvent(point, C_EVT_POINTER_UP);
	this.lastPosition.copy(point);
	this.postRedraw();
	this.pointerDown = false;

	if(this.hitTestResult > 0) {
		var pointIndex = this.hitTestResult - 1;	
		this.attachToNearPoint(this.near, pointIndex);
		
		if(this.near) {
			this.updatePoint(pointIndex, this.near.point);
		}
	}
	else if(!this.isClicked() && state === Shape.STAT_NORMAL) {
		this.clearAttachedNearPoints();
	}

	this.hitTestResult = Shape.HIT_TEST_NONE;
	this.exec(new LineMoveCommand(this, this.savePoints, !this.near));
	this.near = null;

	if(!this.isClicked()) {
		this.onMoved();
	}

	return this.hitTestResult;
}

LShape.prototype.resize = function(w, h) {
	return;
}

LShape.prototype.translate = function(canvas) {
	canvas.translate(this.x, this.y);

	return;
}

LShape.prototype.drawSelectMarks = function(canvas) {
	if(this.selected) {
		canvas.beginPath();
		canvas.lineWidth = 1;
		canvas.shadowBlur = 0;
		canvas.strokeStyle = this.style.lineColor;

		for(var i = 0; i < this.points.length; i++) {
			var p = this.points[i];
			var hited = (i === (this.hitTestResult -1));
			this.createSelectedMark(canvas, p.x, p.y, hited);
		}
		canvas.stroke();
		canvas.beginPath();
	}

	return;
}

LShape.prototype.drawTips = function(canvas) {
	if((this.selected && this.pointerDown)) {
		canvas.fillStyle = this.style.lineColor;
		for(var i = 0; i < this.points.length; i++) {
			var p =  this.points[i];
			var text = Math.floor(p.x) + "x" + Math.floor(p.y);
			canvas.font = "14px serif";
			canvas.textAlign = "center";
			canvas.textBaseline = "bottom";
			canvas.fillText(text, p.x, p.y, 100);
		}
	}

	return;
}

LShape.prototype.hitTest = function(point) {
	var ret = Shape.HIT_TEST_NONE;
	var canvas = this.view.getCanvas2D();
	
	canvas.save();
	this.translate(canvas);	
	
	for(var i = 0; i < this.points.length; i++) {
		var smp = this.points[i];
		if(this.isInSelectedMark(canvas, smp.x, smp.y, point)) {
			canvas.restore();

			return this.selected ? (i + 1) : Shape.HIT_TEST_MM;
		}				
	}
	
	if(this.isPointIn(canvas, point)) {
		ret = Shape.HIT_TEST_MM;
	}
	
	canvas.restore();

	return ret;
}

LShape.prototype.onKeyDown = function(code) {
	return;
}

LShape.prototype.onKeyUp = function(code) {
	return;
}		

LShape.prototype.pointsToJson = function() {
	var points = "";

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(i > 0) {
			points += ",";
		}
		points += "{x:" + p.x + ",y:" + p.y + "}";
	}

	return points;
}

LShape.prototype.toJson = function() {
	
	var o = new Object();

	o.type = this.type;
	o.points = this.points;
	o.text = this.text;
	o.style = this.style.toJson();

	return o;
}

LShape.prototype.pointsFromJson = function(js) {
	for(var i = 0; i < js.points.length; i++) {
		var p = js.points[i];
		this.points.push(new Point(p.x, p.y));
	}

	return;
}

LShape.prototype.fromJson = function(js) {

	this.points.clear();
	this.text = js.text;
	this.style.fromJson(js.style);
	this.pointsFromJson(js);	
	
	this.state = Shape.STAT_NORMAL;
	
	return;
}
	
LShape.prototype.drawText = function(canvas) {
	var text = this.getLocaleText(this.text);
	if(text) {
		var x = (this.points[0].x + this.points[1].x)/2;
		var y = (this.points[0].y + this.points[1].y)/2;
		canvas.beginPath();
		canvas.textAlign = "center";
		canvas.textBaseline = "bottom";
		var font = this.style.getFont();
		canvas.font = font;
		canvas.fillStyle = this.style.textColor;	
		canvas.fillText(text, x, y);
			
		canvas.fill();			
	}

	return;
}

LShape.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	canvas.fillStyle = style.fillColor;
	
	if(style.enableGradient) {
		canvas.strokeStyle = style.getStrokeStyle(canvas);
	}
	else {
		canvas.strokeStyle = style.lineColor;
	}

	if(style.enableShadow) {
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y
		canvas.shadowBlur    = style.shadow.blur;
	}

	return;
}

LShape.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.strokeStyle = this.style.lineColor;
	canvas.beginPath();

	return;
}

LShape.prototype.showProperty = function() {
	showLinePropertyDialog(this, this.textType);

	return;
}

LShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());

	return;
}	
