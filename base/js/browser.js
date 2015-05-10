var browser = {    
	versions:function(){            
		var u = navigator.userAgent, app = navigator.appVersion;            
		return {                
			ie9: u.indexOf('MSIE 9.0') >=0,
			ie10: u.indexOf('MSIE 10.0') >=0,
			ie: u.indexOf('MSIE') >=0 || u.indexOf('Trident') >=0,
			oldIE: u.indexOf('MSIE 8.0') >=0||u.indexOf('MSIE 7.0') >=0 || u.indexOf('MSIE 6.0') >=0,
			android: u.indexOf('Android') >=0 && u.indexOf('Linux') >=0, 
			iPhone: u.indexOf('iPhone') >=0, 
			iPad: u.indexOf('iPad') >=0, 
			blackberry: u.indexOf('BlackBerry') >=0, 
			firefoxMobile:u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0,
			firefoxOS:u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0 && u.indexOf('Android') < 0,
			windowPhone: u.indexOf('Windows Phone') >=0,
			webkit: u.indexOf("WebKit") >=0,
			weixin: u.indexOf("MicroMessenger") >= 0,
			weibo: u.indexOf("weibo") >= 0,
			qq: u.indexOf("QQ") >= 0
		};
	}()
} 

function isQQ() {
	return browser.versions.qq;
}

function isWeiBo() {
	return browser.versions.weibo;
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
	return browser.versions.android 
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
	return browser.versions.firefoxOS;
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

console.logStr = "";
console.logR = console.log;

console.getLog = function() {
	return  console.logStr;
}

if(isMobile()) {
	console.log = function(str) {
		console.logStr += str + "\n";
		console.logR(str);

		return;
	}
}

console.log(navigator.userAgent + " version number=" + browserVersion()); 

