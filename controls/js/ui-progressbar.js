/*
 * File:   ui-progressbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Slider/ProgressBar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIProgressBar() {
	return;
}

UIProgressBar.prototype = new UIElement();
UIProgressBar.prototype.isUIProgressBar = true;

UIProgressBar.prototype.initUIProgressBar = function(type, w, h, interactive, bgImg, fgImg, dragImg) {
	this.initUIElement(type);	

	this.setPercent(50);
	this.setDefSize(w, h);
	this.setInteractive(interactive);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setSizeLimit(120, 40, null, 80);
	this.setImage(UIElement.IMAGE_DEFAULT, bgImg);
	this.setImage(UIElement.IMAGE_NORMAL_FG, fgImg);

	this.drawSize = h;
	this.dragImg = dragImg;

	if(interactive) {
		this.addEventNames(["onChanged"]);
		this.addEventNames(["onChanging"]);
	}

	return this;
}

UIProgressBar.prototype.shapeCanBeChild = function(shape) {
	return (shape.isUIImage || shape.isUILabel || shape.isUIColorTile);
}

UIProgressBar.prototype.relayoutChildren = function() {
	var w = this.h;
	var h = this.h;
	var shape = this.drag;

	if(shape) {
		if(shape.isUIColorTile) {
			w = this.h >> 1;
		}

		shape.setSize(w, h);
		shape.y = 0;
	}

	return;
}

UIProgressBar.prototype.afterChildAppended =function(shape) {
	var bar = this;
	var size = this.drawSize ? this.drawSize : this.h;

	this.setTextType(Shape.TEXT_NONE);

	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
	shape.setTextType(Shape.TEXT_NONE);

	var w = size;
	var h = size;
	if(shape.isUIColorTile) {
		w = size >> 1;
	}
	shape.setSize(w, h);
	shape.setSizeLimit(w, h, w, h);
	shape.setUserResizable(false);

	shape.horMove = function(x) {
		var v = x;
		var max = bar.w - this.w;
		v = v < 0 ? 0 : v;
		v = v <= max ? v : max;

		this.move(v, this.y);
		
		return;
	}

	bar.onPointerMoveRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		if(this.pointerDown) {
			bar.isChanging = true;
			shape.horMove(point.x);
		}
		
		return;
	}

	bar.onPointerUpRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}
		
		delete this.isChanging;
		shape.horMove(point.x);
		shape.onMoved();

		return;
	}

	bar.onSized = function() {
		this.updateLayoutParams();
		this.setPercent(this.getPercent());

		return;
	}

	shape.onMoved = function() {
		var percent = 100 * (shape.x + shape.w/2) / bar.w; 
		if(shape.x === 0) {
			percent = 0;
		}

		if((shape.x + shape.w) === bar.w) {
			percent = 100;
		}

		bar.setPercentOnly(percent);
		bar.relayoutChildren();

		return;
	}
	this.drag = shape;
	
	return;
}

UIProgressBar.prototype.setInteractive = function(value) {
	this.interactive = value;

	return this;
}

UIProgressBar.prototype.setPercentOnly = function(value, notNotify) {
	var newValue = (value%101)/100;
	if(this.value != newValue) {
		this.value = newValue;
	}

	if(this.mode === Shape.MODE_EDITING || !this.isVisible()) {
		return this;
	}

	if(notNotify) {
		return this;
	}

	if(this.isChanging) {
		this.callOnChangingHandler(this.getValue());
	}
	else {
		this.callOnChangedHandler(this.getValue());
	}

	return this;
}

UIProgressBar.prototype.setPercent = function(value, notNotify) {
	this.setPercentOnly(value, notNotify);

	if(this.drag) {
		var dx = this.value * this.w - this.drag.w + 5;

		this.drag.y = Math.floor((this.h - this.drag.h)/2);
		this.drag.x = Math.floor(dx > 0 ? dx : 0);
	}

	return this;
}

UIProgressBar.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(!this.drag && this.interactive) {
		var x = point.x - this.x;
		var value = x / this.w;
		this.setPercent(value * 100);
	}

	return;
}

UIProgressBar.prototype.getPercent = function() {
	return this.value * 100;
}

UIProgressBar.prototype.getValue = function() {
	return this.getPercent();
}

UIProgressBar.prototype.setValue = function(value, notNotify) {
	this.setPercent(value, notNotify);

	return this;
}

UIProgressBar.prototype.paintSelfOnly = function(canvas) {
	var w = this.w;
	var h = this.h >> 1;
	var y = this.h >> 2;
	var r = this.h >> 3;

	var bg = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	var fg = this.getHtmlImageByType(UIElement.IMAGE_NORMAL_FG);

	if(bg && fg) {
		return;
	}

	canvas.save();
	canvas.translate(0, y);

	if(!bg) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		drawRoundRect(canvas, w, h, r);
		canvas.fill();
	}

	w = this.w * this.value;
	if(!fg) {
		canvas.fillStyle = this.style.lineColor;
		canvas.beginPath();
		if(w > 2 * r) {
			drawRoundRect(canvas, w, h, r);
		}
		canvas.fill();
	}
	canvas.restore();

	return;
}

UIProgressBar.prototype.drawImage = function(canvas) {
	var image = null;
	var y = 0;
	var h = this.h;	
	
	image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(image) {
		h = image.height;
		y = (this.h - h)>>1;
		drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, 0, y, this.w, h);
	}
	
	image = this.getHtmlImageByType(UIElement.IMAGE_NORMAL_FG);
	if(image) {
		var w = this.w * this.value;
		
		h = image.height;
		y = (this.h - h)>> 1;
		if(w >= image.width) {
			drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, 0, y, this.w * this.value, h);
		}
		else {
			canvas.drawImage(image, 0, y);
		}
	}

	return;
}

UIProgressBar.prototype.onFromJsonDone = function() {
	this.setPercent(this.getPercent(), false);

	return;
}

function UIProgressBarCreator(w, h, interactive, bgImg, fgImg, dragImg) {
	var type = interactive ? "ui-slider" : "ui-progressbar";
	var args = [type, "ui-progressbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIProgressBar();
		return g.initUIProgressBar(this.type, w, h, interactive, bgImg, fgImg, dragImg);
	}
	
	return;
}
