/*
 * File:   ui-grid-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid View(Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIGridView() {
	return;
}

UIGridView.prototype = new UIVScrollView();
UIGridView.prototype.isUIGrid = true;
UIGridView.prototype.isUILayout= true;
UIGridView.prototype.isUIGridView = true;
UIGridView.prototype.gridToJson = UIGrid.prototype.gridToJson;
UIGridView.prototype.gridFromJson = UIGrid.prototype.gridFromJson;
UIGridView.prototype.sortChildren = UIGrid.prototype.sortChildren;
UIGridView.prototype.initUIGrid = UIGrid.prototype.initUIGrid;
UIGridView.prototype.shapeCanBeChild = UIGrid.prototype.shapeCanBeChild;
UIGridView.prototype.childIsBuiltin = UIGrid.prototype.childIsBuiltin;
UIGridView.prototype.paintSelfOnly = UIGrid.prototype.paintSelfOnly;
UIGridView.prototype.calcItemSize = UIGrid.prototype.calcItemSize;
UIGridView.prototype.relayoutChildren = UIGrid.prototype.relayoutChildren;
UIGridView.prototype.afterChildAppended = UIGrid.prototype.afterChildAppended;
UIGridView.prototype.triggerUserEditingMode = UIGrid.prototype.triggerUserEditingMode;
UIGridView.prototype.isInUserEditingMode = UIGrid.prototype.isInUserEditingMode;
UIGridView.prototype.beforePaintChild = UIGrid.prototype.beforePaintChild;
UIGridView.prototype.afterPaintChild = UIGrid.prototype.afterPaintChild;
UIGridView.prototype.afterPaintChildren = UIGrid.prototype.afterPaintChildren;

UIGridView.prototype.initUIGridView = function(type, border, itemHeight, bg) {
	this.initUIGrid(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	

	return this;
}

UIGridView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

function UIGridViewCreator(border, itemSize, bg) {
	var args = ["ui-grid-view", "ui-grid-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridView();
		return g.initUIGridView(this.type, border, itemSize, bg);
	}
	
	return;
}

