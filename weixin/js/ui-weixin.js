/*
 * File:   ui-weixin.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  WeiXin Settings/Events
 * 
 * Copyright (c) 2015 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWeixin() {
	return;
}

UIWeixin.prototype = new UIElement();
UIWeixin.prototype.isUIWeixin = true;

UIWeixin.prototype.initUIWeixin = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onOperationTrigger", "onOperationComplete", "onOperationSuccess", 
		"onOperationFail", "onOperationCancel"]);

	return this;
}

UIWeixin.prototype.onAppendedInParent = function() {
	DevelopmentApp.addUserScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js");

	return;
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

UIWeixin.prototype.onFromJsonDone = function() {
	var debug = this.debug;
	var jsApiList = UIWeixin.jsApiList;
	var url = window.btoa(location.href);
	var configURL = this.configURL ? this.configURL : "/weixin/php/json_config.php";
	if(this.apiList) {
		jsApiList = this.apiList.split("\n");
	}

	if(configURL.indexOf("?") > 0) {
		configURL = configURL + "&url=" + url;
	}
	else {
		configURL = configURL + "?url=" + url;
	}

	if(!UIWeixin.config) {
		console.log("To fetch UIWeixin.config:" + configURL);
		httpGetJSON(configURL, function onDone(data) {
			UIWeixin.config = data;

			if(UIWeixin.config) {
				UIWeixin.config.jsApiList = jsApiList;
				UIWeixin.config.debug = debug;
				console.log("Fetch UIWeixin.config success:");
				console.log(JSON.stringify(UIWeixin.config, null, "\t"));
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

	return;
}

UIWeixin.prototype.onInit = function() {
	var me = this;
	wx.ready(function () {
		UIWeixin.ready = true;
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

UIWeixin.prototype.setShareTitle = function(shareTitle) {
	this.shareTitle = shareTitle;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.setShareDesc = function(shareDesc) {
	this.shareDesc = shareDesc;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.setShareLink = function(shareLink) {
	this.shareLink = shareLink;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.setShareImage = function(shareImage) {
	this.shareImage = shareImage;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.callOnOperationTriggerHandler = function(operation, res) {
	if(!this.handleOnOperationTrigger) {
		var sourceCode = this.events["onOperationTrigger"];
		if(sourceCode) {
			sourceCode = "this.handleOnOperationTrigger = function(operation, res) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOperationTrigger) {
		try {
			this.handleOnOperationTrigger(operation, res);
		}catch(e) {
			console.log("this.handleOnOperationTrigger:" + e.message);
		}
	}

	return true;
}

UIWeixin.prototype.callOnOperationCompleteHandler = function(operation, res) {
	if(!this.handleOnOperationComplete) {
		var sourceCode = this.events["onOperationComplete"];
		if(sourceCode) {
			sourceCode = "this.handleOnOperationComplete = function(operation, res) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOperationComplete) {
		try {
			this.handleOnOperationComplete(operation, res);
		}catch(e) {
			console.log("this.handleOnOperationComplete:" + e.message);
		}
	}

	return true;
}

UIWeixin.prototype.callOnOperationSuccessHandler = function(operation, res) {
	if(!this.handleOnOperationSuccess) {
		var sourceCode = this.events["onOperationSuccess"];
		if(sourceCode) {
			sourceCode = "this.handleOnOperationSuccess = function(operation, res) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOperationSuccess) {
		try {
			this.handleOnOperationSuccess(operation, res);
		}catch(e) {
			console.log("this.handleOnOperationSuccess:" + e.message);
		}
	}

	return true;
}

UIWeixin.prototype.callOnOperationFailHandler = function(operation, res) {
	if(!this.handleOnOperationFail) {
		var sourceCode = this.events["onOperationFail"];
		if(sourceCode) {
			sourceCode = "this.handleOnOperationFail = function(operation, res) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOperationFail) {
		try {
			this.handleOnOperationFail(operation, res);
		}catch(e) {
			console.log("this.handleOnOperationFail:" + e.message);
		}
	}

	return true;
}

UIWeixin.prototype.callOnOperationCancelHandler = function(operation, res) {
	if(!this.handleOnOperationCancel) {
		var sourceCode = this.events["onOperationCancel"];
		if(sourceCode) {
			sourceCode = "this.handleOnOperationCancel = function(operation, res) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOperationCancel) {
		try {
			this.handleOnOperationCancel(operation, res);
		}catch(e) {
			console.log("this.handleOnOperationCancel:" + e.message);
		}
	}

	return true;
}

UIWeixin.prototype.updateShareInfo = function() { 
	var weiXin = this;

	if(!weiXin.shareTitle || !weiXin.shareDesc) {
		console.log("UIWeixin.prototype.updateShareInfo: not title or desc");
		return;	
	}

	console.log("UIWeixin.prototype.updateShareInfo:" + weiXin.shareTitle + ":" + weiXin.shareDesc +
		":" + weiXin.shareLink + ":" + weiXin.shareImage);

    wx.onMenuShareAppMessage({
      title: weiXin.shareTitle,
      desc: weiXin.shareDesc,
      link: weiXin.shareLink,
      imgUrl: weiXin.shareImage,
      trigger: function (res) {
      	weiXin.callOnOperationTriggerHandler("share-app-message", res);
      },
      success: function (res) {
      	weiXin.callOnOperationSuccessHandler("share-app-message", res);
      },
      cancel: function (res) {
      	weiXin.callOnOperationCancelHandler("share-app-message", res);
      },
      fail: function (res) {
      	weiXin.callOnOperationCancelHandler("share-app-message", res);
      }
    });
    
    wx.onMenuShareTimeline({
      title: weiXin.shareTitle,
      desc: weiXin.shareDesc,
      link: weiXin.shareLink,
      imgUrl: weiXin.shareImage,
      trigger: function (res) {
      	weiXin.callOnOperationTriggerHandler("share-time-line", res);
      },
      success: function (res) {
      	weiXin.callOnOperationSuccessHandler("share-time-line", res);
      },
      cancel: function (res) {
      	weiXin.callOnOperationCancelHandler("share-time-line", res);
      },
      fail: function (res) {
      	weiXin.callOnOperationCancelHandler("share-time-line", res);
      }
    });
    
    wx.onMenuShareQQ({
      title: weiXin.shareTitle,
      desc: weiXin.shareDesc,
      link: weiXin.shareLink,
      imgUrl: weiXin.shareImage,
      trigger: function (res) {
      	weiXin.callOnOperationTriggerHandler("share-qq", res);
      },
      success: function (res) {
      	weiXin.callOnOperationSuccessHandler("share-qq", res);
      },
      cancel: function (res) {
      	weiXin.callOnOperationCancelHandler("share-qq", res);
      },
      fail: function (res) {
      	weiXin.callOnOperationCancelHandler("share-qq", res);
      }
    });
    
    wx.onMenuShareWeibo({
      title: weiXin.shareTitle,
      desc: weiXin.shareDesc,
      link: weiXin.shareLink,
      imgUrl: weiXin.shareImage,
      trigger: function (res) {
      	weiXin.callOnOperationTriggerHandler("share-weibo", res);
      },
      success: function (res) {
      	weiXin.callOnOperationSuccessHandler("share-weibo", res);
      },
      cancel: function (res) {
      	weiXin.callOnOperationCancelHandler("share-weibo", res);
      },
      fail: function (res) {
      	weiXin.callOnOperationCancelHandler("share-weibo", res);
      }
    });

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

