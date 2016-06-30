/*
 * File:   ui-weixin.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  WeiXin Settings/Events
 * 
 * Copyright (c) 2015 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWeixin 
 * @extends UIElement 
 * 微信设置控件。配置成功后可以调用微信JSAPI。导出游戏到自己的服务器上运行，需要提供自己的配置文件URL。
 * 
 * 使用自己的配置文件URL请参考：https://github.com/drawapp8/GameWiki/wiki/Wechat-JSSDK-wiki
 *
 * 微信JSAPI: http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 */
function UIWeixin() {
	return;
}

UIWeixin.prototype = new UIElement();
UIWeixin.prototype.isUIWeixin = true;
UIWeixin.prototype.saveProps = ["configURL", "shareTitle", "shareDesc", "shareLink", "shareImage", 
		"apiList", "debug"];

UIWeixin.prototype.initUIWeixin = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setCanRectSelectable(false, true);

	return this;
}

UIWeixin.jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
      ];

UIWeixin.prototype.getConfig = function(configURL, jsApiList, debug) {
	if(UIWeixin.config) {
		return;
	}
	else {
		UIWeixin.config = {};
	}

	httpGetJSON(configURL, function onDone(data) {
		UIWeixin.config = data;

		if(UIWeixin.config) {
			UIWeixin.config.jsApiList = jsApiList;
			UIWeixin.config.debug = debug;
			console.log("Fetch UIWeixin.config success:");
		}
		else {
			console.log("Fetch weixin config failed.");
			return;
		}

		function callWeiXinConfig() {
			try {
				wx.config(UIWeixin.config);
				UIWeixin.configDone = true;
				console.log(JSON.stringify(UIWeixin.config, null, "\t"));
				console.log("Call wx.config done:");
			}
			catch(e) {
				console.log("wx script is not load yet, try to config lator:");
				setTimeout(callWeiXinConfig, 100);
			}
		}

		if(isWeiXin()) {
			console.log("Is WeiXin, try to config it.");
			callWeiXinConfig();
		}
		else {
			console.log("It is not weixin browser");
		}
	});
}

UIWeixin.prototype.onFromJsonDone = function() {
	var url = window.btoa(location.href);
	var configURL = null;

	if(location.href.indexOf('i5r.com.cn') >= 0) {
		configURL = this.configURL ? this.configURL : "/weixin/php/json_config.php";
	}
	else {
		configURL = this.configURL ? this.configURL : "/wechat/config";
	}

	if(configURL.indexOf("?") > 0) {
		configURL = configURL + "&url=" + url;
	}
	else {
		configURL = configURL + "?url=" + url;
	}

	var jsApiList = UIWeixin.jsApiList;
	if(this.apiList) {
		jsApiList = this.apiList.split("\n");
	}

	this.getConfig(configURL, jsApiList, this.debug);

	return;
}

UIWeixin.prototype.onInit = function() {
	var me = this;
	if(!window.wx) {
		console.log("UIWeixin.prototype.onInit wx not defined.");
		return;
	}

	wx.ready(function () {
		UIWeixin.ready = true;
		me.updateShareInfo();
		console.log("wx.ready");
	});

	wx.error(function (res) {
	});

	console.log("UIWeixin.prototype.onInit end");

	return;
}

UIWeixin.prototype.onDeinit = function() {

	return;
}

UIWeixin.prototype.shapeCanBeChild = function(shape) {
	return false;
}

/**
 * @method setShareTitle
 * 设置分享标题。
 * @param {String} shareTitle 分享标题。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareTitle = function(shareTitle) {
	this.shareTitle = shareTitle;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareDesc
 * 设置分享描述。
 * @param {String} shareDesc 分享描述。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareDesc = function(shareDesc) {
	this.shareDesc = shareDesc;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareLink
 * 设置分享链接。
 * @param {String} shareLink 分享链接。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareLink = function(shareLink) {
	this.shareLink = shareLink;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareImage
 * 设置分享图片。
 * @param {String} shareImage 分享图片。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareImage = function(shareImage) {
	this.shareImage = shareImage;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.updateShareInfo = function() { 
	if(!window.wx) {
		return;
	}

	var view = this.view;
	var title = this.shareTitle ? this.shareTitle : view.getAppName();
	var desc = this.shareDesc ? this.shareDesc : view.getAppDesc();
	var link = this.shareLink ? this.shareLink : location.href;
	var imgUrl = ResLoader.toAbsURL(this.shareImage ? this.shareImage : view.getAppIcon());

	var info = {
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		trigger: function (res) {
			console.log("weixin operation trigger:" + JSON.stringify(res));
		},
		success: function (res) {
			console.log("weixin operation success:" + JSON.stringify(res));
		},
		cancel: function (res) {
			console.log("weixin operation cancel:" + JSON.stringify(res));
		},
		fail: function (res) {
			console.log("weixin operation fail:" + JSON.stringify(res));
		}
	};

    wx.onMenuShareAppMessage(info);
    wx.onMenuShareTimeline(info);
    wx.onMenuShareQQ(info);
    wx.onMenuShareWeibo(info);

	return;
}

function UIWeixinCreator() {
	var args = ["ui-weixin", "ui-weixin", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWeixin();
		return g.initUIWeixin(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIWeixinCreator());

