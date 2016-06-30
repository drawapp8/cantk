/*
 * File:   ui-gsensor.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  gsensor event 
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIGSensor
 * @extends UIElement
 * 用于监听设备方向变化。
 *
 * 调用setEnable启用/关闭onDeviceOrientation事件。
 *
 */

/**
 * @event onDeviceOrientation
 * 重力感应事件。
 * @param {Number} x X方向重力。
 * @param {Number} y Y方向重力。
 * @param {Number} z Z方向重力。
 * @param {Object} event 原始事件。 
 */
function UIGSensor() {
	return;
}

UIGSensor.prototype = new UIElement();
UIGSensor.prototype.isUIGSensor = true;

UIGSensor.prototype.initUIGSensor = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.addEventNames(["onDeviceOrientation"]);

	return this;
}

UIGSensor.prototype.onInit = function() {
	if(this.enable) {
		this.setEnable(true);
	}
}

UIGSensor.prototype.setEnable = function(enable) {
	var me = this;
	if(this.isInDesignMode()) return this;

	function onDeviceOrientation(e) {
		var current = e.accelerationIncludingGravity;
		if(!current) {
			console.log("accelerationIncludingGravity not available.");
			return;
		}
		
		var x = current.x || 0;
		var y = current.y || 0;
		var z = current.z || -9.8;

		if(isAndroid()) {
			x = -x;
		}
		else if(isIPhone()) {
			y = -y;
		}

		me.callOnDeviceOrientation(x, y, z, e);

		return;
	}

	this.enable = enable;
	if(enable) {
		window.removeEventListener('devicemotion', onDeviceOrientation, false);		   
		window.addEventListener('devicemotion', onDeviceOrientation, false);	
	}
	else {
		window.removeEventListener('devicemotion', onDeviceOrientation, false);		   
	}

	return this;
}

function UIGSensorCreator() {
	var args = ["ui-gsensor", "ui-gsensor", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGSensor();
		return g.initUIGSensor(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGSensorCreator());

