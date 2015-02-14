var C_UI_WEIXIN_DEV = "";

function cantkWeiXinRegisterControls() {
	var shapeFactory = ShapeFactoryGet();
	shapeFactory.addShapeCreator(new UIWeixinCreator(), C_UI_WEIXIN_DEV);

	return;
}

cantkWeiXinRegisterControls();

