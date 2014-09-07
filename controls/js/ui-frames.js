/*
 * File:   ui-frames.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frames
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFrames() {
	return;
}

UIFrames.prototype = new UIElement();
UIFrames.prototype.isUIFrames = true;

UIFrames.prototype.initUIFrames = function(type) {
	this.initUIElement(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.addEventNames(["onChanged"]);

	return this;
}

UIFrames.prototype.getStatusString = function() {
	var str = "";
	var current = this.current + 1;
	var n = this.children.length;
	var frame = this.getCurrentFrame();

	current = current <= n ? current : n;
	if(frame && frame.name) {
		str = frame.name + "(" + current + "/" + n + ")";
	}
	else {
		str = current + "/" + n;
	}

	return str;
}

UIFrames.prototype.getCurrent = function() {
	return this.current;
}

UIFrames.prototype.setCurrent = function(current) {
	if(this.current !== current) {
		this.current = current;
		
		if(this.mode != C_MODE_EDITING) {
			this.callOnChanged(current);
		}
	}

	return;
}

UIFrames.prototype.getCurrentFrame = function() {
	if(this.children.length < 1) {
		return null;
	}

	if(this.current < 0 || !this.current) {
		this.current = 0;
	}

	if(this.current >= this.children.length) {
		this.current = this.children.length - 1;
	}

	return this.children[this.current];
}

UIFrames.prototype.fixChildSize = function(child) {
	return;
}

UIFrames.prototype.fixChildPosition = function(child) {
	var x = child.x;
	var y = child.y;
	var h = child.h;
	var w = child.w;

	if(child.freePosition) {
		return;
	}
	
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		x = this.getHMargin();
		w = this.getWidth(true);
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		y = this.getVMargin();
		h = this.getHeight(true);
	}
	
	child.x = x;
	child.y = y;
	child.h = h;
	child.w = w;

	return;
}

UIFrames.prototype.setTarget = function(shape) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!shape) {
			child.setSelected(false);
			continue;
		}

		if(child != shape && child != shape.popupWindow) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;

	return;
}
UIFrames.prototype.dispatchPointerDownToChildren = function(p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	if(child.onPointerDown(p)) {
		this.setTarget(child);

		return true;
	}

	return false;
}

UIFrames.prototype.addShapeIntoChildren = function(shape, p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	return child.addShape(shape, true, p);
}

UIFrames.prototype.paintChildren = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIFrames.prototype.showNextFrame = function() {
	this.showFrame(this.current+1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.getFrame = function(index) {
	if(index < 0 || index >= this.children.length) {
		return null;
	}

	return this.children[index];
}

UIFrames.prototype.getFrameIndex = function(frame) {
	for(var i = 0; i < this.children.length; i++) {
		if(frame === this.children[i]) {
			return i;
		}
	}

	return -1;
}

UIFrames.prototype.getFrames = function() {
	return this.children.length;
}

UIFrames.prototype.showPrevFrame = function() {
	this.showFrame(this.current-1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.showFrame = function(index) {
	this.current = (index + this.children.length)%this.children.length;
	var currentFrame = this.children[this.current];
	
	if(currentFrame) {
		currentFrame.show(true);
	}

	return;
}

UIFrames.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIFrames.prototype.initDefaultNameForChild = function(shape) {
}

UIFrames.prototype.relayoutChildren = function() {

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		iter.x = 0;
		iter.y = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.widthAttr = C_WIDTH_FILL_PARENT;
		iter.heightAttr = C_HEIGHT_FILL_PARENT;
		iter.relayoutChildren();
	}

	return;
}

UIFrames.prototype.afterChildAppended = function(shape) {
	this.current = this.children.length - 1;

	if(!shape.name) {
		this.initDefaultNameForChild(shape);
	}

	return;
}

UIFrames.prototype.onChildRemoved = function(shape) {
	return;
}

UIFrames.prototype.afterChildRemoved = function(shape) {
	if(this.children.length === 0) {
		this.current = 0;
	}
	else if(this.current >= this.children.length) {
		this.current--;
	}

	this.onChildRemoved(shape);

	return;
}

UIFrames.prototype.findShapeByPoint = function(point, recursive) {
	var p = this.translatePoint(point);
	var curFrame = this.getCurrentFrame();

	if(curFrame) {
		return curFrame.findShapeByPoint(p, recursive);	
	}

	return this;
}


function UIFramesCreator() {
	var args = ["ui-frames", "ui-frames", null, 0];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrames();

		return g.initUIFrames(this.type);
	}
	
	return;
}
