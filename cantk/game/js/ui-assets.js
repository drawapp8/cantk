/*
 * File:   ui-assets.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  assets manager
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIAssets
 * @extends UIElement
 * 资源管理控件，可以添加一组资源(如图片、JSON和其它数据)，导出时自动导出这些资源，运行时可以用loadImage/loadData/loadJSON来获取相应的资源。
 *
 * 资源管理控件主要用于管理普通控件没有引用到的资源，比如游戏需要的关卡数据，动态创建的控件需要的图片和JSON等等。
 *
 * 使用方法：
 *
 * 1.放入UIAssets控件。
 *
 * 2.双击UIAssets打开资源管理对话框。
 *
 * 3.点击“添加"按钮添加资源。
 *
 * 4.点击“确定"按钮保存配置。
 *
 * 5.在程序中使用请参考后面的示例。
 *
 */
function UIAssets() {
	return;
}

UIAssets.prototype = new UIElement();
UIAssets.prototype.isUIAssets = true;

UIAssets.prototype.initUIAssets = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.assets = {};

	return this;
}

UIAssets.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);
	
	this.assets = js.assets;

	return this;
}

UIAssets.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.assets = JSON.parse(JSON.stringify(this.assets || {}));

	return o;
}

/**
 * @method getAssetInfo
 * 获取指定名称的资源的相关信息。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的信息。.name表示资源的名称, .url资源的URL,  .type资源的类型。
 *
 */
UIAssets.prototype.getAssetInfo = function(name) {
	var info = this.assets[name];

	if(!info) {
		console.log("not found asset:" + name);
	}

	return info;
}

/**
 * @method getAssetURL
 * 获取指定名称的资源的URL。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的URL。
 *
 *     @example small frame
 *
 *     var win = this.win;
 *     var url = win.find("assets").getAssetURL("t.jpg");
 *     win.find("image").setValue(url);
 */
UIAssets.prototype.getAssetURL = function(name) {
	var info = this.getAssetInfo(name);

	return info ? info.url : null;
}

/**
 * @method loadJSON 
 * 加载指定名称的JSON数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(json) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onJsonLoad(json) {
 *          console.log("onJsonLoad:" + JSON.stringify(json, null, "\t"));
 *     }
 *     this.win.find("assets").loadJSON("test.json", onJsonLoad.bind(this));
 */
UIAssets.prototype.loadJSON = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "json") {
		console.log("asset is not json:" + name);
		return false;
	}

	return ResLoader.loadJson(info.url, onDone, onDone);
}

/**
 * @method loadImage
 * 加载指定名称的图片。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(img) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onImageLoad(img) {
 *          this.win.find("image").setValue(img);
 *     }
 *     this.win.find("assets").loadImage("t.jpg", onImageLoad.bind(this));
 */
UIAssets.prototype.loadImage = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "image") {
		console.log("asset is not image:" + name);
		return false;
	}

	return ResLoader.loadImage(info.url, onDone, onDone);
}

/**
 * @method loadData
 * 加载指定名称的文本数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(str) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *     
 *     function onDataLoad(data) {
 *          console.log("onDataLoad:" + data);
 *     }
 *     this.win.find("assets").loadData("test.txt", onDataLoad.bind(this));
 */
UIAssets.prototype.loadData = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "data") {
		console.log("asset is not data:" + name);
		return false;
	}

	return ResLoader.loadData(info.url, onDone, onDone);
}

/**
 * @method loadAll
 * 加载全部资源。
 * @param {Function} onProgress(percent, finished, total) 加载进度的回调函数。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *
 *     this.win.assets.loadAll(function(percent, finished, total) {
 *         console.log("finished " + percent + "(" + finished + "/" + total + ")");
 *     })
 */
UIAssets.prototype.loadAll = function(onProgress) {
	var total = 0;
	var finished = 0;

	function onDone() {
		finished++;
		if(onProgress) {
			onProgress(100*(finished/total), finished, total);
		}
	}

	var assets = this.assets;
	for(var key in assets) {
		total++;
	}

	for(var key in assets) {
		var info = assets[key];
		if(info.type === "json") {
			ResLoader.loadJson(info.url, onDone);
		}else if(info.type === "data") {
			ResLoader.loadData(info.url, onDone);
		}else if(info.type === "image") {
			ResLoader.loadImage(info.url, onDone);
		}
	}

	return this;
}

function UIAssetsCreator() {
	var args = ["ui-assets", "ui-assets", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIAssets();
		return g.initUIAssets(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIAssetsCreator());

