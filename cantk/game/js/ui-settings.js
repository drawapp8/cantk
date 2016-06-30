/*
 * File:   ui-settings.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  settings shape
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

/**
 * @class UISettings
 * @extends UIElement
 * 将游戏的设置独立出来，在IDE中提供一个可视化的界面，让游戏策划不需要程序配合，就可以修改这些数值来调节游戏的效果（使用时先用管理设置对话框中增加设置)。
 *
 *     @example small frame
 *     var settings = this.win.find("settings");
 *
 *     var speed = settings.getSetting("speed");
 *     console.log(speed);
 *
 */
function UISettings() {
	return;
}

UISettings.prototype = new UIElement();
UISettings.prototype.isUISettings = true;

UISettings.prototype.initUISettings = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.settingsDef = {};

	return this;
}

UISettings.prototype.getSettingObj = function(name) {
	var def = this.settingsDef[name];

	if(def && def.isGlobal) {
		return this.getWindowManager();
	}
	else {
		return this.getWindow();
	}
}

/**
 * @method getSetting
 * 获取name设置对应的值。
 * @param {String} name 
 * @return {Number} 返回对应的值。
 *
 */
UISettings.prototype.getSetting = function(name) {
	var obj = this.getSettingObj(name);

	var value = obj.settings[name];
	if(value === undefined) {
		var def = this.settingsDef[name];
		if(def) {
			value = def.defVal;
		}
	}

	return value;
}

/**
 * @method setSetting
 * 设置name设置对应的值。
 * @param {String} name 
 * @param {Number} value
 * @return {UIElement} 返回控件本身。
 *
 */
UISettings.prototype.setSetting = function(name, value) {
	var obj = this.getSettingObj(name);

	obj.settings[name] = value;

	return this;
}

UISettings.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.settingsDef = js.settingsDef;

	return this;
}

UISettings.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.settingsDef = this.settingsDef;

	return o;
}

function UISettingsCreator() {
	var args = ["ui-settings", "ui-settings", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISettings();
		return g.initUISettings(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISettingsCreator());

