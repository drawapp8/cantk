var C_UI_GAMEUI_DEV = "";

function cantkGameRegisterControls() {
	var shapeFactory = ShapeFactoryGet();
	shapeFactory.addShapeCreator(new UIParticlesCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIDraggerCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIArtTextCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIBitmapFontTextCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISkeletonAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISpriteCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UITransformAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIFrameAnimationCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISoundEffectsCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UISoundMusicCreator(), C_UI_GAMEUI_DEV);
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
	shapeFactory.addShapeCreator(new UIMouseJointCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIBulletCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIStatusCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UIImageLineCreator(), C_UI_GAMEUI_DEV);
	shapeFactory.addShapeCreator(new UITimerCreator(), C_UI_GAMEUI_DEV);
//	shapeFactory.addShapeCreator(new UILineJointCreator(), C_UI_GAMEUI_DEV);

	return;
}

cantkGameRegisterControls();

