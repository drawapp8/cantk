/*
 * File: runtime_document.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: runtime document 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TRuntimeDocument() {
}

TRuntimeDocument.prototype = new TDocument();

TRuntimeDocument.prototype.updateAssetsMapRule = function(assetsConfig) {
	var key = null;
	var mapped = assetsConfig.mapped;
	var runtime = assetsConfig.runtime;
	var design = assetsConfig.design;

	var mapLanguage = assetsConfig.map.language;
	for(key in mapLanguage) {
		if(runtime.language.indexOf(key) >= 0) {
			mapped.language = mapLanguage[key];
			break;
		}
	}
	if(!mapped.language) {
		mapped.language = design.language;
	}

	var mapSize = assetsConfig.map.size;
	for(key  in mapSize) {
		if(key === runtime.size) {
			mapped.size = mapSize[key];
		}
	}
	if(!mapped.size) {
		mapped.size = design.size;
	}

	var mapDensity = assetsConfig.map.density;
	for(key  in mapDensity) {
		if(key === runtime.density) {
			mapped.density = mapDensity[key];
		}
	}
	if(!mapped.density) {
		mapped.density = design.density;
	}

	return this;
}

TRuntimeDocument.prototype.fixAssetsConfig = function(assetsConfig) {
	var runtime = {};
	var vp = cantkGetViewPort();
	var config = this.detectDeviceConfig();

	runtime.width = vp.width;
	runtime.height = vp.height;
	runtime.density = config.lcdDensity;
	runtime.language = Locales.getLang();
	runtime.size = runtime.width+"x"+runtime.height;

	assetsConfig.mapped = {};
	assetsConfig.runtime = runtime;

	this.updateAssetsMapRule(assetsConfig);

	return this;
}

TRuntimeDocument.prototype.createWindowManager = function(json) {
	var assetsConfig = this.getAssetsConfig();
	if(assetsConfig) {
		this.fixAssetsConfig(assetsConfig);
		ResLoader.setAssetsConfig(assetsConfig);
		ResLoader.mapImageURL = this.mapAssetURL.bind(this);
	}

	return TDocument.prototype.createWindowManager.call(this, json);
}

TRuntimeDocument.prototype.applyLocales = function(json) {
	var stringTable = null;
	var locales = json.locales;
	var name = Locales.getLang();

	if(!locales) return;

	for(var key in locales) {
		var keys = key.toLowerCase().split(";");
		for(var i = 0; i < keys.length; i++) {
			var iter = keys[i];
			if(iter === name || name.startWith(iter)) {
				stringTable = locales[key];
				console.log("Matched locale:" + name + " ==> " + key);
				break;
			}
		}
		if(stringTable) break;
	}

	if(!stringTable) {
		stringTable = locales["default"];
		if(stringTable) {
			console.log("Matched locale:" + name + " ==> default");
		}
	}

	if(stringTable) {
		webappSetLocaleStrings(stringTable);
	}

	return;
}

TRuntimeDocument.prototype.onBeforeLoad = function(json) {
	this.applyLocales(json);
}

TRuntimeDocument.prototype.mapAssetURL = function(url, assetsConfig) {
	if(!assetsConfig || !url || url.length > 1024) {
		return url;
	}

	var design = assetsConfig.design;
	var mapped = assetsConfig.mapped;
	
	if(design.language !== mapped.language && url.indexOf(design.language) >= 0) {
		url = url.replace(new RegExp(design.language, "g"), mapped.language);
	}

	if(design.density !== mapped.density && url.indexOf(design.density) >= 0) {
		url = url.replace(new RegExp(design.density, "g"), mapped.density);
	}

	if(design.size !== mapped.size && url.indexOf(design.size) >= 0) {
		url = url.replace(new RegExp(design.size, "g"), mapped.size);
	}

	return url;
}

