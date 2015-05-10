/*
 * File:   ui-shortcut.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ShortCut 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIShortcut() {
	return;
}

UIShortcut.prototype = new UIElement();
UIShortcut.prototype.isUIShortcut = true;

UIShortcut.prototype.initUIShortcut = function(type) {
	this.initUIElement(type);	

	this.setText("#ABCDEFGHIJKLMNOPQRSTUVYWXYZ");
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIShortcut.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIShortcut.prototype.drawText = function(canvas) {
	var text = this.text;
	var n = text.length;

	if(!n) {
		return;
	}

	canvas.textBaseline = "middle";
	canvas.textAlign = "center";
	canvas.font = this.style.getFont();

	var x = this.w >> 1;
	var y = this.vMargin;
	var w = this.getWidth(true);

	var ih = this.getHeight(true)/n;
	var ihh = ih >> 1;

	canvas.strokeStyle = this.style.lineColor;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];

		if(this.currentItem === i) {
			canvas.rect(0, y, this.w, ih);
			if(this.pointerDown) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fill();
			}
			
			canvas.stroke();
		}

		canvas.fillStyle = this.style.textColor;
		canvas.fillText(c, x, y + ihh);

		y += ih;
	}

	return;
}

UIShortcut.prototype.findItemByPoint = function(point) {
	var text = this.text;
	var vMargin = this.vMargin;
	var h = this.getHeight(true);
	var index = Math.floor(text.length * (point.y-vMargin)/h);

	return index;
}

UIShortcut.prototype.changeItemByPoint = function(point) {
	var text = this.text;
	var index = this.findItemByPoint(point);

	if(index >= 0 && index < text.length) {
		var value = text[index];

		if(this.currentItem != index) {
			this.callOnChangedHandler(value);
			this.currentItem = index;
		}
	}

	return;
}

UIShortcut.prototype.setValue = function(value) {
	var index = this.text.indexOf(value);
	if(index >= 0) {
		if(this.currentItem != index) {
			this.currentItem = index;
			this.callOnChangedHandler(value);
		}
	}

	return;
}

UIShortcut.prototype.getValue = function() {
	if(this.text && this.currentItem >= 0 && this.currentItem < this.text.length) {
		return this.text[this.currentItem];
	}
	else {
		return "";
	}
}

UIShortcut.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	this.changeItemByPoint(point);

	return;
}

UIShortcut.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	if(this.pointerDown) {
		this.changeItemByPoint(point);
	}

	return;
}

function UIShortcutCreator() {
	var args = ["ui-shortcut", "ui-shortcut", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIShortcut();
		return g.initUIShortcut(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIShortcutCreator());

