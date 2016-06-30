
/*
 * File:    browser.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   detect browser
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function browser() {
}

browser.init = function() {
	var u = navigator.userAgent, app = navigator.appVersion;

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
	browser.linux = u.indexOf("Linux") >= 0;
	browser.windows = u.indexOf("Windows") >= 0;
	browser.macosx = u.indexOf("Mac OS X") >= 0;

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
		|| browser.windowPhone || browser.firefoxMobile || browser.iPad;

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

browser.isWindows = function() {
	return !browser.isMobile && browser.windows;
}

browser.isLinux = function() {
	return !browser.isMobile && browser.linux;
}

browser.isMacOSX = function() {
	return !browser.isMobile && browser.macosx;
}

function isAndroid() {
	return browser.android;
}

function isIPhone() {
	return browser.iPhone;
}

function isIPad() {
	return browser.iPad;
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

function isHolaPlay() {
	return window.cantkRTV8;
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

if (typeof KeyEvent === "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_BACK_BUTTON: 115, /*F4*/
        DOM_VK_MENU_BUTTON: 118, /*F7*/
        DOM_VK_SEARCH_BUTTON: 120, /*F9*/
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
KeyEvent.DOM_VK_BACK = 225;

browser.init();

