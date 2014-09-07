/*
 * File: trace.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: portable log
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var browser = {    
	versions:function(){            
	var u = navigator.userAgent, app = navigator.appVersion;            
	return {                
		ie9: u.indexOf('MSIE 9.0') > -1,
		ie10: u.indexOf('MSIE 10.0') > -1,
		ie: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
		oldIE: u.indexOf('MSIE 8.0') > -1||u.indexOf('MSIE 7.0') > -1 || u.indexOf('MSIE 6.0') > -1,
		android: u.indexOf('Android') > -1 && u.indexOf('Linux') > -1, 
		iPhone: u.indexOf('iPhone') > -1, 
		iPad: u.indexOf('iPad') > -1, 
		blackberry: u.indexOf('BlackBerry') > -1, 
		firefoxMobile:u.indexOf('Mobile') > -1 && u.indexOf('Firefox') > -1,
		windowPhone: u.indexOf('Windows Phone') > -1,
		webkit: u.indexOf("WebKit") > -1,
		weixin: u.indexOf("MicroMessenger") >= 0
	};
	}()
} 

function isWeiXin() {
	return browser.versions.weixin;
}

function isWebkit() {
	return browser.versions.webkit;
}

if(browser.versions.oldIE || browser.versions.ie9) {
	window.console = {};
	window.console.log = function(str) {};
}

var gForceMobile = false
function setForceMobile(value) {
	gForceMobile = value;

	return;
}

function isOldIE() {
	return browser.versions.oldIE;
}

function isIE() {
	return browser.versions.ie;
}

if(browser.versions.oldIE) {
	console.log("oldIE "+browser.versions.oldIE);
}

function isMobile() {
	return gForceMobile || browser.versions.android 
		|| browser.versions.iPhone 
		|| browser.versions.blackberry
		|| browser.versions.windowPhone
		|| browser.versions.firefoxMobile;
}

function isAndroid() {
	return browser.versions.android;
}

function isIPhone() {
	return browser.versions.iPhone;
}

function isIPad() {
	return browser.versions.ipad;
}

function isWinPhone() {
	return browser.versions.windowPhone;
}

function isBlackBerry() {
	return browser.versions.blackberry;
}

function isFirefoxMobile() {
	return browser.versions.firefoxMobile;
}

function isFirefoxOS () {
	return browser.versions.firefoxMobile;
}

function isPhoneGap() {
	return (window.cordova || window.Cordova || window.PhoneGap || window.phonegap) 
		&& /^file:\/{3}[^\/]/i.test(window.location.href) 
		&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function isTizen() {
	return window.tizen;
}

function getBrowserVersionNumber() {
	var ua = navigator.userAgent;
	var keys = ["AppleWebKit/", "AppleWebKit ", "AppleWebKit", "MSIE ", "Firefox/", "Safari/", "Opera ", "Opera/"];

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

browser.versions.number = getBrowserVersionNumber();

function browserVersion() {
	return browser.versions.number;
}

console.log(navigator.userAgent + " version number=" + browserVersion()); 

