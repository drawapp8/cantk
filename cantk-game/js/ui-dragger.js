/*
 * File:   ui-dragger.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  mouse joint, react with pointer event.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDragger() {
	return;
}

UIDragger.prototype = new UIElement();
UIDragger.prototype.isUIDragger = true;

UIDragger.prototype.initUIDragger = function(type, w, h) {
	this.initUIElement(type, w, h);	
	this.enableVer = true;
	this.enableHor = true;

	return this;
}

UIDragger.prototype.onInit = function() {
	var sprite = this.getParent();

	var enableHor = this.enableHor;
	var enableVer = this.enableVer;

	if(sprite.physicsShape || sprite.isUIPhysicsShape || sprite.isUIImage) {
		sprite.handlePointerDown = function(point) {
			return UIDragger.handleSpritePointerDown(sprite, point);	
		}

		sprite.handlePointerMove = function(point) {
			return UIDragger.handleSpritePointerMove(sprite, point, enableVer, enableHor);	
		}

		sprite.handlePointerUp = function(point) {
		}
	}
}

UIDragger.handleSpritePointerDown = function(sprite, point) {
	sprite.saveX  = sprite.x;
	sprite.saveY  = sprite.y;

	return;
}

UIDragger.handleSpritePointerMove = function(sprite, point, enableVer, enableHor) {
	if(sprite.pointerDown) {
		var dx = sprite.getMoveAbsDeltaX();
		var x = enableHor ? sprite.saveX + dx : sprite.saveX;
		
		var dy = sprite.getMoveAbsDeltaY();
		var y = enableVer ? sprite.saveY + dy : sprite.saveY;

		sprite.setPosition(x, y);
	}

	return;
}

function UIDraggerCreator() {
	var args = ["ui-dragger", "ui-dragger", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDragger();
		return g.initUIDragger(this.type, 20, 20, null);
	}
	
	return;
}
