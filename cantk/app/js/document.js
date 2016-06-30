/*
 * File: document.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: document
 *
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 *
 */

function TDocument() {
}

TDocument.magic = "cantk";
TDocument.prototype.loadURL = function(url) {
	httpGetJSON(url, this.loadJson.bind(this));

	return this;
}

TDocument.prototype.loadString = function(str) {
	try {
		var json = JSON.parse(str);
		this.loadJson(json);
	}catch(e) {
		console.log("loadString:" + e.message);
	}

	return this;
}

TDocument.prototype.getEmptyDoc = function() {
	var doc = {};
	doc.version = 2;
	doc.magic = TDocument.magic;

	return doc;
}

TDocument.prototype.getLocales = function() {
	if(!this.doc.locales) {
		this.doc.locales = {
			"default":{},
			"en":{},
			"zh": {}
		};
	}

	return this.doc.locales;
}

TDocument.prototype.getAssetsConfig = function() {
	var meta = this.getMeta();

	return meta.assetsConfig || TDocument.getDefaultAssetsConfig();
}

TDocument.prototype.getAssetsConfigStr = function() {
	var config = this.getAssetsConfig();

	return JSON.stringify(config, null, "\t");
}

TDocument.prototype.setAssetsConfigStr = function(str) {
	try {
		var config = JSON.parse(str);
		this.setAssetsConfig(config);
	}catch(e) {
		console.log("setAssetsConfigStr:" + e.message);
	}

	return this;
}

TDocument.prototype.setAssetsConfig = function(config) {
	var meta = this.getMeta();
	meta.assetsConfig = config;

	return this;
}

TDocument.getDefaultAssetsConfig = function() {
	if(!TDocument.defaultAssetsConfig) {
		var c = {};
		c.assets = {};
		c.assets.sizes = ["1280x800", "480x800"];
		c.assets.densities = ["hdpi", "xhdpi"];
		c.assets.languages = ["en", "zh"]

		c.design = {};
		c.design.size = "480x800";
		c.design.density = "hdpi";
		c.design.language = "en";

		c.map = {}
		c.map.size = {
			"1280x720":"480x800",
			"480x800":"480x800"
		};
		c.map.density = {
			"ldpi":"hdpi",
			"mdpi":"hdpi",
			"xhdpi":"hdpi",
			"xxhdpi":"hdpi"
		};
		c.map.language = {
			"en":"en",
			"zh":"en"
		}

		TDocument.defaultAssetsConfig = c;
	}

	return TDocument.defaultAssetsConfig;
}

TDocument.prototype.setLocales = function(locales) {
	this.doc.locales = locales;

	return this;
}

TDocument.prototype.getMetaInfo = TDocument.prototype.getMeta = function() {
	return this.doc.meta;
}

TDocument.prototype.getDocID = function() {
	return this.doc.docid;
}

TDocument.prototype.getDeviceConfig = function() {
	return this.wm.deviceConfig;
}

TDocument.prototype.loadV1 = function(json) {
	if(!json.pages || !json.pages[0].shapes || !json.pages[0].shapes[0].children) {
		return this;
	}

	var doc = this.getEmptyDoc();
	doc.meta = json.meta;
	doc.docid = json.docid;

	var device = json.pages[0].shapes[0];
	function forEach(shape) {

		if(shape.type === "ui-window-manager") {
			doc.wm = shape;

			return;
		}

		if(shape.children) {
			var n = shape.children.length;
			for(var i = 0; i < n; i++) {
				var iter = shape.children[i];
				forEach(iter);
			}
		}
	}

	forEach(device);

	doc.deviceConfig = device.config;
	this.loadV2(doc);

	return ;
}

TDocument.prototype.createWindowManager = function(json) {
	var factory = ShapeFactory.getInstance();
	var wm = factory.createShapeByProgram(json.wm.type);

	wm.fromJson(json.wm);
	wm.deviceConfig = json.deviceConfig;

	return wm;
}

