if(!window.CanTK) {
	window.CanTK = {};
}

CanTK.isOldIE = isOldIE;
CanTK.isTizen = isTizen;
CanTK.isMobile = isMobile;
CanTK.isAndroid = isAndroid;
CanTK.isFirefoxOS = isFirefoxOS;
CanTK.isRightMouseEvent = isRightMouseEvent;
CanTK.delayLoadScripts = delayLoadScripts;
CanTK.initViewPort = cantkInitViewPort;
CanTK.restoreViewPort = cantkRestoreViewPort;
CanTK.httpDoRequest = httpDoRequest;	

CanTK.LinearInterpolator = LinearInterpolator;
CanTK.BounceInterpolator = BounceInterpolator;
CanTK.AccelerateInterpolator = AccelerateInterpolator;
CanTK.AccDecelerateInterpolator = AccDecelerateInterpolator;
CanTK.DecelerateInterpolator = DecelerateInterpolator;
CanTK.detectDeviceConfig = cantkDetectDeviceConfig;

window.isOldIE = isOldIE;
window.isTizen = isTizen;
window.isMobile = isMobile;
window.isAndroid = isAndroid;
window.isFirefoxOS = isFirefoxOS;
window.httpDoRequest = httpDoRequest;
window.cantkGetLocale = cantkGetLocale;
window.cantkInitViewPort = cantkInitViewPort;
window.cantkRestoreViewPort = cantkRestoreViewPort;
window.cantkRegisterUIElements = cantkRegisterUIElements;	
window.cantkGetViewPort = cantkGetViewPort;

CanTK.UIImage = UIImage;
CanTK.getEffectsPlayer = getEffectsPlayer;
CanTK.getMusicPlayer = getMusicPlayer;
CanTK.Physics = Physics;

CanTK.UIElement = UIElement;
CanTK.init = function () {
	return cantkRegisterUIElements();
}

CanTK.createElement = function(type) {
	return ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
}

CanTK.createElementWithJson = function(data) {
	var type = data.type;
	var el = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);

	if(el) {
		el.fromJson(data);
		el.setMode(C_MODE_RUNNING, true);
	}

	return el;
}

CanTK.UIElement.RUNNING = C_MODE_RUNNING;
CanTK.UIElement.DEFAULT_IMAGE = CANTK_IMAGE_DEFAULT;

CanTK.setResRoot = function(resRoot) {
	return ResLoader.setResRoot(resRoot);
}

