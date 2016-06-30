/*
 * File:   ui-revolute-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIRevoluteJoint
 * @extends UIElement
 * 转动关节。它将两个刚体钉在一起，或者把一个刚体钉在场景上。
 * 可以设置马达参数、 角度限制和其他参数，来决定两个刚体之间的相对运动。
 *
 */
function UIRevoluteJoint() {
	return;
}

UIRevoluteJoint.prototype = new UIOneJoint();
UIRevoluteJoint.prototype.isUIJoint = true;
UIRevoluteJoint.prototype.isUIRevoluteJoint = true;

UIRevoluteJoint.prototype.saveProps = ["enableMotor", "enableLimit", "lowerAngle", "upperAngle", "maxMotorTorque", "motorSpeed"];
UIRevoluteJoint.prototype.initUIRevoluteJoint = function(type) {
	this.initUIOneJoint(type);	
	
	return this;
}

/**
 *  @method setEnable
 *  设置启用马达。
 *  @return {UIElement} 返回控件本身
 *  
 */
UIRevoluteJoint.prototype.setEnable = function(enable) {
    if(this.joint) {
		this.joint.EnableMotor(enable);
        this.enableMotor = this.enable = enable;
    }

    return this;
}

/**
 * @method isEnable
 * 获取是否启用马达
 * @return {Boolean} 返回是否启用马达
 *
 */
UIRevoluteJoint.prototype.isEnable = function() {
    if(this.joint) {
        return this.joint.IsMotorEnabled();
    }

    return enableMotor;
}

/**
 * @method setMaxMotorTorque
 * 设置最大马达力矩
 * @return {UIElement} 返回控件本身
 *
 */
UIRevoluteJoint.prototype.setMaxMotorTorque = function(torque) {
    if(this.joint) {
        this.joint.SetMaxMotorTorque(torque);
    }
    
    return this;
}

/**
 * @method getMotorTorque
 * 获取马达力矩。
 * @return {Number} 返回马达力矩。
 *
 */
UIRevoluteJoint.prototype.getMotorTorque = function() {
    if(this.joint) {
        return this.joint.GetMotorTorque();
    }

    return 0;
}

/**
 * @method setLimitEnable
 * 设置马达角度限制。
 * @param {Boolean} enable 是否启用马达角度限制。
 * @return {UIElement} 返回控件本身。
 * 
 */
UIRevoluteJoint.prototype.setLimitEnable = function(enable) {
    if(this.joint) {
        this.joint.EnableLimit(enable);   
        this.enableLimit = enable;
    }

    return this;
}

/**
 * @method getLimitEnable
 * 获取马达角度限制。
 * @return {Boolean} 是否开启了角度限制。
 * 
 */
UIRevoluteJoint.prototype.getLimitEnable = function() {
    if(this.joint) {
        return this.joint.IsLimitEnabled();
    }
    return this.enableLimit;
}

/**
 * @method setLimits
 * 设置马达限制的角度范围，只有开启了马达限制才会生效。
 * @param {Number} lower 角度下限(弧度)。
 * @param {Number} upper 角度上限(弧度)。
 * @return {UIElement} 返回控件本身。
 * 
 */
UIRevoluteJoint.prototype.setLimits = function(lower, upper) {
    if(this.joint) {
        this.joint.SetLimits(lower, upper);
    }

    return this;
}

/**
 * @getLowerLimit 
 * 获取角度限制的下限。
 * @return {Number} 角度下限。
 *
 */
UIRevoluteJoint.prototype.getLowerLimit = function() {
    if(this.joint) {
        return this.joint.GetLowerLimit();
    }

    return 0;
}

/**
 * @getUpperLimit
 * 获取角度限制的上限。
 * @return {Number} 角度上限。
 *
 */
UIRevoluteJoint.prototype.getUpperLimit = function() {
    if(this.joint) {
        return this.joint.GetUpperLimit();
    }

    return 0;
}

/**
 * @method getJointAngle
 * 获取关节角度。
 * @return {Number} 返回关节的旋转角度。
 *
 */
UIRevoluteJoint.prototype.getJointAngle = function() {
    if(this.joint) {
        return this.joint.GetJointAngle();
    }

    return 0;
}

/**
 * @method getJointSpeed
 * 获取关节转动速度。
 * @return {Number} 返回关节转动速度。
 *
 */
UIRevoluteJoint.prototype.getJointSpeed = function() {
    if(this.joint) {
        return this.joint.GetJointSpeed();
    }

    return 0;
}

/**
 * @method setMotorSpeed
 * 设置马达的转速（只有在启用马达时有效）。
 * @param {Number} motorSpeed 转速。单位为弧度，正数顺时针转，负数逆时针转。 
 * @return {UIElement} 返回控件本身。
 *
 */
UIRevoluteJoint.prototype.setValue = UIRevoluteJoint.prototype.setMotorSpeed = function(motorSpeed) {
	if(this.joint) {
		this.joint.SetMotorSpeed(motorSpeed);
	}

	return this;
}

/**
 * @method getJoint
 * 获取Box2d的Joint对象。
 * @return {Object} 返回Joint对象。
 *
 * 参考：http://bacon2d.com/docs/qml-bacon2d-revolutejoint.html
 *
 */
UIRevoluteJoint.prototype.getJoint = function() { 
	return this.joint;
}

/**
 * @method getMotorSpeed
 * 获取马达的转速。
 * @return {Number} 返回马达的转速。
 *
 */
UIRevoluteJoint.prototype.getValue = UIRevoluteJoint.prototype.getMotorSpeed = function() {
	if(this.joint) {
		return this.joint.GetMotorSpeed();
	}

	return 0;
}

UIRevoluteJoint.prototype.recreateJoint = function() {
	var world = this.getWindow().world;

	if(world) {
		Physics.destroyJointForElement(world, this);
		Physics.createJoint(world, this);
	}

	return;
}

function UIRevoluteJointCreator() {
	var args = ["ui-revolute-joint", "ui-revolute-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRevoluteJoint();
		return g.initUIRevoluteJoint(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIRevoluteJointCreator());