TDocument.prototype.onBeforeLoad = function(json) {
}

TDocument.prototype.loadV2 = function(json) {
	this.doc = json;

	this.onBeforeLoad(json);
	this.wm = this.createWindowManager(json);

	var meta = this.getMeta();
    if(meta && meta.general) {
        document.title = meta.general.appname;
    }
	if(meta && meta.extfonts) {
		ResLoader.loadFonts(meta.extfonts);
	}


    var keys = ["soundMusicAutoPlay", "soundMusicLoop", "soundMusicVolume",
        "soundMusicURLs", "soundEffectsEnalbe", "soundEffectVolume", "soundEffectURLs"];
    keys.forEach(function(it) {
        if(it in json.wm) {
            this.wm[it] = json.wm[it];
        }
    }, this);

    var wm = this.wm;
    if(meta && meta.soundConfig) {
        var keys = ["soundMusicAutoPlay", "soundMusicLoop", "soundMusicVolume", "soundMusicURLs", "soundEffectsEnalbe", "soundEffectVolume", "soundEffectURLs"];
        keys.forEach(function(key) {
            wm[key] = meta.soundConfig[key];
        })

        wm.setSoundMusicVolume(wm.soundMusicVolume);
        wm.setSoundEffectVolume(wm.soundEffectVolume);
    }

	this.onLoad();

	return;
}

TDocument.prototype.loadJson = function(json) {
	if(!json) return this;

	if(json.magic === "drawapps") {
		this.loadV1(json);
	}
	else if(json.magic === TDocument.magic) {
		this.loadV2(json);
	}
    else if(json.code === 302) {
        window.location.href = json.data;
    }
	else {
		console.log("invalid json");
	}

	return this;
}

TDocument.prototype.getWindowManager = function() {
	return this.wm;
}

TDocument.prototype.getCurrentWindow = function() {
	return this.wm ? this.wm.getCurrentWindow() : null;
}

TDocument.prototype.detectDeviceConfig = function() {
	if(this.detectedDeviceConfig) {
		return this.detectedDeviceConfig;
	}

	var deviceConfig = {version:4};

	if(isAndroid()) {
		deviceConfig.platform = "android";
	}
	else if(isIPhone () || isIPad()) {
		deviceConfig.platform = "iphone";
	}
	else if(isFirefoxOS()) {
		deviceConfig.platform = "firefox";
	}
	else if(isWinPhone()) {
		deviceConfig.platform = "winphone";
	}
	else if(isTizen()) {
		deviceConfig.platform = "tizen";
	}
	else {
		deviceConfig.platform = "android";
	}

	if(window.devicePixelRatio > 2.2) {
		deviceConfig.lcdDensity = "xxhdpi";
	}
	else if(window.devicePixelRatio > 1.5) {
		deviceConfig.lcdDensity = "xhdpi";
	}
	else if(window.devicePixelRatio > 1.1) {
		deviceConfig.lcdDensity = "hdpi";
	}
	else if(window.devicePixelRatio > 0.8) {
		deviceConfig.lcdDensity = "mdpi";
	}
	else if(!window.devicePixelRatio) {
		var minSize = Math.min(window.orgViewPort.width, window.orgViewPort.height);
		if(minSize > 600) {
			deviceConfig.lcdDensity = "xhdpi";
		}
		else {
			deviceConfig.lcdDensity = "hdpi";
		}
	}
	else {
		deviceConfig.lcdDensity = "ldpi";
	}

	if(isFirefoxOS()) {
		deviceConfig.lcdDensity = "mdpi";
	}

	if(!isMobile()) {
		deviceConfig.lcdDensity = "hdpi";
	}

	this.detectedDeviceConfig = deviceConfig;
//	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
//	console.log("deviceConfig.platform:" + deviceConfig.platform);

	return deviceConfig;
}

