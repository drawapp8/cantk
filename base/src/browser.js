function browser() {
}

browser.init = function() {
	var u = navigator.userAgent, app = navigator.appVersion;

	browser = {};
	browser.ie9 = u.indexOf('MSIE 9.0') >=0;
	browser.ie10 = u.indexOf('MSIE 10.0') >=0;
	browser.ie = u.indexOf('MSIE') >=0 || u.indexOf('Trident') >=0;
	browser.oldIE = u.indexOf('MSIE 8.0') >=0||u.indexOf('MSIE 7.0') >=0 || u.indexOf('MSIE 6.0') >=0;
	browser.android = u.indexOf('Android') >=0 && u.indexOf('Linux') >=0;
	browser.iPhone = u.indexOf('iPhone') >=0;
	browser.iPad = u.indexOf('iPad') >=0;
	browser.blackberry = u.indexOf('BlackBerry') >=0;
	browser.firefoxMobile = u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0;
	browser.firefoxOS = u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0 && u.indexOf('Android') < 0;
	browser.windowPhone = u.indexOf('Windows Phone') >=0;
	browser.webkit = u.indexOf("WebKit") >=0;
	browser.weixin = u.indexOf("MicroMessenger") >= 0;
	browser.weibo = u.indexOf("weibo") >= 0;
	browser.qq = u.indexOf("QQ") >= 0;

	if(browser.iPhone) {
		var a = u.match(/iPhone; CPU iPhone OS \d+/g);
		if(a && a.length) {
			browser.iOSVersion = parseInt(a[0].match(/\d+/g)[0]);
		}
	}

	function getBrowserVersionNumber() {
		var ua = navigator.userAgent;
		var keys = ["AppleWebKit/", "AppleWebKit ", "AppleWebKit", "MSIE ", "Firefox/", 
			"Safari/", "Opera ", "Opera/"];

		for(var i = 0; i < keys.length; i++) {
			var iter = keys[i];
			var offset = ua.indexOf(iter);
			if(offset >= 0) {
				var str = ua.substr(offset + iter.length);
				var version = parseFloat(str);

				return version;
			}
		}

		return 1.0;
	}

	browser.number = getBrowserVersionNumber();

	browser.isAudioSupportLoop = true;
	if(browser.isIPhone && browser.iOSVersion < 6) {
		browser.isAudioSupportLoop = false;
	}

	if(browser.oldIE || browser.ie9) {
		window.console = {};
		window.console.log = function(str) {};
	}
	
	browser.isMobile = browser.android || browser.iPhone || browser.blackberry
		|| browser.windowPhone || browser.firefoxMobile;

	if(browser.isMobile) {
		window.console.logStr = "";
		window.console.logR = window.console.log;

		window.console.getLog = function() {
			return window.console.logStr;
		}

		window.console.log = function(str) {
			window.console.logStr += str + "\n";
			window.console.logR(str);

			return;
		}
	}

	console.log(navigator.userAgent); 
	window.isSpecialBrowser = browser.qq || browser.weibo || browser.weixin;

	return;
}

function isQQ() {
	return browser.qq;
}

function isWeiBo() {
	return browser.weibo;
}

function isWeiXin() {
	return browser.weixin;
}

function isWebkit() {
	return browser.webkit;
}

function isOldIE() {
	return browser.oldIE;
}

function isIE() {
	return browser.ie;
}

if(browser.oldIE) {
	console.log("oldIE "+browser.oldIE);
}

function isMobile() {
	return browser.isMobile;
}

function isAndroid() {
	return browser.android;
}

function isIPhone() {
	return browser.iPhone;
}

function isIPad() {
	return browser.ipad;
}

function isWinPhone() {
	return browser.windowPhone;
}

function isBlackBerry() {
	return browser.blackberry;
}

function isFirefoxMobile() {
	return browser.firefoxMobile;
}

function isFirefoxOS () {
	return browser.firefoxOS;
}

function isPhoneGap() {
	return (window.cordova || window.Cordova || window.PhoneGap || window.phonegap) 
		&& /^file:\/{3}[^\/]/i.test(window.location.href) 
		&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function isTizen() {
	return window.tizen;
}

function browserVersion() {
	return browser.number;
}

browser.init();

