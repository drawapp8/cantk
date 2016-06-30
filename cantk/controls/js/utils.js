function dupDeviceConfig(config) {
	var o = {};

	o.name = config.name;
	o.bg = config.bg
	o.platform = config.platform;
	o.version = config.version;
	o.lcdDensity = config.lcdDensity;
	o.width = config.width;
	o.height = config.height;
	o.screenX = config.screenX;
	o.screenY = config.screenY;
	o.screenW = config.screenW;
	o.screenH = config.screenH;
	o.hasMenuBar = config.hasMenuBar;

	return o;
}
	
function cantkDetectDeviceConfig() {
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

	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
	console.log("deviceConfig.platform:" + deviceConfig.platform);

	return deviceConfig;
}

function isDeviceConfigEqual(c1, c2) {
	var s1 = JSON.stringify(c1);
	var s2 = JSON.stringify(c2);

	return s1 === s2;
}

function cantkPreloadImage(src) {
	var image = new WImage(src);

	return image;
}
	
var gTempCanvas = null;
function cantkGetTempCanvas(width, height) {
	if(!gTempCanvas) {
		gTempCanvas = document.createElement("canvas");

		gTempCanvas.type = "backend_canvas";
		gTempCanvas.width = width;
		gTempCanvas.height = height;
	}

	if(gTempCanvas) {
		if(gTempCanvas.width != width) {
			gTempCanvas.width = width;
		}

		if(gTempCanvas.height != height) {
			gTempCanvas.height = height;
		}
	}

	return gTempCanvas;
}

//////////////////////////////////////////////////////////////////////////}-{

var gApp8LocaleStrings = {
	'Loading...':'正在努力加载...'
};

function webappGetText(text) {
	var str = null;
	if(!text) {
		return "";
	}

	if(gApp8LocaleStrings) {
		str = gApp8LocaleStrings[text];
	}

	if(!str) {
		str = text;
//		console.log("\""+text+"\":" + "\"" +text+ "\",");
	}

	return str;
}

function webappSetLocaleStrings(strs) {
	gApp8LocaleStrings = strs;

	return;
}

