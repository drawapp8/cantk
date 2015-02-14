/*
 * File:   ui-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic box for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIBox() {
	return;
}

UIBox.prototype = new UIElement();
UIBox.prototype.isUIBox = true;
UIBox.prototype.isUIPhysicsShape = true;

UIBox.prototype.initUIBox = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.density = 1;
	this.friction = 0;
	this.restitution = 0;
	this.addEventNames(["onBeginContact", "onEndContact", "onMoved"]);

	return this;
}

UIBox.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	return !shape.isUIPhysicsShape;
}

UIBox.prototype.onSized = function() {
	var win = this.getWindow();
	this.updateLayoutParams();
	if(this.body && win && win.isUIScene) {
		var shape = this.body.GetFixtureList().GetShape();
		var hw = this.getWidth(true) >> 1;
		var hh = this.getHeight(true) >> 1;
		shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));

		this.body.SynchronizeFixtures();
		this.setPosition(this.x, this.y);
	}
}

UIBox.prototype.paintSelfOnly = function(canvas) {
	var x = this.getHMargin();
	var y = this.getVMargin();
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	canvas.beginPath();
	canvas.rect(x, y, w, h);
	if(!this.isFillColorTransparent()) {
		canvas.fill();
	}

	if(!this.isStrokeColorTransparent()) {
		canvas.stroke();
	}


	return;
}

function UIBoxCreator() {
	var args = ["ui-box", "ui-box", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBox();
		return g.initUIBox(this.type, 200, 200, null);
	}
	
	return;
}
