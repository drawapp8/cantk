/*
 * File:   ui-dialog.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Dialog
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDialog() {
	return;
}

UIDialog.prototype = new UIWindow();
UIDialog.prototype.isUIDialog = true;
UIDialog.prototype.isUIPopupWindow = true;

function UIDialogCreator(w, h, bg) {
	var args = ["ui-dialog", "ui-dialog", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDialog();
		g.initUIWindow(this.type, 0, 0, w, h, bg);
		
		g.setMargin(8, 8);
		g.xAttr = C_X_CENTER_IN_PARENT;
		g.yAttr = C_Y_MIDDLE_IN_PARENT;
		g.images.display = CANTK_IMAGE_DISPLAY_SCALE;
		g.setAnimHint("scale");

		return g;
	}
	
	return;
}

