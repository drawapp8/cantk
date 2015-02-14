
var C_UI_ELEMENTS = "";
function cantkRegisterUIElements() {
	var shapeFactory = ShapeFactoryGet();

//	shapeFactory.addShapeCreator(new UIVScrollViewGeneralCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageValueCreator(200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICircleLayoutCreator(400, 400), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVScrollImageCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIFlashCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHtmlViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVideoCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIShortcutCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILoadingWindowCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISuggestionCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISelectCreator("ui-select", 300, 50), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIFanMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISlidingMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStaticMapCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListItemGroupCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageButtonCreator(120, 90), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIContextMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIViewPagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorNormalCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorCircleCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorNumberCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorRectCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorLineCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageManagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScrollTextCreator("ui-vscroll-text", 200, 200), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScrollTextCreator("ui-hscroll-text", 200, 50), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageSlideViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageAnimationCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageNormalViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageThumbViewTapeCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageThumbViewGridCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGaugePointerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGaugeCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILedDigitsCreator(100, 100), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVCollapsableCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHCollapsableCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVLayoutCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVPlaceholderCreator(100, 20), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHLayoutCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHPlaceholderCreator(20, 100), C_UI_ELEMENTS);


	shapeFactory.addShapeCreator(new UITipsCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGridViewCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListViewCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISimpleHTMLCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorTileCreator(80, 80), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorButtonCreator(80, 80), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorBarCreator(100, 10), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStatusBarCreator("ui-status-bar", 640, 40, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStatusBarCreator("ui-menu-bar", 640, 96, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGroupCreator(200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListCheckBoxItemCreator(null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListRadioBoxItemCreator(null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISwitchCreator(154, 54, 154, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVScrollViewCreator(0, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHScrollViewCreator(0, null), C_UI_ELEMENTS);

	shapeFactory.addShapeCreator(new UIDeviceCreator("android", "", 420, 700), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScreenCreator(640, 960), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListItemCreator(null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIToolBarCreator("ui-toolbar", true, 85, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIDialogCreator(600, 400, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UINormalWindowCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWindowManagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGridCreator(5, 150, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIButtonGroupCreator(5, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIProgressBarCreator(200, 45, false, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIProgressBarCreator(200, 45, true, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILabelCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIEditCreator(120, 50, 12, 12, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIMLEditCreator(300, 300, 12, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageCreator("ui-icon", 32, 32, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageCreator("ui-image", 200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWaitBarCreator("ui-wait-box", 60, 60, null, UIElement.IMAGE_DISPLAY_CENTER), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWaitBarCreator("ui-wait-bar", 200, 24, null, UIElement.IMAGE_DISPLAY_SCALE), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIButtonCreator(120, 60), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICheckBoxCreator(160, 60, null, null, null, null,	null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIRadioBoxCreator(50, 50, null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICanvasCreator(200, 200), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUnkownCreator(), C_UI_ELEMENTS);

	return;
}

////////////////////////////////////empty functions///////////////////////}-{
UIWindowManager.prototype.setThisAsCurrentWindowManager = function() {
}

UIWindowManager.updateWindowThumbView = function(index) {
}

UIWindowManager.drawWindowThumbView = function(canvas, index) {
}

