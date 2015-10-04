/*
 * File:   ui-gauge.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Gauge
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIGauge() {
	return;
}

UIGauge.prototype = new UIElement();
UIGauge.prototype.isUIGauge = true;
UIGauge.IMAGE_POINTER = "pointer-image";

UIGauge.prototype.initUIGauge = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onInit"]);

	return this;
}

UIGauge.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILedDigits || shape.isUILabel || shape.isUIGaugePointer;
}

UIGauge.prototype.afterChildAppended = function(shape) {
	var size = 20;
	var pointerNr = 0;

	if(shape.isUIGaugePointer) {
		shape.xAttr = UIElement.X_CENTER_IN_PARENT;
		shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.isUIGaugePointer) {
			continue;
		}

		switch(pointerNr) {
			case 0: {
				size = 100;
				break;
			}
			case 1: {
				size = 70;
				break;
			}
			case 2: {
				size = 40;
				break;
			}
		}
		pointerNr = pointerNr + 1;

		iter.setSizeLimit(size, size, size, size, 1);
		iter.setSize(size, size);
	}

	this.setSizeLimit(100, 100, 1000, 1000, 1);

	return;
}

UIGauge.prototype.paintSelfOnly = function(canvas) {

	return;
}

function UIGaugeCreator() {
	var args = ["ui-gauge", "ui-gauge", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGauge();
		return g.initUIGauge(this.type, 200, 200);
	}
	
	return;
}

///////////////////////////////////////////////////////////////////}-{

function UIGaugePointer() {
	return;
}

UIGaugePointer.prototype = new UIElement();
UIGaugePointer.prototype.isUIGaugePointer = true;

UIGaugePointer.prototype.initUIGaugePointer = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIGauge.IMAGE_POINTER, null);
	
	this.value = 0;
	this.minAngle = 0;
	this.maxAngle = 360;
	this.minValue = 0;
	this.maxValue = 60;

	return this;
}

UIGaugePointer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIGaugePointer.prototype.setText = function(text) {
	text = this.toText(text ? text : 0);
	try {
		this.setValue(parseInt(text));
	}catch(e) {
		console.log("UIGaugePointer.prototype.setText:" + e.message);
	}

	return this;
}

UIGaugePointer.prototype.getText = function() {
	return this.getValue() + "";
}

UIGaugePointer.prototype.setValue = function(value) {
	if(value >= this.minValue && value <= this.maxValue) {
		this.value = value;
	}
	else {
		console.log("UIGaugePointer.prototype.setValue: Out Of Range.");
	}

	return this;
}

UIGaugePointer.prototype.getValue = function() {
	return this.value;
}

UIGaugePointer.prototype.animSetValue = function(value, animHint) {
	return this.animSetValue(value, animHint);
}

UIGaugePointer.prototype.animateSetValue = function(value, animHint) {
	if(value < this.minValue) {
		value = this.minValue;
	}

	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	var pointer = this;
	var endValue = value;
	var startValue = this.getValue();
	var changeDelta = value - startValue;
	var changeAngle = Math.abs(changeDelta * (this.maxAngle - this.minAngle)/(this.maxValue - this.minValue));
	
	if(changeAngle < 5) {
		this.setValue(value);

		return;
	}

	var startTime = (new Date()).getTime();
	var duration = (animHint && animHint == "slow") ? 1000 : 500;

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;

		if(percent < 1) {
			var newValue = startValue + changeDelta * percent;	
			pointer.setValue(newValue);

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			pointer.setValue(endValue);
		}

		delete now;
		pointer.postRedraw();
	}

	animStep();

	return;
}

UIGaugePointer.prototype.getAngle = function(canvas) {
	var rangeAngle = this.maxAngle - this.minAngle;
	var rangeValue = this.maxValue - this.minValue;
	var angle = (this.value/rangeValue) * rangeAngle + this.minAngle;

	angle = Math.PI * (angle / 180);

	return angle;
}

UIGaugePointer.prototype.paintSelfOnly = function(canvas) {
	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;
	var angle = this.getAngle();

	var image = this.getHtmlImageByType(UIGauge.IMAGE_POINTER);
	if(image && image.width) {
		var imageW = image.width;
		var imageH = image.height;

		canvas.translate(w/2, h/2);
		canvas.rotate(angle);
		canvas.translate(-w/2, -h/2);
		x = (w - imageW)/2;
		y = (h - imageH)/2;

		canvas.drawImage(image, x, y);
	}
	else {
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIGaugePointerCreator() {
	var args = ["ui-gauge-pointer", "ui-gauge-pointer", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGaugePointer();
		return g.initUIGaugePointer(this.type, 20, 200);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIGaugePointerCreator());
ShapeFactoryGet().addShapeCreator(new UIGaugeCreator());

