/*
 * File:   ui-frames.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frames
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIFrames
 * @extends UIElement
 * 用来管理多个子控件，但是只有一个显示出来。
 *
 */
function UIFrames() {
	return;
}

UIFrames.prototype = new UIElement();
UIFrames.prototype.isUIFrames = true;
UIFrames.prototype.saveProps = ["current"];

UIFrames.prototype.initUIFrames = function(type) {
	this.initUIElement(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.addEventNames(["onChanged"]);

	return this;
}

UIFrames.preparseBackendCanvas = function(leftWin, RightWin) {
	var w = leftWin.w;
	var h = leftWin.h;
	var backendCanvas = Animation.getBackendCanvas(2 * w, h);
	var context = backendCanvas.getContext("2d");
	context.now = Date.now();
	context.timeStep = 0;
	context.clearRect(0, 0, 2*w, h);
	context.save();
	leftWin.paint(context);
	context.translate(w, 0);
	RightWin.paint(context);
	context.restore();

	return backendCanvas;
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

/**
 * @method getCurrent
 * 获取当前显示的子控件的索引。
 * @return {Number} 当前显示的子控件的索引。
 *
 */
UIFrames.prototype.getCurrent = function() {
	return this.current;
}


/**
 * @method setCurrent
 * 设置当前显示的子控件。
 * @param {Number} current 当前显示的子控件的索引。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrames.prototype.setCurrent = function(current) {
	if(this.current !== current) {
		this.current = current;
		
		if(!this.isInDesignMode()) {
			this.callOnChangedHandler(current);
		}
	}

	return this;
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
	var x = child.left;
	var y = child.top;
	var h = child.h;
	var w = child.w;

	if(child.freePosition) {
		return;
	}
	
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		x = this.getHMargin();
		w = this.getWidth(true);
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		y = this.getVMargin();
		h = this.getHeight(true);
	}
	
	child.left = x;
	child.top = y;
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
	return this.getIndexOfChild(frame);
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
	var current = (index + this.children.length)%this.children.length;
	this.setCurrent(current);
	
	var currentFrame = this.children[this.current];
	if(currentFrame) {
		currentFrame.show(true);
	}

	return;
}

UIFrames.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIFrames.prototype.relayoutChildren = function() {

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		iter.left = 0;
		iter.top = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.widthAttr = UIElement.WIDTH_FILL_PARENT;
		iter.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		iter.relayoutChildren();
	}

	return;
}

UIFrames.prototype.afterChildAppended = function(shape) {
	this.current = this.children.length - 1;

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

UIFrames.prototype.findChildByPoint = function(point, recursive) {
	var p = point;
	var curFrame = this.getCurrentFrame();

	if(curFrame) {
		var ret = curFrame.findChildByPoint(p, recursive);	
	    if(ret === curFrame && !curFrame.hitTest(p)) {
            return this;
        }
        return ret;
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
