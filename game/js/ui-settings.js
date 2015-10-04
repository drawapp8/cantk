/*
 * File:   ui-settings.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  settings shape
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
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
	this.regSerializer(this.settingsToJson, this.settingsFromJson);

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

UISettings.prototype.setSetting = function(name, value) {
	var obj = this.getSettingObj(name);

	return obj.settings[name] = value;
}

UISettings.prototype.settingsFromJson = function(js) {
	this.settingsDef = js.settingsDef;

	return this;
}

UISettings.prototype.settingsToJson = function(o) {
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

