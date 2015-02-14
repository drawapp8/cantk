/*
 * File:   ui-mouse-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  mouse joint, react with pointer event.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIMouseJoint() {
	return;
}

UIMouseJoint.prototype = new UIOneJoint();
UIMouseJoint.prototype.isUIMouseJoint = true;

UIMouseJoint.prototype.initUIMouseJoint = function(type, w, h, bg) {
	this.initUIOneJoint(type, w, h, bg);	
	this.speedScale = 1;
	this.enableTop = true;
	this.enableLeft = true;
	this.enableRight = true;
	this.enableBottom = true;

	return this;
}

UIMouseJoint.prototype.onInit = function() {
	var sprite = this.getParent();
	var speedScale = this.speedScale;
	var enableLeft = this.enableLeft;
	var enableRight = this.enableRight;
	var enableTop = this.enableTop;
	var enableBottom = this.enableBottom;

	if(sprite.physicsShape || sprite.isUIPhysicsShape) {
		sprite.handlePointerDown = function(point) {
			return UIMouseJoint.handleSpritePointerDown(sprite, point);	
		}

		sprite.handlePointerMove = function(point) {
			return UIMouseJoint.handleSpritePointerMove(sprite, point);	
		}

		sprite.handlePointerUp = function(point) {
			return UIMouseJoint.handleSpritePointerUp(sprite, point, speedScale, enableLeft, enableRight, enableTop, enableBottom);	
		}
	}
}

UIMouseJoint.handleSpritePointerDown = function(sprite, point) {
	sprite.body.SetLinearVelocity({x:0, y:0});

	return;
}

UIMouseJoint.handleSpritePointerMove = function(sprite, point) {
	sprite.body.SetLinearVelocity({x:0, y:0});

	return;
}

UIMouseJoint.prototype.setSpeedLimit = function(xMinV, xMaxV, yMinV, yMaxV) { 
	var sprite = this.getParent();

	sprite.xMinV = xMinV;
	sprite.yMinV = yMinV;
	sprite.xMaxV = xMaxV;
	sprite.yMaxV = yMaxV;

	return;
}

UIMouseJoint.handleSpritePointerUp = function(sprite, point, speedScale, enableLeft, enableRight, enableTop, enableBottom) {
	var dt = (Date.now() - sprite.pointerDownTime)/1000;
	var dx = sprite.getMoveAbsDeltaX();
	var dy = sprite.getMoveAbsDeltaY();
	var vx = speedScale * Physics.toMeter(dx)/dt;
	var vy = speedScale * Physics.toMeter(dy)/dt;

	if(!enableLeft && vx < 0) {
		vx = 0;
	}

	if(!enableTop && vy < 0) {
		vy = 0;
	}

	if(!enableRight && vx > 0) {
		vx = 0;
	}

	if(!enableBottom && vy > 0) {
		vy = 0;
	}

	var xMaxV = sprite.xMaxV;
	if(xMaxV && Math.abs(vx) > xMaxV) {
		vx = vx > 0 ? xMaxV : -xMaxV;
	}
	
	var yMaxV = sprite.yMaxV;
	if(yMaxV && Math.abs(vy) > yMaxV) {
		vy = vy > 0 ? yMaxV : -yMaxV;
	}
	
	var xMinV = sprite.xMinV;
	if(xMinV && Math.abs(vx) < xMinV) {
		vx = vx > 0 ? xMinV : -xMinV;
	}
	
	var yMinV = sprite.yMinV;
	if(yMinV && Math.abs(vy) < yMinV) {
		vy = vy > 0 ? yMinV : -yMinV;
	}

	sprite.body.SetLinearVelocity({x:vx, y:vy});

	return;
}

function UIMouseJointCreator() {
	var args = ["ui-mouse-joint", "ui-mouse-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMouseJoint();
		return g.initUIMouseJoint(this.type, 20, 20, null);
	}
	
	return;
}
