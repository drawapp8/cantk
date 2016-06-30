if(!window.CanTK) {
	window.CanTK = {};
}

CanTK.isOldIE = isOldIE;
CanTK.isTizen = isTizen;
CanTK.isMobile = isMobile;
CanTK.isAndroid = isAndroid;
CanTK.isFirefoxOS = isFirefoxOS;
CanTK.initViewPort = cantkInitViewPort;
CanTK.restoreViewPort = cantkRestoreViewPort;
CanTK.httpGetURL = httpGetURL;
CanTK.httpGetJSON = httpGetJSON;
CanTK.httpDoRequest = httpDoRequest;

CanTK.LinearInterpolator = LinearInterpolator;
CanTK.BounceInterpolator = BounceInterpolator;
CanTK.AccelerateInterpolator = AccelerateInterpolator;
CanTK.AccDecelerateInterpolator = AccDecelerateInterpolator;
CanTK.DecelerateInterpolator = DecelerateInterpolator;
CanTK.detectDeviceConfig = cantkDetectDeviceConfig;
CanTK.regShapeCreator = cantkRegShapeCreator;
CanTK.ShapeCreator = ShapeCreator;

window.isOldIE = isOldIE;
window.isTizen = isTizen;
window.isMobile = isMobile;
window.isAndroid = isAndroid;
window.isFirefoxOS = isFirefoxOS;
window.httpGetURL = httpGetURL;
window.httpGetJSON = httpGetJSON;
window.httpDoRequest = httpDoRequest;
window.cantkInitViewPort = cantkInitViewPort;
window.cantkRestoreViewPort = cantkRestoreViewPort;
window.cantkGetViewPort = cantkGetViewPort;

window.Shape = Shape;
window.UIElement = UIElement;
window.UIWindowManager = UIWindowManager;
window.ShapeFactory = ShapeFactory;

CanTK.UIImage = UIImage;

CanTK.Shape = Shape;
CanTK.UIElement = UIElement;

CanTK.init = function () {
}

CanTK.createElement = function(type) {
	return ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
}

CanTK.createElementWithJson = function(data) {
	var type = data.type;
	var el = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);

	if(el) {
		el.fromJson(data);
		el.setMode(Shape.MODE_RUNNING, true);
	}

	return el;
}

CanTK.UIElement.RUNNING = Shape.MODE_RUNNING;
CanTK.UIElement.DEFAULT_IMAGE = UIElement.IMAGE_DEFAULT;

CanTK.setResRoot = function(resRoot) {
	return ResLoader.setResRoot(resRoot);
}

