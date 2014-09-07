
var C_UI_GAMEUI_DEV = "";

function cantkGameRegisterControls() {
	var shapeFactory = ShapeFactoryGet();
	shapeFactory.addShapeCreator(new UISkeletonAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISpriteCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UITransformAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIFrameAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISoundCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIFootprintCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISceneCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UICircleCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIBoxCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIPolygonCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIPointCreator(), C_UI_GAMEUI_DEV);
//	shapeFactory.addShapeCreator(new UIWeldJointCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIRevoluteJointCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIDistanceJointCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIPulleyJointCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIEdgeCreator(), C_UI_GAMEUI_DEV);
//	shapeFactory.addShapeCreator(new UILineJointCreator(), C_UI_GAMEUI_DEV);

	return;
}

cantkGameRegisterControls();

