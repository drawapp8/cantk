/*
 * File:   ui-grid-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid View(Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGridView
 * @extends UIGrid
 * UIGridView和UIGrid类似，只是它可以垂直滚动。建议使用UIGridViewX。
 *
 */
function UIGridView() {
	return;
}

UIGridView.prototype = new UIVScrollView();
UIGridView.prototype.isUIGrid = true;
UIGridView.prototype.isUILayout= true;
UIGridView.prototype.isUIGridView = true;
UIGridView.prototype.doToJson = UIGrid.prototype.doToJson;
UIGridView.prototype.doFromJson = UIGrid.prototype.doFromJson;
UIGridView.prototype.sortChildren = UIGrid.prototype.sortChildren;
UIGridView.prototype.initUIGrid = UIGrid.prototype.initUIGrid;
UIGridView.prototype.shapeCanBeChild = UIGrid.prototype.shapeCanBeChild;
UIGridView.prototype.childIsBuiltin = UIGrid.prototype.childIsBuiltin;
UIGridView.prototype.paintSelfOnly = UIGrid.prototype.paintSelfOnly;
UIGridView.prototype.calcItemSize = UIGrid.prototype.calcItemSize;
UIGridView.prototype.relayoutChildren = UIGrid.prototype.relayoutChildren;
UIGridView.prototype.afterChildAppended = UIGrid.prototype.afterChildAppended;
UIGridView.prototype.isInDeleteMode = UIGrid.prototype.isInDeleteMode;
UIGridView.prototype.beforePaintChild = UIGrid.prototype.beforePaintChild;
UIGridView.prototype.afterPaintChild = UIGrid.prototype.afterPaintChild;
UIGridView.prototype.triggerDeleteMode = UIGrid.prototype.triggerDeleteMode;
UIGridView.prototype.setCheckable = UIGrid.prototype.setCheckable;
UIGridView.prototype.setChildChecked = UIGrid.prototype.setChildChecked;
UIGridView.prototype.isChildChecked = UIGrid.prototype.isChildChecked;

UIGridView.prototype.initUIGridView = function(type) {
	this.initUIGrid(type);
	this.initUIVScrollView(type, 0, null, null);	
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.setImage(UIElement.IMAGE_CHECKED_ITEM, null);

	return this;
}

UIGridView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

function UIGridViewCreator() {
	var args = ["ui-grid-view", "ui-grid-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridView();
		return g.initUIGridView(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridViewCreator());

