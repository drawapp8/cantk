/*
 * File:   ui-circle.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic circle for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIBody() {
	return;
}

UIBody.prototype = new UIElement();
UIBody.prototype.isUIBody = true;
UIBody.prototype.isUIPhysicsShape = true;

UIBody.prototype.initUIBody = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setCanRectSelectable(false, false);

	this.density = 0;
	this.friction = 0;
	this.restitution = 0;

	this.addEventNames(["onBeginContact", "onEndContact", "onMoved"]);

	return this;
}

UIBody.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	return !shape.isUIPhysicsShape;
}

//////////////////////////////////////////////////////////////

UIBody.prototype.setDensity = function(density) {
	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetDensity(density);
		}

		if(density > 0) {
			this.body.SetType(b2Body.b2_dynamicBody);
		}
		else if(density === 0) {
			this.body.SetType(b2Body.b2_staticBody);
		}
		else {
			this.body.SetType(b2Body.b2_kinematicBody);
		}
	}

	return this;
}

UIBody.prototype.setSensor = function(isSensor) {
	this.isSensor = isSensor;

	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetSensor(isSensor);
		}
	}

	return this;
}

UIBody.prototype.getDensity = function() {
	if(this.body) {
		return this.body.GetFixtureList().GetDensity();
	}

	return 0;
}

UIBody.prototype.setV = function(x, y) {
	var body = this.body;
	if(body) {
		this.setVisible(true);

		if(!body.IsActive()) {
			body.SetActive(true);
		}

		if(!body.IsAwake()) {
			body.SetAwake(true);
		}

		var v = body.GetLinearVelocity();
		if(x !== null && x !== undefined) {
			v.x = x;
		}

		if(y !== null && y !== undefined) {
			v.y = y;
		}

		body.SetLinearVelocity(v);
	}

	return this;
}

UIBody.prototype.getV = function() {
	return this.body ? this.body.GetLinearVelocity() : {x:0, y:0};
}

UIBody.prototype.addV = function(dx, dy) {
	var v = this.getV();

	if(dx !== null && dx !== undefined) {
		v.x += dx;
	}
	
	if(dy !== null && dy !== undefined) {
		v.y += dy;
	}

	return this.setV(v.x, v.y);
}

UIBody.prototype.getMass = function() {
	return this.body ? this.body.GetMass() : 0;
}

UIBody.prototype.applyTorque = function(torque) {
	if(this.body) {
		this.body.ApplyTorque(torque);
	}

	return this;
}

UIBody.prototype.applyForce = function(forceX, forceY, x, y) {
	if(this.body) {
		var force = {};
		var position = {};
		x = (x === undefined || x === null) ? (this.x + (this.w >> 1)) : x;
		y = (y === undefined || y === null) ? (this.y + (this.h >> 1)) : y;

		force.x = forceX;
		force.y = forceY;
		position.x = Physics.toMeter(x);
		position.y = Physics.toMeter(y);

		this.body.ApplyForce(force, position);
	}

	return this;
}

UIBody.prototype.setEnable = function(enable) {
	this.enable = enable;
	if(this.body) {
		this.body.SetActive(enable);
	}

	return this;
}

UIBody.prototype.setGroupIndex = function(groupIndex) {
	this.groupIndex = groupIndex;
	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.m_filter.groupIndex = groupIndex;
		}
	}

	return this;
}

UIBody.prototype.getGroupIndex = function() {
	return this.groupIndex;
}

UIBody.prototype.setRotation = function(rotation) {
	this.rotation = rotation;

	if(this.body) {
		this.body.SetAngle(rotation);
	}

	return this;
}


UIBody.prototype.needStroke = function() {
	return !this.noStroke && !this.isStrokeColorTransparent();
}

UIBody.prototype.paintSelfOnly = function(canvas) {
	var needStroke = this.needStroke();
	var needFill = !this.isFillColorTransparent();

	if(!needFill && !needStroke) {
		return;
	}

	canvas.beginPath();
	this.drawShape(canvas);

	if(needFill) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(needStroke) {
		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}
	return;
}
